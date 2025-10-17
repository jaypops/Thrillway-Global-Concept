import React, { useState } from 'react'
import { Message, useChat } from '@/context/ChatContext'
import { format } from 'date-fns'
import { CopyIcon, CheckIcon } from 'lucide-react'
interface ChatMessageProps {
  message: Message
}
const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  const { copyMessageId } = useChat()
  const [copied, setCopied] = useState(false)
  const isAdmin = message.sender === 'admin'
  const handleCopy = () => {
    copyMessageId(message.id)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }
  return (
    <div className={`mb-4 flex ${isAdmin ? 'justify-end' : 'justify-start'}`}>
      <div
        className={`max-w-[70%] rounded-lg p-3 relative ${isAdmin ? 'bg-blue-600 text-white' : 'bg-white text-gray-800'}`}
      >
        {!isAdmin && (
          <div className="flex items-center mb-1 text-xs md:text-sm text-gray-500 space-x-1 truncate">
            <span className="font-medium py-0.5 px-1.5 rounded bg-gray-100">
              ID: {message.id}
            </span>
            <button
              onClick={handleCopy}
              className="p-0.5 hover:bg-gray-200 rounded transition-colors"
              title="Copy ID"
            >
              {copied ? (
                <CheckIcon className="h-3.5 w-3.5 text-green-500" />
              ) : (
                <CopyIcon className="h-3.5 w-3.5" />
              )}
            </button>
          </div>
        )}
        <p className="whitespace-pre-wrap text-xs md:text-sm">{message.content}</p>
        <div
          className={`text-xs mt-1 ${isAdmin ? 'text-blue-200' : 'text-gray-500'} text-right`}
        >
          {format(message.timestamp, 'HH:mm')}
        </div>
      </div>
    </div>
  )
}
export default ChatMessage
