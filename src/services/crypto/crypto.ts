import { random, cipher, util, Bytes } from 'node-forge';

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

  static decryptStringToBase64(encryptedString: string, key: Bytes, iv: Bytes) {
    const decipher = cipher.createDecipher('AES-CBC', key);
    decipher.start({ iv: iv });
    const decodedString = util.decode64(encryptedString);
    const buffer = util.createBuffer(decodedString);
    decipher.update(buffer);
    const result = decipher.finish();
    console.log(result, decipher.output);
    return result ? decipher.output.toString() : null;
  }

  static base64ToObject<T = any>(base64: string): T {
    return JSON.parse(util.decode64(base64));
  }
}
