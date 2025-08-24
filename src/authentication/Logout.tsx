import { Button } from "@/components/ui/button";
import { CiLogout } from "react-icons/ci";

export function Logout() {
  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/login";
  };

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
