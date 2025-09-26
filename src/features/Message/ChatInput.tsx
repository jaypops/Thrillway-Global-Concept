import React, { useState } from "react";
import { useChat } from "@/context/ChatContext";
import { SendIcon, SmileIcon } from "lucide-react";
const ChatInput: React.FC = () => {
  const [message, setMessage] = useState("");
  const { sendMessage } = useChat();
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim()) {
      sendMessage(message);
      setMessage("");
    }
  };
  return (
    <div className="bg-white p-4 border-t border-gray-200">
      <form onSubmit={handleSubmit} className="flex items-center space-x-2">
        <button
          type="button"
          className="p-2 rounded-full text-gray-500 hover:bg-gray-100"
        >
          <SmileIcon className="h-6 w-6" />
        </button>
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type a message"
          className="flex-1 py-2 px-4 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
   
          <button
            type="submit"
            className="p-2 bg-blue-600 rounded-full text-white hover:bg-blue-700"
          >
            <SendIcon className="h-6 w-6" />
          </button>
      </form>
    </div>
  );
};
export default ChatInput;
