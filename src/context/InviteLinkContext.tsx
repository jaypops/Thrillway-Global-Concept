import { useGenerateInviteLink } from "@/features/useAccountMutation";
import { createContext, ReactNode, useContext, useState } from "react";

interface InviteLinkContextType {
  role: "admin" | "fieldAgent" | "customerAgent";
  setRole: (role: "admin" | "fieldAgent" | "customerAgent") => void;
  isGenerating: boolean;
  inviteLink: string;
  copied: boolean;
  error: string | null;
  handleGenerate: () => Promise<void>;
  handleClose: () => void;
  isOpen: boolean;
  setCopied: (copied: boolean) => void;
}

const InviteLinkContext = createContext<InviteLinkContextType | undefined>(
  undefined
);

interface InviteStaffModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  children: ReactNode;
  initialRole?: "admin" | "fieldAgent" | "customerAgent" | null;
}

export const InviteLinkProvider = ({
  children,
  onOpenChange,
  isOpen,
  initialRole = "fieldAgent",
}: InviteStaffModalProps) => {
  const [role, setRole] = useState<"admin" | "fieldAgent" | "customerAgent">(
    initialRole || "fieldAgent"
  );
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [inviteLink, setInviteLink] = useState<string>("");
  const [copied, setCopied] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const { mutateAsync: generateInviteLink } = useGenerateInviteLink();

  const handleClose = () => {
    setInviteLink("");
    setCopied(false);
    setRole("fieldAgent");
    setError(null);
    onOpenChange(false);
  };

  const handleGenerate = async () => {
    setIsGenerating(true);
    setError(null);
    try {
      const link = await generateInviteLink({ role });
      setInviteLink(link);
      await navigator.clipboard.writeText(link);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      const error = err as Error;
      setError(error.message || "Failed to generate invite link");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <InviteLinkContext.Provider
      value={{
        role,
        setRole,
        isGenerating,
        inviteLink,
        copied,
        error,
        handleGenerate,
        handleClose,
        isOpen,
        setCopied,
      }}
    >
      {children}
    </InviteLinkContext.Provider>
  );
};

export const useInviteLink = () => {
  const context = useContext(InviteLinkContext);
  if (!context) {
    throw new Error("useInviteLink must be used within an InviteLinkProvider");
  }
  return context;
};
