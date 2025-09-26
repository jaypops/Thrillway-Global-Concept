import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { AuthProvider, useAuth } from "@/context/AuthContext";
import AppLayout from "./ui/AppLayout";
import Dashboard from "./pages/Dashboard";
import Properties from "./pages/Properties";
import Messages from "./pages/Messages";
import AddProperties from "./pages/AddProperties";
import AccountManagment from "./pages/AccountManagment";
import { DashboardProvider } from "./context/DashboardContext";
import Login from "./pages/Login";
import ProtectedRoutes from "./ui/ProtectedRoutes";
import { ReactNode } from "react";
import { InviteLinkProvider } from "./context/InviteLinkContext";
import { useInviteModal } from "./hooks/useInviteModel";
import InvitationRegistration from "./pages/InvitationRegistration";
import { AnimatePresence } from "framer-motion";
import PageTransition from "./ui/PageTransition";
import { ChatProvider } from "./context/ChatContext";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000,
    },
  },
});

interface AdminRouteProps {
  children: ReactNode;
}

interface FieldAgentRouteProps {
  children: ReactNode;
}

const AdminRoute = ({ children }: AdminRouteProps) => {
  const { user } = useAuth();
  return user?.role === "admin" ? (
    <>{children}</>
  ) : (
    <Navigate to="/dashboard" replace />
  );
};

const FieldAgentRoute = ({ children }: FieldAgentRouteProps) => {
  const { user } = useAuth();
  return user?.role !== "fieldAgent" ? (
    <>{children}</>
  ) : (
    <Navigate to="/dashboard" replace />
  );
};

// Create a wrapper component to use useLocation properly
function AnimatedRoutes() {
  const location = useLocation();
  
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/login" element={<Login />} />
        <Route
          path="/account-management"
          element={<InvitationRegistration />}
        />
        <Route
          path="/"
          element={
            <ProtectedRoutes>
              <AppLayout />
            </ProtectedRoutes>
          }
        >
          <Route
            index
            element={
              <PageTransition>
                <Navigate replace to="/dashboard" />
              </PageTransition>
            }
          />
          <Route
            path="dashboard"
            element={
              <PageTransition>
                <Dashboard />
              </PageTransition>
            }
          />
          <Route
            path="addproperties"
            element={
              <PageTransition>
                <AddProperties />
              </PageTransition>
            }
          />
          <Route
            path="properties"
            element={
              <PageTransition>
                <Properties />
              </PageTransition>
            }
          />
          <Route
            path="accountmanagment"
            element={
              <PageTransition>
                <AdminRoute>
                  <AccountManagment />
                </AdminRoute>
              </PageTransition>
            }
          />
          <Route
            path="messages"
            element={
              <PageTransition>
                <FieldAgentRoute>
                  <Messages />
                </FieldAgentRoute>
              </PageTransition>
            }
          />
        </Route>
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </AnimatePresence>
  );
}

function App() {
  const inviteModal = useInviteModal();
  
  return (
    <QueryClientProvider client={queryClient}>
      <ReactQueryDevtools initialIsOpen={false} />
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