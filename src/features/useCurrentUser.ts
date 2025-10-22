import { getCurrentUser } from "@/services/apiAccount";
import { Account } from "@/services/type";
import { useQuery } from "@tanstack/react-query";

export function useCurrentUser() {
  const {
    data: accounts,
    isPending,
    error,
  } = useQuery<Account>({
    queryKey: ["currentUser"],
    queryFn: getCurrentUser,
  });
  return { isPending, accounts, error };
}
