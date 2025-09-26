// context/AuthContext.tsx
import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { verifyToken, getStoredToken, setAuthToken, logout as apiLogout } from "../services/apiAccount";
import { User } from "@/services/type";

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean | null;
  isLoading: boolean;
  login: (userData: User, token: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isAuthenticated: null,
  isLoading: true,
  login: () => {},
  logout: () => {},
});

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        setIsLoading(true);
        
        // Check if we have a stored token first
        const storedToken = await getStoredToken();
        if (!storedToken) {
          setUser(null);
          setIsAuthenticated(false);
          setIsLoading(false);
          return;
        }
        
        // Set the token and verify
        setAuthToken(storedToken);
        const isValid = await verifyToken();
        
        if (isValid && storedToken) {
          try {
            // Decode the token to get user info
            const decoded = JSON.parse(atob(storedToken.split(".")[1]));
            setUser({ id: decoded._id, role: decoded.role });
            setIsAuthenticated(true);
          } catch (error) {
            console.error("Error decoding token:", error);
            setUser(null);
            setIsAuthenticated(false);
            await apiLogout();
          }
        } else {
          setUser(null);
          setIsAuthenticated(false);
          await apiLogout();
        }
      } catch (error) {
        console.error("Error verifying token:", error);
        setUser(null);
        setIsAuthenticated(false);
        await apiLogout();
      } finally {
        setIsLoading(false);
      }
    };
    
    checkAuth();
  }, []);

  const login = (userData: User, token: string) => {
    setUser(userData);
    setIsAuthenticated(true);
    setAuthToken(token);
  };

  const logout = async () => {
    setUser(null);
    setIsAuthenticated(false);
    setAuthToken(null);
    // Call the API logout to remove token from backend
    try {
      await apiLogout();
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

  return (
    <AuthContext.Provider
      value={{ user, isAuthenticated, isLoading, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);