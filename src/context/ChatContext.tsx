import { ChatContextType, Message, Chat } from "@/services/type";
import React, { useEffect, useState, createContext, useContext } from "react";
import { v4 as uuidv4 } from "uuid";

const ChatContext = createContext<ChatContextType | undefined>(undefined);
export const useChat = () => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error("useChat must be used within a ChatProvider");
  }
  return context;
};
// Mock data
const generateMockChats = (): Chat[] => {
  const mockChats: Chat[] = [
    {
      id: "1",
      user: {
        id: "user1",
        name: "John Doe",
        avatar: "https://randomuser.me/api/portraits/men/1.jpg",
        online: true,
      },
      messages: [
        {
          id: "68bd732c80056ac2f82dc855",
          content: "Hi there!  is this house still available",
          sender: "user",
          timestamp: new Date(Date.now() - 3600000),
        },
        {
          id: "68bd732c80056ac2f82dc855",
          content: "yes",
          sender: "admin",
          timestamp: new Date(Date.now() - 3500000),
        },
        {
          id: "68bd732c80056ac2f82dc855",
          content: "okay",
          sender: "user",
          timestamp: new Date(Date.now() - 3400000),
        },
      ],
      unreadCount: 1,
    },
    {
      id: "2",
      user: {
        id: "user2",
        name: "Sarah Miller",
        avatar: "https://randomuser.me/api/portraits/women/2.jpg",
        online: false,
        lastSeen: new Date(Date.now() - 1800000),
      },
      messages: [
        {
          id: "68cac7e808eea59007e79412",
          content: "Hello, is this office still available",
          sender: "user",
          timestamp: new Date(Date.now() - 86400000),
        },
        {
          id: "68cac7e808eea59007e79412",
          content: "No, but we have at other locations",
          sender: "admin",
          timestamp: new Date(Date.now() - 86300000),
        },
        {
          id: "68cac7e808eea59007e79412",
          content: "where?",
          sender: "user",
          timestamp: new Date(Date.now() - 86200000),
        },
      ],
      unreadCount: 0,
    },
    {
      id: "3",
      user: {
        id: "user3",
        name: "Alex Johnson",
        avatar: "https://randomuser.me/api/portraits/men/3.jpg",
        online: true,
      },
      messages: [
        {
          id: "68cac82d08eea59007e79415",
          content: "Can i get something like this?",
          sender: "user",
          timestamp: new Date(Date.now() - 172800000),
        },
        {
          id: "68cac82d08eea59007e79415",
          content: "Yes, what is your budget?",
          sender: "admin",
          timestamp: new Date(Date.now() - 172700000),
        },
        {
          id: "68cac82d08eea59007e79415",
          content: "5m",
          sender: "user",
          timestamp: new Date(Date.now() - 172600000),
        },
      ],
      unreadCount: 2,
    },
  ];
  // Set last message for each chat
  mockChats.forEach((chat) => {
    chat.lastMessage = chat.messages[chat.messages.length - 1];
  });
  return mockChats;
};
export const ChatProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const [chats, setChats] = useState<Chat[]>(generateMockChats());
  const [activeChat, setActiveChat] = useState<Chat | null>(null);
  const [showSidebar, setShowSidebar] = useState(true);
  // Check if we're on mobile view
  const [isMobileView, setIsMobileView] = useState(window.innerWidth < 768);
  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      setIsMobileView(window.innerWidth < 768);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  useEffect(() => {
    // Set the first chat as active by default
    if (chats.length > 0 && !activeChat) {
      setActiveChat(chats[0]);
    }
  }, [chats, activeChat]);
  // When a chat is selected on mobile, hide sidebar
  const handleSetActiveChat = (chat: Chat | null) => {
    setActiveChat(chat);
    if (isMobileView && chat) {
      setShowSidebar(false);
    }
  };
  const sendMessage = (content: string) => {
    if (!activeChat) return;
    const newMessage: Message = {
      id: uuidv4(),
      content,
      sender: "admin",
      timestamp: new Date(),
    };
    const updatedChat = {
      ...activeChat,
      messages: [...activeChat.messages, newMessage],
      lastMessage: newMessage,
    };
    setChats((prevChats) =>
      prevChats.map((chat) => (chat.id === activeChat.id ? updatedChat : chat))
    );
    setActiveChat(updatedChat);
    // Simulate a response after a delay
    setTimeout(() => {
      const responseMessage: Message = {
        id: uuidv4(),
        content: "Thanks for your response! I appreciate your help.",
        sender: "user",
        timestamp: new Date(),
      };
      const updatedChatWithResponse = {
        ...updatedChat,
        messages: [...updatedChat.messages, responseMessage],
        lastMessage: responseMessage,
        unreadCount: updatedChat.unreadCount + 1,
      };
      setChats((prevChats) =>
        prevChats.map((chat) =>
          chat.id === activeChat.id ? updatedChatWithResponse : chat
        )
      );
      setActiveChat(updatedChatWithResponse);
    }, 2000);
  };
  const copyMessageId = (id: string) => {
    navigator.clipboard.writeText(id);
  };
  return (
    <ChatContext.Provider
      value={{
        chats,
        activeChat,
        setActiveChat: handleSetActiveChat,
        sendMessage,
        copyMessageId,
        isMobileView,
        showSidebar,
        setShowSidebar,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};
