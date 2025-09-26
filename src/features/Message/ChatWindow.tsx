import React, { useEffect, useRef } from "react";
import { useChat } from "@/context/ChatContext";
import ChatMessage from "./ChatMessage";
import ChatInput from "./ChatInput";
import { format } from "date-fns";
import { ArrowLeftIcon } from "lucide-react";
const ChatWindow: React.FC = () => {
  const { activeChat, isMobileView, setShowSidebar } = useChat();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [activeChat?.messages]);
  if (!activeChat) return null;
  const handleBackClick = () => {
    setShowSidebar(true);
  };
  return (
    <div className="flex-1 flex flex-col h-full">
      {/* Header */}
      <div className="p-4 bg-blue-600 text-white flex items-center justify-between">
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
            <p className="text-xs text-blue-100">
              {activeChat.user.online
                ? "Online"
                : activeChat.user.lastSeen
                ? `Last seen ${format(activeChat.user.lastSeen, "HH:mm")}`
                : "Offline"}
            </p>
          </div>
        </div>
        {/* <div className="flex space-x-4">
          <button className="text-white hover:text-blue-200">
            <PhoneIcon className="h-5 w-5" />
          </button>
          <button className="text-white hover:text-blue-200">
            <VideoIcon className="h-5 w-5" />
          </button>
          <button className="text-white hover:text-blue-200">
            <MoreHorizontalIcon className="h-5 w-5" />
          </button>
        </div> */}
      </div>
      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 bg-[#e5ded8]">
        {activeChat.messages.map((message) => (
          <ChatMessage key={message.id} message={message} />
        ))}
        <div ref={messagesEndRef} />
      </div>
      {/* Input */}
      <ChatInput />
    </div>
  );
};
export default ChatWindow;
