import { BrowserRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { Toaster } from "react-hot-toast";
import { AuthProvider } from "@/context/AuthContext";
import { DashboardProvider } from "./context/DashboardContext";
import { InviteLinkProvider } from "./context/InviteLinkContext";
import { useInviteModal } from "./hooks/useInviteModel";
import { ChatProvider } from "./context/ChatContext";
import AnimatedRoutes from "./ui/Routes";
import OnlineStatusBannerWrapper from "./ui/OnlineStatusBannerWrapper";

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

      <Toaster
        position="top-center"
        toastOptions={{
          duration: 4000,
          style: {
            background: "#363636",
            color: "#fff",
            fontSize: "14px",
          },
          success: {
            duration: 3000,
            iconTheme: {
              primary: "#4ade80",
              secondary: "#fff",
            },
          },
          error: {
            duration: 5000,
            iconTheme: {
              primary: "#f87171",
              secondary: "#fff",
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
              <OnlineStatusBannerWrapper>
                <BrowserRouter>
                  <AnimatedRoutes />
                </BrowserRouter>
              </OnlineStatusBannerWrapper>
            </AuthProvider>
          </DashboardProvider>
        </InviteLinkProvider>
      </ChatProvider>
    </QueryClientProvider>
  );
}

export default App;
