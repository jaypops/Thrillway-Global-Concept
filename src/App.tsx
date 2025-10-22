import { BrowserRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { Toaster } from "react-hot-toast"; // Import Toaster
import { AuthProvider } from "@/context/AuthContext";
import { DashboardProvider } from "./context/DashboardContext";
import { InviteLinkProvider } from "./context/InviteLinkContext";
import { useInviteModal } from "./hooks/useInviteModel";
import { ChatProvider } from "./context/ChatContext";
import AnimatedRoutes from "./ui/Routes";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000,
    },
  },
});

function App() {
  const inviteModal = useInviteModal();

  return (
    <QueryClientProvider client={queryClient}>
      <ReactQueryDevtools initialIsOpen={false} />
      
      {/* Add Toaster here - it will be available everywhere */}
      <Toaster 
        position="top-center"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#363636',
            color: '#fff',
            fontSize: '14px',
          },
          success: {
            duration: 3000,
            iconTheme: {
              primary: '#4ade80',
              secondary: '#fff',
            },
          },
          error: {
            duration: 5000,
            iconTheme: {
              primary: '#f87171',
              secondary: '#fff',
            },
          },
        }}
      />
      
      <ChatProvider>
        <InviteLinkProvider
          isOpen={inviteModal.isOpen}
          onOpenChange={inviteModal.onOpenChange}
        >
          <DashboardProvider>
            <AuthProvider>
              <BrowserRouter>
                <AnimatedRoutes />
              </BrowserRouter>
            </AuthProvider>
          </DashboardProvider>
        </InviteLinkProvider>
      </ChatProvider>
    </QueryClientProvider>
  );
}

export default App;