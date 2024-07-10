import { createDecipheriv } from 'crypto';
import { random, cipher, util, Bytes, pki, md } from 'node-forge';

export interface KeyPair {
  publicKey: string;
  privateKey: string;
  keyType: string;
}

export class CryptoService {
  static generateKey(): Bytes {
    return random.getBytesSync(32);
  }

  static generateIV(): Bytes {
    return random.getBytesSync(16);
  }

  static bytesToString(bytes: Bytes): string {
    return util.encode64(bytes);
  }

  static encryptString(longString: string, key: Bytes, iv: Bytes) {
    const blockCypher = cipher.createCipher('AES-CBC', key);
    blockCypher.start({ iv: iv });
    blockCypher.update(util.createBuffer(longString, 'utf8'));
    blockCypher.finish();
    return util.encode64(blockCypher.output.getBytes());
  }

  static decryptAES(
    encryptedString: string,
    base64Key: string,
    base64IV: string,
    base64Tag?: string
  ) {
    try {
      const key = util.decode64(base64Key);
      const iv = util.decode64(base64IV);
      const tag = base64Tag
        ? util.createBuffer(util.decode64(base64Tag))
        : undefined;

      const decipher = cipher.createDecipher('AES-CBC', key);
      if (tag) {
        decipher.start({ iv, tag });
      } else {
        decipher.start({ iv });
      }

      const decodedString = util.decode64(encryptedString);
      const buffer = util.createBuffer(decodedString);
      decipher.update(buffer);

      const success = decipher.finish();

      if (!success) {
        throw new Error(decipher.output.toString());
      }
      return decipher.output.toString();
    } catch (e) {
      console.log(e);
      throw new Error(`Decryption failed.`);
    }
  }

  static base64ToObject<T = any>(base64: string): T {
    return JSON.parse(util.decode64(base64));
  }

  static base64ToPem(base64EncodedString: string): string {
    const bytes = Buffer.from(base64EncodedString, 'base64');
    const pemString = bytes.toString('utf8');
    return pemString;
  }

  static async rsaDecryptOaepSha256(
    base64EncodedEncryptedData: string,
    pemPrivateKey: string
  ): Promise<Uint8Array> {
    const encryptedData = Buffer.from(
      base64EncodedEncryptedData,
      'base64'
    ).toString('binary');

    const privateKey = pki.privateKeyFromPem(pemPrivateKey);

    const decryptedData = privateKey.decrypt(encryptedData, 'RSA-OAEP', {
      md: md.sha256.create(),
    });

    const decryptedBuffer = Buffer.from(decryptedData, 'binary');

    if (![16, 24, 32].includes(decryptedBuffer.length)) {
      throw new Error(`Invalid key length: ${decryptedBuffer.length * 8} bits`);
    }

    return new Uint8Array(decryptedBuffer);
  }

  static async decryptEncryptedJson(
    cipherJson: any,
    pemPrivateKey: string
  ): Promise<string> {
    const aesKey = await this.decryptKeyBlob(cipherJson.keyBlob, pemPrivateKey);

    const decryptedData = await this.decryptAesGcm({
      base64EncodedEncryptedData: cipherJson.aesBlob,
      base64EncodedIv: cipherJson.iv,
      base64EncodedTag: cipherJson.tag,
      aesKey: aesKey!,
    });

    return decryptedData;
  }

  static async decryptKeyBlob(
    base64EncodedEncryptedKey: string,
    pemPrivateKey: string
  ): Promise<Uint8Array> {
    const result = await this.rsaDecryptOaepSha256(
      base64EncodedEncryptedKey,
      pemPrivateKey
    );
    return result;
  }

  static async decryptAesGcm({
    base64EncodedEncryptedData,
    base64EncodedIv,
    base64EncodedTag,
    aesKey,
  }: {
    base64EncodedEncryptedData: string;
    base64EncodedIv: string;
    base64EncodedTag: string;
    aesKey: Uint8Array;
  }): Promise<string> {
    const encryptedData = Buffer.from(base64EncodedEncryptedData, 'base64');
    const tag = Buffer.from(base64EncodedTag, 'base64');

    if (![16, 24, 32].includes(aesKey.length)) {
      throw new Error(`Invalid AES key length: ${aesKey.length * 8} bits`);
    }

    const decipher = createDecipheriv(
      'aes-256-gcm',
      aesKey,
      Buffer.from(base64EncodedIv, 'base64')
    );

    decipher.setAuthTag(tag);

    const decrypted = Buffer.concat([
      decipher.update(encryptedData),
      decipher.final(),
    ]);

    const decryptedString = Buffer.from(
      decrypted.toString(),
      'base64'
    ).toString('utf8');

    return decryptedString;
  }
}
