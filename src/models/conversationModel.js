export class ConversationModel {

    constructor(senderId = "", recipientId = "", chats = [], sharedKey = ""){
        this.senderId = senderId;
        this.recipientId = recipientId;
        this.chats = chats;
        this.sharedKey = sharedKey;
    }


}