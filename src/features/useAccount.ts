import { fetchStaffDetails } from "@/services/apiAccount";
import { Account } from "@/services/type";
import { useQuery } from "@tanstack/react-query";

export function useAccount() {
  const {
    data: accounts,
    isPending,
    error,
  } = useQuery<Account[]>({
    queryKey: ["accounts"],
    queryFn: fetchStaffDetails,
  });
  return { isPending, accounts, error };
}
