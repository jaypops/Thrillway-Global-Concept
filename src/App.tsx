import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { AuthProvider } from '@/context/AuthContext';
import AppLayout from './ui/AppLayout';
import Dashboard from './pages/Dashboard';
import Properties from './pages/Properties';
import Messages from './pages/Messages';
import Settings from './pages/Settings';
import AddProperties from './pages/AddProperties';
import AccountManagment from './pages/AccountManagment';
import Login from './pages/Login';
import ProtectedRoutes from './ui/ProtectedRoutes';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ReactQueryDevtools initialIsOpen={false} />
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
              <Route index element={<Navigate replace to="dashboard" />} />
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="addproperties" element={<AddProperties />} />
              <Route path="properties" element={<Properties />} />
              <Route path="accountmanagment" element={<AccountManagment />} />
              <Route path="messages" element={<Messages />} />
              <Route path="settings" element={<Settings />} />
            </Route>
            <Route path="login" element={<Login />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;