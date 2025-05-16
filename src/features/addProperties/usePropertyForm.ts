import { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useCreateProperty, useEditProperty } from "./usePropertyMutation";
import toast from "react-hot-toast";
import { Property } from "@/services/type";
import { propertySchema } from "./propertySchema";
import { FEATURES } from "./PropertyFeatures";

type PropertyFormValues = z.infer<typeof propertySchema>;

interface UsePropertyFormOptions {
  isEditMode?: boolean;
  id?: string;
  initialValues?: Partial<Property>;
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
  const [documentPreviewUrls, setDocumentPreviewUrls] = useState<
    { name: string; url: string }[]
  >([]);
  const [removedImages, setRemovedImages] = useState<string[]>([]);
  const [removedDocuments, setRemovedDocuments] = useState<string[]>([]);

  const { mutate: createProperty, isPending: isCreating } = useCreateProperty();
  const { mutate: editProperty, isPending: isEditing } = useEditProperty();

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
      features: {},
      images: undefined,
      documents: undefined,
      ...initialValues,
    },
  });

  useEffect(() => {
    if (isEditMode && initialValues) {
      const featuresObj: Record<string, boolean> = {};
      FEATURES.forEach((feature) => {
        featuresObj[feature.name] = false;
      });

      if (initialValues.features && typeof initialValues.features === "object") {
        Object.entries(initialValues.features).forEach(([key, value]) => {
          if (FEATURES.some((f) => f.name === key)) {
            featuresObj[key] = !!value;
          }
        });
      }
      const existingDocuments = initialValues.documents?.map((url) => ({
        name: url.split("/").pop() || "Document",
        url,
      })) || [];

      form.reset({
        ...initialValues,
        price: initialValues.price?.toString() || "",
        propertySize: initialValues.propertySize?.toString() || "",
        rooms: initialValues.rooms != null ? String(initialValues.rooms) : "",
        bathrooms: initialValues.bathrooms != null ? String(initialValues.bathrooms) : "",
        features: featuresObj,
        images: initialValues.images || undefined,
      });

      if (initialValues.images) {
        console.log("Setting imagePreviewUrls:", initialValues.images);
        setImagePreviewUrls(initialValues.images);
      }
      if (initialValues.documents) {
        console.log("Setting documentPreviewUrls:", existingDocuments);
        setDocumentPreviewUrls(existingDocuments);
      }
    }
  }, [isEditMode, initialValues, form]);

  const cleanUrl = (url: string) => {
    return url.split("?")[0].replace(/\/$/, "");
  };

  const handleImageUpload = (files: File[]) => {
    setImages((prev) => [...prev, ...files]);
    setImagePreviewUrls((prev) => [...prev, ...files.map(URL.createObjectURL)]);
  };

  const handleDocumentUpload = (files: File[]) => {
    setDocuments((prev) => [...prev, ...files]);
    setDocumentPreviewUrls((prev) => [
      ...prev,
      ...files.map((file) => ({
        name: file.name,
        url: URL.createObjectURL(file),
      })),
    ]);
  };

  const removeImage = (index: number) => {
    const removedUrl = imagePreviewUrls[index];
    const cleanedUrl = cleanUrl(removedUrl);
    URL.revokeObjectURL(removedUrl);
    setImages((prev) => prev.filter((_, i) => i !== index));
    setImagePreviewUrls((prev) => prev.filter((_, i) => i !== index));

    if (isEditMode && initialValues.images?.map(cleanUrl).includes(cleanedUrl)) {
      setRemovedImages((prev) => {
        const newRemovedImages = [...prev, cleanedUrl];
        return newRemovedImages;
      });
    }
  };

  const removeDocument = (index: number) => {
    const removedDoc = documentPreviewUrls[index];
    const cleanedUrl = cleanUrl(removedDoc.url);
    if (documents[index]) {
      URL.revokeObjectURL(removedDoc.url);
    }
    setDocuments((prev) => prev.filter((_, i) => i !== index));
    setDocumentPreviewUrls((prev) => prev.filter((_, i) => i !== index));

    if (isEditMode && initialValues.documents?.map(cleanUrl).includes(cleanedUrl)) {
      setRemovedDocuments((prev) => {
        const newRemovedDocuments = [...prev, cleanedUrl];
        return newRemovedDocuments;
      });
    }
  };

  const onSubmit = async (data: PropertyFormValues) => {
    if (images.length === 0 && !isEditMode) {
      form.setError("images", { message: "At least one image is required" });
      return;
    }

    const formData = new FormData();

    Object.entries(data).forEach(([key, value]) => {
      if (key !== "images" && key !== "documents" && key !== "features") {
        formData.append(key, String(value));
      }
    });

    formData.append("features", JSON.stringify(data.features));

    images.forEach((file) => formData.append("images", file));
    documents.forEach((file) => formData.append("documents", file));

    if (isEditMode) {
      if (removedImages.length > 0) {
        formData.append("removedImages", JSON.stringify(removedImages));
      }
      if (removedDocuments.length > 0) {
        formData.append("removedDocuments", JSON.stringify(removedDocuments));
      }
    }

    if (isEditMode) {
      editProperty(
        { id, formData },
        {
          onSuccess: () => {
            form.reset();
            setImages([]);
            setDocuments([]);
            setImagePreviewUrls([]);
            setDocumentPreviewUrls([]);
            setRemovedImages([]);
            setRemovedDocuments([]);
            onSuccess?.();
          },
          onError: (error) => {
            toast.error(error.message);
          },
        }
      );
    } else {
      createProperty(formData, {
        onSuccess: () => {
          form.reset();
          setImages([]);
          setDocuments([]);
          setImagePreviewUrls([]);
          setDocumentPreviewUrls([]);
          onSuccess?.();
        },
        onError: (error) => {
          toast.error(error.message);
        },
      });
    }
  };

  return {
    form,
    images,
    documents,
    imagePreviewUrls,
    documentPreviewUrls,
    handleImageUpload,
    handleDocumentUpload,
    removeImage,
    removeDocument,
    onSubmit,
    isLoading: isEditMode ? isEditing : isCreating,
    isEditMode,
  };
};