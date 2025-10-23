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
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

export default function Header() {
  const { accounts, isPending, error } = useCurrentUser();

  if (isPending) {
    return (
      <div className="fixed top-0 right-0 z-20 w-full bg-sky-50 backdrop-blur-sm">
        <div className="flex items-center justify-between md:px-6 px-3 py-5">
          <Skeleton className="h-6 w-20" /> 
          <div className="flex items-center space-x-4">
            <Skeleton className="h-10 w-10 rounded-full" /> 
            <Skeleton className="h-5 w-24" />
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="fixed top-0 right-0 z-20 w-full bg-sky-50 backdrop-blur-sm">
        <div className="md:px-6 px-3 py-4">
          <Alert variant="destructive" className="flex items-center space-x-2">
            <AlertCircle className="h-5 w-5 text-red-500" />
            <AlertDescription>
              Failed to load user data. Please try again.
            </AlertDescription>
          </Alert>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed top-0 right-0 z-20 w-full bg-sky-50 backdrop-blur-sm">
      <div className="flex flex-row items-center justify-between md:px-6 px-3 py-5">
        <h1 className="font-semibold">Logo</h1>

        <div className="flex items-center space-x-4">
          <Avatar>
            <AvatarImage src={accounts?.images?.[0]} />
            <AvatarFallback>
              {accounts?.username?.[0]?.toUpperCase() || "U"}
            </AvatarFallback>
          </Avatar>

          <div className="flex items-center space-x-2">
            <p className="text-sm font-medium">{accounts?.username}</p>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <ChevronDown className="w-4 h-4 cursor-pointer" />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>
                  <Logout />
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </div>
  );
}
