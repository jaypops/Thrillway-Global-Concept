import { fetchStaffDetails } from "@/services/apiAccount";
import { Account } from "@/services/type";
import { useQuery } from "@tanstack/react-query";

export function useAccount() {
  const {
    data = [],
    isPending,
    error,
  } = useQuery<Account[]>({
    queryKey: ["accounts"],
    queryFn: fetchStaffDetails,
  });

  return { isPending, data, error };
}