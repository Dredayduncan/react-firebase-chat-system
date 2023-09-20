import "firebase/compat/firestore";
import { db } from "../firebase";
import { ChatManager } from "../services/chatManager";
import { DiffieHellman } from "diffie-hellman-js";
const { encrypt, decrypt } = require("../utils/encryption.js");

export class DHEncryption {
  constructor() {
    this.userId = "2";
    this.userPassword = "password12";
    this.users = db.collection("users");
    this.dhEngine = new DiffieHellman("3072", "2");
  }

  // update the encryption keys of the user in firebase
  async updateEncryptionKeys() {
    // generate the encryption keys with Diffie-hellman

    // check if the user already has a public key, and set one
    let userKeys = await ChatManager.getUserKeyPair(this.userId);

    this.dhEngine.generateKeys();

      console.log(`Public Key: ${this.dhEngine.getPublicKey()}`);
      console.log(`Private Key: ${this.dhEngine.getPrivateKey()}`);

    // only generate a key pair if the user does not have one
    if (userKeys == null) {
      this.dhEngine.generateKeys();

      console.log(`Public Key: ${this.dhEngine.getPublicKey()}`);
      console.log(`Private Key: ${this.dhEngine.getPrivateKey()}`);

      // store the user's public key and private key in firebase with the former being encrypted with the user's password
      await this.users.doc(this.userId).set({
        publicKey: this.dhEngine.getPublicKey(),
        privateKey: encrypt(
          this.dhEngine.getPrivateKey(),
          this.userPassword
        ),
      });
    } else {
      this.dhEngine.setPrivateKey(decrypt(
        userKeys.privateKey,
        this.userPassword
      ));
    }
  }

  // generate a shared secret key used to encrypt the message with using the recipient's public key
  generateEncryptionSecretKey(recipientPublicKey) {
    this.dhEngine.computeSecretKey(recipientPublicKey);
    let secretKey = this.dhEngine.getSharedSecretKey();

    console.log(`Encryption secret key: ${secretKey}`);

    return secretKey;
  }

  // Generate the key that would be used to decrypt the chat messages
  generateDecryptionSecretKey(isMe, senderPublicKey, recipientPublicKey) {
    this.dhEngine.computeSecretKey(
      isMe ? recipientPublicKey : senderPublicKey
    );

    // console.log(`Decryption SECRET KEY: ${secretKey}`);

    return this.dhEngine.getSharedSecretKey();
  }
}
