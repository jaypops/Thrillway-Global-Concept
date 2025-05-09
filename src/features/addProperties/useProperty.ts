import { fetchProperties } from "@/services/apiProperty";
import { Property } from "@/services/type";
import { useQuery } from "@tanstack/react-query";

export const normalizeProperty = (property: Property) => ({
  ...property,
  id: property._id || property.id,
});

export function useProperty() {
  const {
    data = [],
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["properties"],
    queryFn: async () => {
      const properties = await fetchProperties();
      return properties.map(normalizeProperty);
    },
  });
  return { isLoading, isError, data, error };
}
