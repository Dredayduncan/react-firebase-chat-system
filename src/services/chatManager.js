// import "firebase/compat/firestore";
import { db } from "../firebase";
import { arrayUnion } from "firebase/firestore";
const { encrypt } = require("../utils/encryption.js");

export class ChatManager {
  constructor() {
    this.senderId = "2";
    this.messages = db.collection("messages");
    this.chats = db.collection("chats");
  }

  // get the Id of chat between the current user and the selected respondent
  async getChatId({ senderId, recipientId }) {
    try {
      const document = await this.messages
        .doc(senderId)
        .collection("recipients")
        .doc(recipientId)
        .get();

      if (document.exists) {
        return document.data();
      }

      return "";
    } catch (exception) {
      console.error(exception);
      return "An error occurred while retrieving your chat";
    }
  }

  // Get the chats the current user has with the given respondent
  getChatStream(chatId) {
    return this.chats.doc(chatId);
  }

  // generate a shared secret key with the public key of the recipient
  static async getUserKeyPair(userId) {
    const userInfo = await db.collection("users").doc(userId).get();

    if (userInfo.exists) {
      return userInfo.data();
    }

    return null;
  }

  /* Start a new conversation with the respondent where the messageID
    is a concatenation of the sender's id and the recipient's id
  */
  async sendChat(
    recipientId,
    existingChatId,
    secretKey,
    chat,
    onSubmitNewChat,
    isNewChat = false
  ) {
    // create the chat
    try {
      let document;
      let chatId;

      if (existingChatId !== "") {
        document = this.chats.doc(existingChatId);
      } else {
        document = this.chats.doc();
      }

      const encryptedMessage = encrypt(chat,  secretKey);

      await document.set(
        {
          senderId: this.senderId,
          recipientId,
          chats: arrayUnion(
            {
              chat: encryptedMessage,
              rawChat: chat,
              sender: this.senderId,
              timeSent: new Date(),
            },
          ),
        },
        { merge: true }
      );

      // update the id of the provider with the new chat Id
      if (isNewChat) {
        onSubmitNewChat(document.id);
      }

      // get the id of the chat document that was just created
      chatId = isNewChat ? document.id : existingChatId;

      // check if the conversation is happening for the first time
      if (isNewChat) {
        // add the chat record to the sender's data
        await this.messages
          .doc(this.senderId)
          .collection("recipients")
          .doc(recipientId)
          .set({ chatId });

        // add the chat record to the recipient's data
        await this.messages
          .doc(recipientId)
          .collection("recipients")
          .doc(this.senderId)
          .set({ chatId });
      }

      // send a push notification
      // await CustomNotification.sendNotification(
      //   toPushToken: recipientPushToken,
      //   title: "Message from ${user.name}",
      //   body: chat
      // );

      return;
    } catch (exception) {
      console.error(exception);
      return "An error occurred while sending your message";
    }
  }
}
