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
}
