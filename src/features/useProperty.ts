import { fetchProperties } from "@/services/apiProperty";
import { Property } from "@/services/type";
import { useQuery } from "@tanstack/react-query";

export const normalizeProperty = (property: Property) => ({
  ...property,
  id: property._id || property.id
});

export function useProperty() {
  const {
    data = [],
    isPending,
    error,
  } = useQuery({
    queryKey: ["properties"],
    queryFn: fetchProperties
  });
  return { isPending, data, error };
}
