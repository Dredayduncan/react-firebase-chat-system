import { AES, enc } from 'crypto-js';

export function encrypt(message, password) {
  // Encrypt
  let cipherText = AES.encrypt(
    message,
    password
  ).toString();

  return cipherText;
}

export function decrypt(message, password) {
  // Decrypt
  let bytes = AES.decrypt(message, password);
  let originalText = bytes.toString(enc.Utf8);

  return originalText;
}
