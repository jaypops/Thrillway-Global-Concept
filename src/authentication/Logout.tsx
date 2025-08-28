import { Button } from "@/components/ui/button";
import { CiLogout } from "react-icons/ci";
import { useLogout } from "./useLogout";

export function Logout() {
  const handleLogout = useLogout();

  return (
    <Button
      onClick={handleLogout}
      className="w-full justify-start cursor-pointer"
      variant="ghost"
    >
      <CiLogout /> Logout
    </Button>
  );
}
