import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import axios from "axios";
import toast from "react-hot-toast";
import {
  verifyToken,
  logout as apiLogout,
  getCurrentUser,
  refreshToken,
} from "../services/apiAccount";
import { User } from "@/services/type";
import { Spinner } from "@/components/ui/spinner";

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean | null;
  isLoading: boolean;
  login: (userData: User) => void;
  logout: () => void;
  setIsAuthenticated: (value: boolean) => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isAuthenticated: null,
  isLoading: true,
  login: () => {},
  logout: () => {},
  setIsAuthenticated: () => {},
});

interface AuthProviderProps {
  children: ReactNode;
}

const extractUserData = (account: any): User => ({
  id: account._id!,
  role: account.role as "admin" | "fieldAgent" | "customerAgent",
  name: account.name,
  username: account.username,
  telephone: account.telephone,
  emergencyContact: account.emergencyContact,
  email: account.email,
  address: account.address,
  startDate: account.startDate,
  images: account.images,
});

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const handleRefresh = async () => {
    await refreshToken();
    const account = await getCurrentUser();
    const userData = extractUserData(account);
    setUser(userData);
    setIsAuthenticated(true);
  };

  useEffect(() => {
    const checkAuth = async () => {
      try {
        setIsLoading(true);

        const isValid = await verifyToken();
        if (isValid) {
          const account = await getCurrentUser();
          const userData = extractUserData(account);
          setUser(userData);
          setIsAuthenticated(true);
        } else {
          setUser(null);
          setIsAuthenticated(false);
        }
      } catch (error) {
        if (axios.isAxiosError(error) && error.response?.status === 401) {
          try {
            await handleRefresh();
          } catch (refreshError) {
            toast.error("Token refresh failed. Please log in again.");
            console.error(refreshError);
            setUser(null);
            setIsAuthenticated(false);
          }
        } else if (
          axios.isAxiosError(error) &&
          error.response?.status === 429
        ) {
          console.error("Rate limit exceeded:", error.response?.data?.message);
          toast.error("API down, come back in an hour.");
          setUser(null);
          setIsAuthenticated(false);
        } else if (!window.navigator.onLine) {
          toast.error("You're offline. Please check your internet connection.");
          setUser(null);
          setIsAuthenticated(false);
        } else if (axios.isAxiosError(error) && error.code === "ERR_NETWORK") {
          toast.error("API unreachable. Please try again later.");
          setUser(null);
          setIsAuthenticated(false);
        } else {
          console.error("Error verifying token:", error);
          toast.error("An unexpected error occurred during authentication.");
          setUser(null);
          setIsAuthenticated(false);
        }
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = (userData: User) => {
    setUser(userData);
    setIsAuthenticated(true);
  };

  const logout = async () => {
    setUser(null);
    setIsAuthenticated(false);
    try {
      await apiLogout();
      toast.success("You’ve been logged out successfully.");
    } catch (error) {
      console.error("Error during logout:", error);
      toast.error("Error logging out. Please try again.");
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen text-lg space-x-4">
        <Spinner /> <h1>Checking authentication...</h1>
      </div>
    );
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        isLoading,
        login,
        logout,
        setIsAuthenticated,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
