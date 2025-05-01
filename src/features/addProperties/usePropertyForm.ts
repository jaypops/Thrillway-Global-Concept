import { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useMutation } from "@tanstack/react-query";
import { createProperty } from "./addpropertyApi";
import { propertySchema } from "./propertySchema";
import toast from "react-hot-toast";
import { updateProperty } from "@/services/apiProperty";
import { Property } from "@/services/type";

type PropertyFormValues = z.infer<typeof propertySchema>;

interface UsePropertyFormOptions {
  isEditMode?: boolean;
  id?: string;
  initialValues?: Partial<PropertyFormValues> | Property;
  onSuccess?: () => void;
}

export const usePropertyForm = ({
  isEditMode = false,
  id = "",
  initialValues = {},
  onSuccess,
}: UsePropertyFormOptions = {}) => {
  const [images, setImages] = useState<File[]>([]);
  const [documents, setDocuments] = useState<File[]>([]);
  const [imagePreviewUrls, setImagePreviewUrls] = useState<string[]>([]);

  const form = useForm<PropertyFormValues>({
    resolver: zodResolver(propertySchema),
    defaultValues: {
      title: "",
      description: "",
      price: "",
      priceType: "",
      address: "",
      rooms: "",
      bathrooms: "",
      propertyType: "",
      status: "",
      propertySize: "",
      isAvailable: true,
      features: {
        swimmingPool: false,
        garage: false,
        balcony: false,
        security: false,
        garden: false,
        airConditioning: false,
        furnished: false,
        parking: false,
      },
      images: undefined,
      documents: undefined,
      ...initialValues,
    },
  });

  useEffect(() => {
    if (isEditMode && initialValues) {
      form.reset({
        ...initialValues,
        // Convert numbers to strings for form inputs if needed
        price: initialValues.price?.toString() || "",
        propertySize: initialValues.propertySize?.toString() || "",
      });

      // Handle image previews if they exist
      if (initialValues.images) {
        setImagePreviewUrls(initialValues.images);
      }
    }
  }, [isEditMode, initialValues, form]);

  const mutation = useMutation({
    mutationFn: async (data: PropertyFormValues) => {
      const formData = new FormData();

      Object.entries(data).forEach(([key, value]) => {
        if (key === "features") {
          formData.append(key, JSON.stringify(value));
        } else if (key !== "images" && key !== "documents") {
          formData.append(key, value as string);
        }
      });

      images.forEach((file) => formData.append("images", file));
      documents.forEach((file) => formData.append("documents", file));

      return isEditMode && id 
      ? updateProperty(id, formData)
      : createProperty(formData);
    },
    onSuccess: () => {
      toast.success(
        isEditMode
          ? "Property updated successfully!"
          : "Property added successfully!"
      );
      if (!isEditMode) {
        form.reset();
        setImages([]);
        setDocuments([]);
        setImagePreviewUrls([]);
      }
      onSuccess?.();
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const handleImageUpload = (files: File[]) => {
    setImages((prev) => [...prev, ...files]);
    setImagePreviewUrls((prev) => [...prev, ...files.map(URL.createObjectURL)]);
    form.setValue("images", files);
  };

  const handleDocumentUpload = (files: File[]) => {
    setDocuments((prev) => [...prev, ...files]);
    form.setValue("documents", files);
  };

  const removeImage = (index: number) => {
    URL.revokeObjectURL(imagePreviewUrls[index]);
    setImages((prev) => prev.filter((_, i) => i !== index));
    setImagePreviewUrls((prev) => prev.filter((_, i) => i !== index));
  };

  const removeDocument = (index: number) => {
    setDocuments((prev) => prev.filter((_, i) => i !== index));
  };

  const onSubmit = (data: PropertyFormValues) => {
    if (images.length === 0 && !isEditMode) {
      form.setError("images", { message: "At least one image is required" });
      return;
    }
    mutation.mutate(data);
  };

  return {
    form,
    images,
    documents,
    imagePreviewUrls,
    handleImageUpload,
    handleDocumentUpload,
    removeImage,
    removeDocument,
    onSubmit,
    isLoading: mutation.isPending,
    onSuccess,
    isEditMode,
  };
};
