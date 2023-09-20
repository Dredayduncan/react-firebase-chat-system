import React, { useEffect, useState } from "react";
import styles from "@chatscope/chat-ui-kit-styles/dist/default/styles.min.css";
import {
  MainContainer,
  ChatContainer,
  MessageList,
  Message,
  MessageInput,
} from "@chatscope/chat-ui-kit-react";
import { ChatManager } from "../services/chatManager";
import {decrypt} from "../utils/encryption";

function StreamProvider({ chatId, children }) {
  const [chatStream, setChatStream] = useState(null);
  const [chatManager, _] = useState(()=>new ChatManager());
  

  useEffect(() => {

    if (chatId) {
      const chatStream = chatManager.getChatStream(chatId).onSnapshot(
        (snapshot) => {
          if (snapshot.exists) {
            // Handle chat stream updates here
            const chatData = snapshot.data();
            console.log(chatData);
            setChatStream(chatData);
          } else {
            // Handle the case where the document doesn't exist
            setChatStream(null);
            console.log("Document does not exist.");
          }
        },
        (error) => {
          console.error("Error fetching chat data:", error);
        }
      );

      return () => {
        // Unsubscribe from the chat stream when the component unmounts
        chatStream();
      };
    }
  }, [chatId, chatManager]);
    
  return (
    <div style={{ position: "relative", height: "500px" }}>
      {/* // Render your chat interface components with chatStream data */}
        <div>
          {
            <MainContainer>
              <ChatContainer>
                <MessageList>
                  {/* Render messages from chatStream */}
                  {chatStream ? chatStream.chats.map((message, index) => (
                    <Message
                      key={index}
                      model={{
                        message: decrypt(message.chat, chatStream.sharedKey),
                        sentTime: message.timeSent
                          .toDate()
                          .toLocaleTimeString(),
                        sender: message.sender,
                      }}
                    />
                  )) : null}
                </MessageList>
                <MessageInput
                  placeholder="Type message here"
                  onSend={(innerHtml, textContent, innerText, nodes) => {
                      chatManager.sendChat("3", "", textContent, true);
                      console.log("here");
                  }}
                />
              </ChatContainer>
            </MainContainer>
          }
        </div>
    </div>
  );
}

export { StreamProvider };
