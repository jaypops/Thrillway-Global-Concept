import { loginAccount } from "@/services/apiAccount";
import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { User } from "@/services/type";
import axios from "axios";

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
        name: account.name,
        username: account.username,
        email: account.email,
        telephone: account.telephone,
        emergencyContact: account.emergencyContact,
        address: account.address,
        startDate: account.startDate,
        images: account.images,
      };

      login(userData);

      toast.success("Account logged in successfully");
      navigate("/dashboard", { replace: true });
    },
    onError: (error: unknown) => {
      let errorMessage = "Login failed. Please try again.";

      if (axios.isAxiosError(error)) {
        const responseData = error.response?.data;
        const message = responseData?.message || error.message;
        
        const lowerMessage = String(message).toLowerCase();
        
        if (lowerMessage.includes("invalid username or password")) {
          errorMessage = "Invalid username or password.";
        } else if (lowerMessage.includes("username and password are required")) {
          errorMessage = "Username and password are required.";
        } else if (lowerMessage.includes("too many login attempts")) {
          errorMessage = message; 
        } else if (
          lowerMessage.includes("network error") ||
          lowerMessage.includes("timeout")
        ) {
          errorMessage = "Network error. Please check your connection.";
        } else if (error.response?.status === 401) {
          errorMessage = "Invalid username or password.";
        } else if (error.response?.status === 500) {
          errorMessage = "Server error. Please try again later.";
        } else {
          errorMessage = message || "Login failed. Please try again.";
        }
      }

      toast.error(errorMessage);
    },
  });
}