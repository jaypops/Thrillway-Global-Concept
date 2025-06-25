import { loginAccount } from '@/services/apiAccount';
import { useMutation } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';

export function useLoginAccount() {
  const navigate = useNavigate();
  const { setIsAuthenticated } = useAuth();

  return useMutation({
    mutationFn: loginAccount,
    onSuccess: () => {
      setIsAuthenticated(true);
      toast.success('Account logged in successfully');
      navigate('/dashboard', { replace: true });
    },
    onError: (error: unknown) => {
      const errorMessage = error instanceof Error ? error.message : 'Failed to login';
      toast.error(errorMessage);
      console.error('login error:', error);
    },
  });
}