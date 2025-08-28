import { createAccount, deleteAccount, generateInviteLink } from "@/services/apiAccount";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

export function useCreateAccount() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  return useMutation({
    mutationFn: createAccount,
    onSuccess: () => {
      toast.success("Account created successfully");
      queryClient.invalidateQueries({ queryKey: ["accounts"] });
      navigate("/login", { replace: true });
    },
    onError: (error: unknown) => {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to create account";

      toast.error(errorMessage);
      console.error("Account creation error:", error);
    },
  });
}

export function useDeleteAccount() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id }: { id: string }) => deleteAccount({ id }),
    onSuccess: () => {
      toast.success("Account deleted successfully");

      queryClient.invalidateQueries({ queryKey: ["accounts"] });
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to delete account");
      console.error("Delete error:", error);
    },
  });
}

export function useGenerateInviteLink() {
  const queryClient = useQueryClient();
  return useMutation<string, Error, { role: "admin" | "fieldAgent" | "customerAgent" }>({
    mutationFn: ({ role }) => generateInviteLink({ role }),
    onSuccess: () => {
      toast.success("Invitation link generated successfully");
      queryClient.invalidateQueries({ queryKey: ["accounts"] });
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to generate invitation link");
      console.error("Invite link generation error:", error);
    },
  });
}
