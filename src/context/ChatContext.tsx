import React, {
  useEffect,
  useState,
  createContext,
  useContext,
  ReactNode,
} from "react";
import { v4 as uuidv4 } from "uuid";
import { ChatContextType, Message, Chat } from "@/services/type";

// Create context
const ChatContext = createContext<ChatContextType | undefined>(undefined);

// Hook for using chat context
export const useChat = () => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error("useChat must be used within a ChatProvider");
  }
  return context;
};

// Generate mock chat data
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
          id: uuidv4(),
          content: "Hi there! Is this house still available?",
          sender: "user",
          timestamp: new Date(Date.now() - 3600000),
        },
        {
          id: uuidv4(),
          content: "Yes, it is.",
          sender: "admin",
          timestamp: new Date(Date.now() - 3500000),
        },
        {
          id: uuidv4(),
          content: "Okay, thanks!",
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
          id: uuidv4(),
          content: "Hello, is this office still available?",
          sender: "user",
          timestamp: new Date(Date.now() - 86400000),
        },
        {
          id: uuidv4(),
          content: "No, but we have others at nearby locations.",
          sender: "admin",
          timestamp: new Date(Date.now() - 86300000),
        },
        {
          id: uuidv4(),
          content: "Where exactly?",
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
          id: uuidv4(),
          content: "Can I get something like this?",
          sender: "user",
          timestamp: new Date(Date.now() - 172800000),
        },
        {
          id: uuidv4(),
          content: "Yes, what’s your budget?",
          sender: "admin",
          timestamp: new Date(Date.now() - 172700000),
        },
        {
          id: uuidv4(),
          content: "Around 5 million.",
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

// Provider component
export const ChatProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [chats, setChats] = useState<Chat[]>(generateMockChats());
  const [activeChat, setActiveChat] = useState<Chat | null>(null);
  const [showSidebar, setShowSidebar] = useState(true);
  const [isMobileView, setIsMobileView] = useState(
    typeof window !== "undefined" && window.innerWidth < 768
  );

  // Handle window resize for responsiveness
  useEffect(() => {
    const handleResize = () => {
      setIsMobileView(window.innerWidth < 768);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Set first chat as active by default
  useEffect(() => {
    if (chats.length > 0 && !activeChat) {
      setActiveChat(chats[0]);
    }
  }, [chats, activeChat]);

  // Handle setting active chat
  const handleSetActiveChat = (chat: Chat | null) => {
    setActiveChat(chat);
    if (isMobileView && chat) {
      setShowSidebar(false);
    }
  };

  // Send message
  const sendMessage = (content: string) => {
    if (!activeChat) return;

    const newMessage: Message = {
      id: uuidv4(),
      content,
      sender: "admin",
      timestamp: new Date(),
    };

    const updatedChat: Chat = {
      ...activeChat,
      messages: [...activeChat.messages, newMessage],
      lastMessage: newMessage,
    };

    setChats((prevChats) =>
      prevChats.map((chat) => (chat.id === activeChat.id ? updatedChat : chat))
    );
    setActiveChat(updatedChat);

    // Simulate a delayed user response
    setTimeout(() => {
      const responseMessage: Message = {
        id: uuidv4(),
        content: "Thanks for your response! I appreciate your help.",
        sender: "user",
        timestamp: new Date(),
      };

      const updatedChatWithResponse: Chat = {
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

  // Copy message ID to clipboard
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

// Re-export types for convenience (optional)
export type { Message, Chat } from "@/services/type";
