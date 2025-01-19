import React, { useState } from "react";
import ChatWindow from "./components/chatWindow";
import InputSection from "./components/InputSection";
import { MessageProps } from "./components/Message";
import axios from "axios";
import "./App.css";

const App: React.FC = () => {
  const [messages, setMessages] = useState<MessageProps[]>([]);
  const [input, setInput] = useState<string>("");
 

  const handleSend = async () => {
    if (input.trim()) {
      const userMessage: MessageProps = { sender: "user", text: input };
      setMessages((prev) => [...prev, userMessage]);

      const botResponse = await getChatbotResponse(input);
      const botMessage: MessageProps = { sender: "bot", text: botResponse };
      setMessages((prev) => [...prev, botMessage]);

      setInput(""); 
    }
  };

  const getChatbotResponse = async (query: string): Promise<string> => {
    const apiKey = process.env.REACT_APP_API_KEY;
    const endpoint = "https://api.openai.com/v1/chat/completions";

    const retryDelay = 2000; 
    const maxRetries = 5; 

    const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        const response = await axios.post(
          endpoint,
          {
            model: "gpt-3.5-turbo",
            messages: [
              { role: "system", content: "You are a healthcare assistant chatbot." },
              { role: "user", content: query },
            ],
          },
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${apiKey}`,
            },
          }
        );
        return response.data.choices[0].message.content.trim();
      } catch (error: unknown) {
        if (axios.isAxiosError(error)) {
          if (error.response && error.response.status === 429) {
            console.log(`Rate limit exceeded. Retrying in ${retryDelay / 1000} seconds...`);
            if (attempt < maxRetries) {
              await delay(retryDelay); 
            } else {
              return "I'm having trouble responding right now due to high traffic. Please try again later.";
            }
          } else {
            console.error("Error with ChatGPT API:", error.response?.data || error.message);
            return "I'm having trouble responding right now. Please try again later.";
          }
        } else {
          console.error("An unknown error occurred:", error);
          return "An unexpected error occurred. Please try again later.";
        }
      }
    }
    return "";
  };

  return (
    <div className="app">
     
      <div className="chat-container">
        <ChatWindow messages={messages} />
        <InputSection input={input} setInput={setInput} handleSend={handleSend} />
      </div>
    </div>
  );
};

export default App;
