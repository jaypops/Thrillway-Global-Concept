import { useNavigate } from 'react-router-dom';
import { logout } from '@/services/apiAccount';
import toast from 'react-hot-toast';
import { useAuth } from '@/context/AuthContext';

export function useLogout() {
  const navigate = useNavigate();
  const { setIsAuthenticated } = useAuth();

  return () => {
    logout();
    setIsAuthenticated(false);
    toast.success('Logged out successfully');
    navigate('/login', { replace: true });
  };
}