import * as crypto from 'crypto';

export abstract class PasswordUtil {
  static decodeBase64Password(password: string) {
    return Buffer.from(password, 'base64').toString('utf-8');
  }

  static hashPassword(password: string) {
    return crypto.createHash('sha256').update(password).digest('hex');
  }

  static decryptSymmetric(encryptedData: any, iv: string) {
    const algorithm = 'aes-256-cbc'; // AES encryption algorithm
    const secretKey = process.env.TTL_SECRET_KEY;
    const key = Buffer.from(secretKey, 'base64');
    const decipher = crypto.createDecipheriv(algorithm, key, Buffer.from(iv, 'hex'));
    let decrypted = decipher.update(encryptedData, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
  }

  static randomPassword(count: number) {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;

    // Generate random bytes and map them to the character set
    return Array.from(crypto.randomBytes(count))
      .map((byte) => characters[byte % charactersLength])
      .join('');
  }

  static generateOtp(length: number = 6): string {
    if (length <= 0) {
      throw new Error("Độ dài OTP phải lớn hơn 0");
    }
    let otp = '';
    for (let i = 0; i < length; i++) {
      otp += crypto.randomInt(0, 10).toString(); // Secure digit 0–9
    }
    return otp;
  }


}