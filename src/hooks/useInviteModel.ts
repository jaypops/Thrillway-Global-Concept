import { useState } from "react";

export const useInviteModal = () => {
  const [isOpen, setIsOpen] = useState(false);

  const onOpenChange = (open: boolean) => {
    setIsOpen(open);
  };

  return { isOpen, onOpenChange, setIsOpen };
};
