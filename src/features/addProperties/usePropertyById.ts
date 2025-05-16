import { useQuery } from "@tanstack/react-query";
import { Property } from "@/services/type";
import { getSingleProperty } from "@/services/apiProperty";

interface PropertyId {
  propertyId: string;
}
export function usePropertyById({ propertyId }: PropertyId) {
  const { data, isPending, error } = useQuery<Property>({
    queryKey: ["properties", propertyId],
    queryFn: () => getSingleProperty(propertyId),
    enabled: !!propertyId,
  });
  return { data, isPending, error };
}
