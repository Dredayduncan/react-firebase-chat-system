import logo from './logo.svg';
import './App.css';
import React, { useEffect, useState } from 'react';
import { StreamProvider } from './views/chatView';
import { ChatManager } from './services/chatManager';

function App() {
  const [chatId, setChatId] = useState(null);


  useEffect(() => {
    const chatManager = new ChatManager(); // Create an instance of your ChatManager

    // Call getChatId to get the chatId
    chatManager.getChatId({ senderId: '1', recipientId: '3' })
    .then(result => {
        if (result) {
          setChatId(result.chatId);
        }
      })
      .catch(error => {
        console.error('Error getting chatId:', error);
      });
  }, []);

  return (
    <div style={{ position: "relative", height: "500px" }}>
      {/* // If chatId is available, render the StreamProvider with chatId */}
        <StreamProvider chatId={chatId ? chatId : ""}>
        </StreamProvider>
      {/* {chatId ? (
        
      ) : (
        <p>Loading chat...</p>
      )} */}
</div>
  );
}

export default App;
