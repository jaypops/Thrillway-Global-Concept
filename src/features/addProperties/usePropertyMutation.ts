import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { createProperty, deleteAllProperty, deleteProperty, editProperty } from "@/services/apiProperty";

export function useCreateProperty() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createProperty,
    onSuccess: () => {
      toast.success("Property created successfully");
      queryClient.invalidateQueries({ queryKey: ["properties"] });
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to create property");
      console.error("Creation error:", error);
    }
  });
}

export function useEditProperty() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, formData }: { id: string; formData: FormData }) => 
      editProperty({ id, formData }),
    onSuccess: () => {
      toast.success("Property updated successfully");
      queryClient.invalidateQueries({ queryKey: ["properties"] });
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to edit property");
      console.error("Edit error:", error);
    }
  });
}

export function useDeleteProperty() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id }: { id: string }) => 
      deleteProperty({ id }),
    onSuccess: () => {
      toast.success("Property deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["properties"] });
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to delete property");
      console.error("Delete error:", error);
    }
  });
}

export function useDeleteAllProperty() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (propertyIds: string[]) => deleteAllProperty(propertyIds),
    onSuccess: () => {
      toast.success("Selected properties deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["properties"] });
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to delete selected properties");
      console.error("Deletion error:", error);
    },
  });
}

