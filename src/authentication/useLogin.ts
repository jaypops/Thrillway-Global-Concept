import { loginAccount } from "@/services/apiAccount";
import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { User } from "@/services/type";

export function useLoginAccount() {
  const navigate = useNavigate();
  const { login } = useAuth();

  return useMutation({
    mutationFn: loginAccount,
    onSuccess: (data) => {
      const { account, token } = data;
      
      if (
        !account._id ||
        !["admin", "fieldAgent", "customerAgent"].includes(account.role)
      ) {
        throw new Error("Invalid user data received from API");
      }
      
      const userData: User = {
        id: account._id,
        role: account.role as "admin" | "fieldAgent" | "customerAgent",
      };
      
      login(userData, token);
      
      toast.success("Account logged in successfully");
      navigate("/dashboard", { replace: true });
    },
    onError: (error: unknown) => {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to login";
      toast.error(errorMessage);
      console.error("login error:", error);
    },
  });
}