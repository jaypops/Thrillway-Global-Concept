import AddProperties from "@/pages/AddProperties";
import Dashboard from "@/pages/Dashboard";
import InvitationRegistration from "@/pages/InvitationRegistration";
import Login from "@/pages/Login";
import { AnimatePresence } from "framer-motion";
import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import AppLayout from "./AppLayout";
import DeleteProperty from "@/features/properties/DeleteProperty";
import AccountManagement from "@/pages/AccountManagment";
import ViewProperty from "@/features/properties/ViewProperty";
import EditProperty from "@/features/properties/EditProperty";
import Properties from "@/pages/Properties";
import PageTransition from "./PageTransition";
import { useAuth } from "@/context/AuthContext";
import ProtectedRoutes from "./ProtectedRoutes";
import { ReactNode } from "react";
import Messages from "@/pages/Messages";
import CreateAccountForm from "@/features/accountManagement/CreateAccountForm";

interface FieldAgentRouteProps {
  children: ReactNode;
}
interface AdminRouteProps {
  children: ReactNode;
}

export default function AnimatedRoutes() {
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
          <Route index element={<Navigate replace to="/dashboard" />} />
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
          >
            <Route
              path="view/:id"
              element={
                <PageTransition>
                  <ViewProperty />
                </PageTransition>
              }
            />
            <Route
              path="edit/:id"
              element={
                <PageTransition>
                  <EditProperty />
                </PageTransition>
              }
            />
            <Route
              path="delete/:id"
              element={
                <PageTransition>
                  <DeleteProperty isRoute={true} />
                </PageTransition>
              }
            />
          </Route>

          <Route
            path="accountmanagment"
            element={
              <PageTransition>
                <AdminRoute>
                  <AccountManagement />
                </AdminRoute>
              </PageTransition>
            }
          >
            <Route
              path="add-staff"
              element={
                <PageTransition>
                  <AdminRoute>
                    <CreateAccountForm />
                  </AdminRoute>
                </PageTransition>
              }
            />
          </Route>

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
