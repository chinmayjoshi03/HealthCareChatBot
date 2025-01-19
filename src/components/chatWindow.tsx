import React from "react";
import { MessageProps } from "./Message";

interface ChatWindowProps {
  messages: MessageProps[];
}

const ChatWindow: React.FC<ChatWindowProps> = ({ messages }) => {
  return (
    <div className="chat-window">
      {/* Header */}
      <div className="chat-header">
        <h2>Healthcare Chatbot</h2>
      </div>

      {/* Messages */}
      {messages.map((msg, index) => (
        <div
          key={index}
          className={`message ${msg.sender}`} 
          style={{
            animation: `fadeIn 0.5s ease-out ${index * 0.2}s`,
          }}
        >
          {msg.text}
        </div>
      ))}
    </div>
  );
};

export default ChatWindow;
