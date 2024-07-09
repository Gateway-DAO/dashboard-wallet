import { CryptoService } from "./crypto";
import { util, cipher, random } from "node-forge";

describe("CryptoService", () => {
  let rsaKeyPair: { publicKey: string; privateKey: string; keyType: string };
  const data = "This is a test string to encrypt";
  const aesKey = util.encode64(random.getBytesSync(32));
  const iv = util.encode64(random.getBytesSync(12));

  beforeAll(async () => {
    rsaKeyPair = await CryptoService.generateRsaKeyPair();
  });

  describe("RSA Encryption and Decryption", () => {
    let encryptedData: string;

    test("should encrypt data using RSA", () => {
      encryptedData = CryptoService.encryptRSA(rsaKeyPair.publicKey, data);
      expect(typeof encryptedData).toBe("string");
      expect(() => Buffer.from(encryptedData, "base64")).not.toThrow();
    });

    test("should decrypt data using RSA", () => {
      const decryptedData = CryptoService.decryptRSA(
        rsaKeyPair.privateKey,
        encryptedData,
      );
      expect(decryptedData).toBe(data);
    });

    test("should throw an error when decrypting with incorrect data", () => {
      const tamperedData =
        encryptedData.slice(0, -1) +
        (encryptedData.slice(-1) === "A" ? "B" : "A");
      expect(() => {
        CryptoService.decryptRSA(rsaKeyPair.privateKey, tamperedData);
      }).toThrow();
    });
  });

  describe("AES-GCM Decryption", () => {
    test("should decrypt AES-GCM encrypted data", () => {
      const aesKeyBytes = util.decode64(aesKey);
      const ivBytes = util.decode64(iv);
      const cipherKey = cipher.createCipher("AES-GCM", aesKeyBytes);
      cipherKey.start({ iv: ivBytes });
      cipherKey.update(util.createBuffer(data, "utf8"));
      cipherKey.finish();
      const encryptedData = util.encode64(cipherKey.output.getBytes());
      const tag = util.encode64(cipherKey.mode.tag.getBytes());

      const decryptedData = CryptoService.decryptAES(
        encryptedData,
        aesKey,
        iv,
        tag,
      );
      expect(decryptedData).toBe(data);
    });

    test("should throw an error if decryption fails with a specific error message", () => {
      const encryptedData = "invalid data";
      const tag = "invalid tag";

      expect(() => {
        CryptoService.decryptAES(encryptedData, aesKey, iv, tag);
      }).toThrow("Decryption failed.");
    });
  });
});
