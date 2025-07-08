import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { verifyToken } from "../services/apiAccount";
import { User } from "@/services/type";

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean | null;
  setIsAuthenticated: (value: boolean) => void;
  login: (userData: User) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isAuthenticated: null,
  setIsAuthenticated: () => {},
  login: () => {},
  logout: () => {},
});

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const isValid = await verifyToken();
        if (isValid) {
          const token = localStorage.getItem("token");
          if (token) {
            const decoded = JSON.parse(atob(token.split(".")[1]));
            setUser({ id: decoded._id, role: decoded.role });
            setIsAuthenticated(true);
          } else {
            setUser(null);
            setIsAuthenticated(false);
            localStorage.removeItem("token");
          }
        } else {
          setUser(null);
          setIsAuthenticated(false);
          localStorage.removeItem("token");
        }
      } catch (error) {
        console.error("Error verifying token:", error);
        setUser(null);
        setIsAuthenticated(false);
        localStorage.removeItem("token");
      }
    };
    checkAuth();
  }, []);

  const login = (userData: User) => {
    setUser(userData);
    setIsAuthenticated(true);
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem("token");
  };

  return (
    <AuthContext.Provider
      value={{ user, isAuthenticated, login, logout, setIsAuthenticated }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
