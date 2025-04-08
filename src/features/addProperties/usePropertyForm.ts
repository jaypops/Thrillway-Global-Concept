import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useMutation } from "@tanstack/react-query";
import { createProperty } from "./propertyApi";
import { propertySchema } from "./propertySchema";

type PropertyFormValues = z.infer<typeof propertySchema>;

export const usePropertyForm = () => {
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
      location: "",
      rooms: "",
      bathrooms: "",
      propertyType: "",
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
    },
  });
  // useEffect(() => {
  //   console.log("Registered fields:", Object.keys(form.control._fields));
  // }, [form]);

  const propertyType = form.watch("propertyType");
  const isNonResidential = [
    "land",
    "warehouse",
    "industrial",
    "petrol-station",
    "parking",
    "farm"
  ].includes(propertyType || "");
  const isOfficeOrShop = ["office", "shop", "restaurant"].includes(propertyType || "");

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

      return createProperty(formData);
    },
    onSuccess: () => {
      alert("Property added successfully!");
      form.reset();
      setImages([]);
      setDocuments([]);
      setImagePreviewUrls([]);
    },
    onError: (error) => {
      console.error("Error submitting property:", error);
      alert("Failed to add property. Please try again.");
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
    console.log("Form values:", {
      ...data,
      images,
      documents,
    });

    if (images.length === 0) {
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
    isNonResidential,
    isOfficeOrShop,
    handleImageUpload,
    handleDocumentUpload,
    removeImage,
    removeDocument,
    onSubmit,
    isLoading: mutation.isPending,
  };
};
