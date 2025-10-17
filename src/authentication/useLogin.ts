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
      const { account } = data; 

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

      login(userData); 

      toast.success("Account logged in successfully");
      navigate("/dashboard", { replace: true });
    },
    onError: (error: unknown) => {
      let errorMessage = "Login failed. Please try again.";
      if (error instanceof Error) {
        if (error.message.includes("Invalid username or password")) {
          errorMessage = "Invalid username or password.";
        } else if (
          error.message.includes("Network Error") ||
          error.message.includes("timeout")
        ) {
          errorMessage = "Network error. Please check your connection.";
        } else {
          errorMessage = error.message;
        }
      }
      console.log("Displaying toast with message:", errorMessage);
      toast.error(errorMessage);
      console.log("Login error:", error);
    },
  });
}