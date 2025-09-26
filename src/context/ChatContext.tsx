import React, { useEffect, useState, createContext, useContext } from 'react'
import { v4 as uuidv4 } from 'uuid'
// Types
export type Message = {
  id: string
  content: string
  sender: 'user' | 'admin'
  timestamp: Date
}
export type Chat = {
  id: string
  user: {
    id: string
    name: string
    avatar: string
    online: boolean
    lastSeen?: Date
  }
  messages: Message[]
  unreadCount: number
  lastMessage?: Message
}
type ChatContextType = {
  chats: Chat[]
  activeChat: Chat | null
  setActiveChat: (chat: Chat | null) => void
  sendMessage: (content: string) => void
  copyMessageId: (id: string) => void
  isMobileView: boolean
  showSidebar: boolean
  setShowSidebar: (show: boolean) => void
}
const ChatContext = createContext<ChatContextType | undefined>(undefined)
export const useChat = () => {
  const context = useContext(ChatContext)
  if (!context) {
    throw new Error('useChat must be used within a ChatProvider')
  }
  return context
}
// Mock data
const generateMockChats = (): Chat[] => {
  const mockChats: Chat[] = [
    {
      id: '1',
      user: {
        id: 'user1',
        name: 'John Doe',
        avatar: 'https://randomuser.me/api/portraits/men/1.jpg',
        online: true,
      },
      messages: [
        {
          id: 'msg1-1',
          content: 'Hi there! I need help with my order #12345',
          sender: 'user',
          timestamp: new Date(Date.now() - 3600000),
        },
        {
          id: 'msg1-2',
          content: 'I can help you with that. What seems to be the issue?',
          sender: 'admin',
          timestamp: new Date(Date.now() - 3500000),
        },
        {
          id: 'msg1-3',
          content:
            "I haven't received my package yet and the tracking hasn't updated in 3 days",
          sender: 'user',
          timestamp: new Date(Date.now() - 3400000),
        },
      ],
      unreadCount: 1,
    },
    {
      id: '2',
      user: {
        id: 'user2',
        name: 'Sarah Miller',
        avatar: 'https://randomuser.me/api/portraits/women/2.jpg',
        online: false,
        lastSeen: new Date(Date.now() - 1800000),
      },
      messages: [
        {
          id: 'msg2-1',
          content: "Hello, I'd like to request a refund for order #54321",
          sender: 'user',
          timestamp: new Date(Date.now() - 86400000),
        },
        {
          id: 'msg2-2',
          content:
            "I'll check that for you. Can you tell me why you want a refund?",
          sender: 'admin',
          timestamp: new Date(Date.now() - 86300000),
        },
        {
          id: 'msg2-3',
          content: "The product arrived damaged and doesn't work properly",
          sender: 'user',
          timestamp: new Date(Date.now() - 86200000),
        },
      ],
      unreadCount: 0,
    },
    {
      id: '3',
      user: {
        id: 'user3',
        name: 'Alex Johnson',
        avatar: 'https://randomuser.me/api/portraits/men/3.jpg',
        online: true,
      },
      messages: [
        {
          id: 'msg3-1',
          content: 'Is the blue widget in stock?',
          sender: 'user',
          timestamp: new Date(Date.now() - 172800000),
        },
        {
          id: 'msg3-2',
          content:
            'Yes, we have 5 left in stock. Would you like to place an order?',
          sender: 'admin',
          timestamp: new Date(Date.now() - 172700000),
        },
        {
          id: 'msg3-3',
          content: "Great! I'll take 2, please.",
          sender: 'user',
          timestamp: new Date(Date.now() - 172600000),
        },
      ],
      unreadCount: 2,
    },
  ]
  // Set last message for each chat
  mockChats.forEach((chat) => {
    chat.lastMessage = chat.messages[chat.messages.length - 1]
  })
  return mockChats
}
export const ChatProvider: React.FC<{
  children: React.ReactNode
}> = ({ children }) => {
  const [chats, setChats] = useState<Chat[]>(generateMockChats())
  const [activeChat, setActiveChat] = useState<Chat | null>(null)
  const [showSidebar, setShowSidebar] = useState(true)
  // Check if we're on mobile view
  const [isMobileView, setIsMobileView] = useState(window.innerWidth < 768)
  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      setIsMobileView(window.innerWidth < 768)
    }
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])
  useEffect(() => {
    // Set the first chat as active by default
    if (chats.length > 0 && !activeChat) {
      setActiveChat(chats[0])
    }
  }, [chats, activeChat])
  // When a chat is selected on mobile, hide sidebar
  const handleSetActiveChat = (chat: Chat | null) => {
    setActiveChat(chat)
    if (isMobileView && chat) {
      setShowSidebar(false)
    }
  }
  const sendMessage = (content: string) => {
    if (!activeChat) return
    const newMessage: Message = {
      id: uuidv4(),
      content,
      sender: 'admin',
      timestamp: new Date(),
    }
    const updatedChat = {
      ...activeChat,
      messages: [...activeChat.messages, newMessage],
      lastMessage: newMessage,
    }
    setChats((prevChats) =>
      prevChats.map((chat) => (chat.id === activeChat.id ? updatedChat : chat)),
    )
    setActiveChat(updatedChat)
    // Simulate a response after a delay
    setTimeout(() => {
      const responseMessage: Message = {
        id: uuidv4(),
        content: 'Thanks for your response! I appreciate your help.',
        sender: 'user',
        timestamp: new Date(),
      }
      const updatedChatWithResponse = {
        ...updatedChat,
        messages: [...updatedChat.messages, responseMessage],
        lastMessage: responseMessage,
        unreadCount: updatedChat.unreadCount + 1,
      }
      setChats((prevChats) =>
        prevChats.map((chat) =>
          chat.id === activeChat.id ? updatedChatWithResponse : chat,
        ),
      )
      setActiveChat(updatedChatWithResponse)
    }, 2000)
  }
  const copyMessageId = (id: string) => {
    navigator.clipboard.writeText(id)
  }
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
  )
}
