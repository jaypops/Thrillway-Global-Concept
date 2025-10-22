import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ChevronDown } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Logout } from "@/authentication/Logout";
import { useCurrentUser } from "@/features/useCurrentUser";
import { Spinner } from "@/components/ui/spinner";

export default function Header() {
  const { accounts, isPending, error } = useCurrentUser();

  if (isPending)
    return (
      <div className="p-4">
        <Spinner />
      </div>
    );
  if (error)
    return <div className="p-4 text-red-500">Error: {error.message}</div>;

  return (
    <div className="fixed top-0 right- z-20 w-full bg-sky-50 backdrop-blur-sm">
      <div className=" flex flex-row items-center justify-between md:px-6 px-3 py-5">
        <h1>Logo</h1>
        <span className="flex items-center space-x-4">
          <Avatar>
            <AvatarImage src={accounts?.images?.[0]} />
            <AvatarFallback>T</AvatarFallback>
          </Avatar>
          <span className="flex items-center flex-row space-x-2">
            <p className="text-sm font-medium">{accounts?.username}</p>
            <DropdownMenu>
              <DropdownMenuTrigger>
                {" "}
                <ChevronDown className="w-4 h-4 cursor-pointer" />
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem>
                  <Logout />
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </span>
        </span>
      </div>
    </div>
  );
}
