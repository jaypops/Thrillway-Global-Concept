import React, { useEffect, useRef } from "react";
import { useChat } from "@/context/ChatContext";
import ChatMessage from "./ChatMessage";
import ChatInput from "./ChatInput";
import { format } from "date-fns";
import { ArrowLeftIcon } from "lucide-react";

const ChatWindow: React.FC = () => {
  const { activeChat, isMobileView, setShowSidebar } = useChat();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [activeChat?.messages]);

  if (!activeChat) return null;

  const handleBackClick = () => setShowSidebar(true);

  return (
    <div className="flex-1 flex flex-col h-full bg-[#d8dfe5] relative">
     <div className="sticky top-0 z-10 p-4 bg-white text-[#111] flex items-center justify-between shadow-md">
        <div className="flex items-center">
          {isMobileView && (
            <button
              onClick={handleBackClick}
              className="mr-2 p-1 rounded-full hover:bg-blue-700 transition-colors"
            >
              <ArrowLeftIcon className="h-5 w-5" />
            </button>
          )}
          <img
            src={activeChat.user.avatar}
            alt={activeChat.user.name}
            className="w-10 h-10 rounded-full mr-3 object-cover"
          />
          <div>
            <h2 className="font-medium">{activeChat.user.name}</h2>
            <p className="text-xs text-gray-600">
              {activeChat.user.online
                ? "Online"
                : activeChat.user.lastSeen
                ? `Last seen ${format(activeChat.user.lastSeen, "HH:mm")}`
                : "Offline"}
            </p>
          </div>
        </div>
      </div>

      <div
        ref={messagesContainerRef}
        className="flex-1 overflow-y-auto p-4 pt-20"
      >
        {activeChat.messages.map((message) => (
          <ChatMessage key={message.id} message={message} />
        ))}
        <div ref={messagesEndRef} />
      </div>

      <div className="sticky bottom-0 bg-white">
        <ChatInput />
      </div>
    </div>
  );
};

export default ChatWindow;
