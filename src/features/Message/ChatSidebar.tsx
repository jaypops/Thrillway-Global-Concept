import React, { useState } from "react";
import { useChat } from "@/context/ChatContext";
import { Chat } from "@/services/type";
import { format } from "date-fns";
import { SearchIcon } from "lucide-react";

const ChatSidebar: React.FC = () => {
  const { chats, activeChat, setActiveChat } = useChat();
  const [search, setSearch] = useState("");

  const filteredChats = chats.filter((chat) =>
    chat.user.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="w-full h-full bg-white border-r border-gray-200 flex flex-col">
      {/* Search Bar */}
      <div className="p-3 border-b border-gray-200 sticky top-0 z-10 bg-white">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <SearchIcon className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search for chat"
            className="w-full py-2 pl-10 pr-4 rounded-lg bg-gray-100 border-none focus:ring-2 focus:ring-blue-500 outline-none"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* Chat List */}
      <div className="flex-1 overflow-y-auto">
        {filteredChats.length > 0 ? (
          filteredChats.map((chat) => (
            <ChatItem
              key={chat.id}
              chat={chat}
              isActive={activeChat?.id === chat.id}
              onClick={() => setActiveChat(chat)}
            />
          ))
        ) : (
          <div className="p-6 text-center text-gray-500 text-sm">
            No chats found
          </div>
        )}
      </div>
    </div>
  );
};

interface ChatItemProps {
  chat: Chat;
  isActive: boolean;
  onClick: () => void;
}

const ChatItem: React.FC<ChatItemProps> = ({ chat, isActive, onClick }) => {
  return (
    <div
      className={`p-3 flex items-center cursor-pointer transition-colors duration-200 rounded-2xl ${
        isActive ? "bg-gray-100" : "hover:bg-gray-50"
      }`}
      onClick={onClick}
    >
      {/* Avatar */}
      <div className="relative mr-3">
        <img
          src={chat.user.avatar}
          alt={chat.user.name}
          className="w-12 h-12 rounded-full object-cover"
        />
        {chat.user.online && (
          <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white" />
        )}
      </div>

      {/* Chat Info */}
      <div className="flex-1 min-w-0">
        <div className="flex justify-between items-center">
          <h3 className="text-sm font-medium text-gray-900 truncate">
            {chat.user.name}
          </h3>
          {chat.lastMessage && (
            <span className="text-xs text-gray-500">
              {format(chat.lastMessage.timestamp, "HH:mm")}
            </span>
          )}
        </div>
        {chat.lastMessage && (
          <p className="text-sm text-gray-500 truncate">
            {chat.lastMessage.sender === "admin" ? "You: " : ""}
            {chat.lastMessage.content}
          </p>
        )}
      </div>

      {/* Unread Badge */}
      {chat.unreadCount > 0 && (
        <div className="ml-2 bg-blue-600 rounded-full w-5 h-5 flex items-center justify-center">
          <span className="text-xs text-white font-medium">
            {chat.unreadCount}
          </span>
        </div>
      )}
    </div>
  );
};

export default ChatSidebar;
