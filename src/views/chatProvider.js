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
import { decrypt } from "../utils/encryption";

function ChatProvider({ dhEngine, chatId, children }) {
  const [chatStream, setChatStream] = useState(null);
  let senderId = "2";
  let recipientId = "1";

  const [senderPublicKey, setSenderPublicKey] = useState("");
  const [recipientPublicKey, setRecipientPublicKey] = useState("");
  const [existingChatId, setExistingChatId] = useState(chatId);
  const [chatManager, _] = useState(() => new ChatManager());


  useEffect(() => {
    if (existingChatId) {
      const chatStream = chatManager.getChatStream(existingChatId).onSnapshot(
        (snapshot) => {
          if (snapshot.exists) {
            // Handle chat stream updates here
            const chatData = snapshot.data();
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

      // get the sender's public key
      ChatManager.getUserKeyPair(senderId).then((result) => {
        setSenderPublicKey(result.publicKey);
      });

      // get the recipient's public key
      ChatManager.getUserKeyPair(recipientId).then((result) => {
        setRecipientPublicKey(result.publicKey);
      });

      return () => {
        // Unsubscribe from the chat stream when the component unmounts
        chatStream();
      };
    }
  }, [existingChatId, chatManager, recipientId, senderId, dhEngine]);


  useEffect(()=>{
    setExistingChatId(chatId);
  }, [chatId]);

  return (
    <div style={{ position: "relative", height: "500px" }}>
      {/* // Render your chat interface components with chatStream data */}
      <div>
        {
          <MainContainer>
            <ChatContainer>
              <MessageList>
                {/* Render messages from chatStream */}
                {chatStream && senderPublicKey && recipientPublicKey
                  ? chatStream.chats.map((message, index) => (
                
                      <Message
      
                        key={index}
                        model={{
                          direction: message.sender === senderId ? 1 : 0,
                          message: decrypt(
                            message.chat,
                            dhEngine.generateDecryptionSecretKey(
                              message.sender === senderId,
                              senderPublicKey,
                              recipientPublicKey
                            )
                          ),
                          sentTime: message.timeSent
                            .toDate()
                            .toLocaleTimeString(),
                          sender: message.sender,
                        }}
                      />
                  ))
                  : null}
              </MessageList>
              <MessageInput
                placeholder="Type message here"
                onSend={(innerHtml, textContent, innerText, nodes) => {
          
                  chatManager.sendChat(
                    "1",
                    existingChatId,
                    dhEngine.generateEncryptionSecretKey(recipientPublicKey),
                    textContent,
                    (newChatId) => {
                      setExistingChatId(newChatId);
                    },
                    existingChatId === ""
                  );
                }}
              />
            </ChatContainer>
          </MainContainer>
        }
      </div>
    </div>
  );
}

export { ChatProvider };
