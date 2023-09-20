import './App.css';
import React, { useEffect, useState } from 'react';
import { ChatProvider } from './views/chatProvider';
import { ChatManager } from './services/chatManager';
import { DHEncryption } from './utils/dh_encryption';


function App() {
  const [chatId, setChatId] = useState(null);
  const [dhEngine, _] = useState(() => new DHEncryption());


  useEffect(() => {
    const chatManager = new ChatManager(); // Create an instance of your ChatManager

    /* The code is updating the
    encryption keys used for secure communication in the chat application. */
    dhEngine.updateEncryptionKeys().then(result => {
      console.log("updated");
    }).catch(error => {
      console.error('Error updating keys:', error);
    });

    // Call getChatId to get the chatId
    chatManager.getChatId({ senderId: '2', recipientId: '1' })
    .then(result => {
        if (result) {
          setChatId(result.chatId);
        }
      })
      .catch(error => {
        console.error('Error getting chatId:', error);
      });
  }, [chatId, dhEngine]);

  return (
    <div style={{ position: "relative", height: "500px" }}>
      {/* // If chatId is available, render the ChatProvider with chatId */}
      <ChatProvider dhEngine={dhEngine} chatId={chatId ? chatId : ""}>
          </ChatProvider>
        
</div>
  );
}

export default App;
