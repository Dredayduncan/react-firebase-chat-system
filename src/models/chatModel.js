export class ChatModel {

    constructor(sender = "", chat = "", chatId = "", timeSent){
        this.sender = sender;
        this.chat = chat;
        this.chatId = chatId;
        this.timeSent = timeSent
    }
    
}