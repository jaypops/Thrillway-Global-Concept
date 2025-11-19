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
  isLoading: false,
  login: () => {},
  logout: () => {},
  setIsAuthenticated: () => {},
});

interface AuthProviderProps {
  children: ReactNode;
}

const CACHE_KEY = "cached_user";
const AUTH_STATE_KEY = "auth_state";

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

// Helper functions for cache management
const getCachedUser = (): User | null => {
  try {
    const cached = localStorage.getItem(CACHE_KEY);
    return cached ? JSON.parse(cached) : null;
  } catch (error) {
    console.error("Error reading cached user:", error);
    return null;
  }
};

const setCachedUser = (user: User | null) => {
  try {
    if (user) {
      localStorage.setItem(CACHE_KEY, JSON.stringify(user));
      localStorage.setItem(AUTH_STATE_KEY, "true");
    } else {
      localStorage.removeItem(CACHE_KEY);
      localStorage.removeItem(AUTH_STATE_KEY);
    }
  } catch (error) {
    console.error("Error caching user:", error);
  }
};

const hasAuthToken = (): boolean => {
  // Check if there's a token in cookies or localStorage
  // Adjust this based on where your token is stored
  return document.cookie.includes("token") || 
         document.cookie.includes("accessToken") ||
         localStorage.getItem("token") !== null;
};

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);

  const handleRefresh = async () => {
    await refreshToken();
    const account = await getCurrentUser();
    const userData = extractUserData(account);
    setUser(userData);
    setIsAuthenticated(true);
    setCachedUser(userData);
  };

  useEffect(() => {
    const checkAuth = async () => {
      // Load cached data immediately for instant UI
      const cachedUser = getCachedUser();
      const hasToken = hasAuthToken();

      if (cachedUser && hasToken) {
        // Use cached data immediately - no loading screen
        setUser(cachedUser);
        setIsAuthenticated(true);
        setIsVerifying(true); // Verify in background
      } else {
        // No cached data, show loading screen
        setIsLoading(true);
      }

      try {
        // Verify token in background
        const isValid = await verifyToken();
        
        if (isValid) {
          const account = await getCurrentUser();
          const userData = extractUserData(account);
          setUser(userData);
          setIsAuthenticated(true);
          setCachedUser(userData);
        } else {
          // Token invalid, clear everything
          setUser(null);
          setIsAuthenticated(false);
          setCachedUser(null);
        }
      } catch (error) {
        if (axios.isAxiosError(error) && error.response?.status === 401) {
          try {
            // Try to refresh token
            await handleRefresh();
          } catch (refreshError) {
            toast.error("Session expired. Please log in again.");
            console.error(refreshError);
            setUser(null);
            setIsAuthenticated(false);
            setCachedUser(null);
          }
        } else if (
          axios.isAxiosError(error) &&
          error.response?.status === 429
        ) {
          console.error("Rate limit exceeded:", error.response?.data?.message);
          toast.error("API down, come back in an hour.");
          // Keep cached user if rate limited
          if (!cachedUser) {
            setUser(null);
            setIsAuthenticated(false);
          }
        } else if (!window.navigator.onLine) {
          toast.error("You're offline. Please check your internet connection.");
          // Keep cached user when offline
          if (!cachedUser) {
            setUser(null);
            setIsAuthenticated(false);
          }
        } else if (axios.isAxiosError(error) && error.code === "ERR_NETWORK") {
          toast.error("API unreachable. Please try again later.");
          // Keep cached user if network error
          if (!cachedUser) {
            setUser(null);
            setIsAuthenticated(false);
          }
        } else {
          console.error("Error verifying token:", error);
          toast.error("An unexpected error occurred during authentication.");
          setUser(null);
          setIsAuthenticated(false);
          setCachedUser(null);
        }
      } finally {
        setIsLoading(false);
        setIsVerifying(false);
      }
    };

    checkAuth();
  }, []);

  const login = (userData: User) => {
    setUser(userData);
    setIsAuthenticated(true);
    setCachedUser(userData);
  };

  const logout = async () => {
    setUser(null);
    setIsAuthenticated(false);
    setCachedUser(null);
    
    try {
      await apiLogout();
      toast.success("You've been logged out successfully.");
    } catch (error) {
      console.error("Error during logout:", error);
      toast.error("Error logging out. Please try again.");
    }
  };

  // Only show loading screen if there's no cached data
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
        isLoading: isVerifying,
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