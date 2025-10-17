import React from 'react';
import Sidebar from './ChatSidebar';
import ChatWindow from './ChatWindow';
import { useChat } from '@/context/ChatContext';

const ChatInterface: React.FC = () => {
  const { activeChat, isMobileView, showSidebar } = useChat();

  return (
    <div className="flex h-full">
      <div
        className={`${
          isMobileView ? (showSidebar ? 'block w-full' : 'hidden') : 'block w-75'
        } h-full `}
      >
        <Sidebar />
      </div>
      <div
        className={`flex-1 ${
          isMobileView ? (showSidebar ? 'hidden' : 'block') : 'block'
        } h-full`}
      >
        {activeChat ? (
          <ChatWindow />
        ) : (
          <div className="flex-1 flex items-center justify-center bg-white h-full">
            <div className="text-center text-gray-500">
              <p className="text-xl font-medium">
                Select a chat to start messaging
              </p>
              <p className="mt-2">
                You can manage customer inquiries from this dashboard
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatInterface;