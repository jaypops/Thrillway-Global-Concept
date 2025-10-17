import ChatInterface from "@/features/Message/Chatinterface";

function Messages() {
  return (
    <div className="w-full pt-20 md:pl-6 md:pr-4 h-[650px]">
      <div className="p-2 bg-white rounded-3xl shadow-md h-full">
        <ChatInterface />
      </div>
    </div>
  );
}

export default Messages;
