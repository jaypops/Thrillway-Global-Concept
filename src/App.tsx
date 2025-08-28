import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
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

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000,
    },
  },
});

interface AdminRoute {
  children: ReactNode;
}

interface FieldAgentRoute {
  children: ReactNode;
}

const AdminRoute = ({ children }: { children: ReactNode }) => {
  const { user } = useAuth();
  return user?.role === "admin" ? (
    children
  ) : (
    <Navigate to="/dashboard" replace />
  );
};

const FieldAgentRoute = ({ children }: { children: ReactNode }) => {
  const { user } = useAuth();
  return user?.role !== "fieldAgent" ? (
    children
  ) : (
    <Navigate to="/dashboard" replace />
  );
};

function App() {
  const inviteModal = useInviteModal();
  return (
    <QueryClientProvider client={queryClient}>
      <ReactQueryDevtools initialIsOpen={false} />
      <InviteLinkProvider
        isOpen={inviteModal.isOpen}
        onOpenChange={inviteModal.onOpenChange}
      >
        <DashboardProvider>
          <AuthProvider>
            <BrowserRouter>
              <Routes>
                <Route
                  element={
                    <ProtectedRoutes>
                      <AppLayout />
                    </ProtectedRoutes>
                  }
                >
                  <Route index element={<Navigate replace to="login" />} />
                  <Route path="dashboard" element={<Dashboard />} />
                  <Route path="addproperties" element={<AddProperties />} />
                  <Route path="properties" element={<Properties />} />
                  <Route
                    path="accountmanagment"
                    element={
                      <AdminRoute>
                        <AccountManagment />
                      </AdminRoute>
                    }
                  />
                  <Route
                    path="messages"
                    element={
                      <FieldAgentRoute>
                        <Messages />
                      </FieldAgentRoute>
                    }
                  />
                </Route>
                <Route path="login" element={<Login />} />
                 <Route 
                  path="account-management" 
                  element={<InvitationRegistration />} 
                />
              </Routes>
            </BrowserRouter>
          </AuthProvider>
        </DashboardProvider>
      </InviteLinkProvider>
    </QueryClientProvider>
  );
}

export default App;
