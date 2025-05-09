
// import { useEffect, useState } from "react";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { useForm } from "react-hook-form";
// import { z } from "zod";
// import { useCreateProperty, useEditProperty } from "./usePropertyMutation";
// import toast from "react-hot-toast";
// import { Property } from "@/services/type";
// import { propertySchema } from "./propertySchema";

// type PropertyFormValues = z.infer<typeof propertySchema>;

// interface UsePropertyFormOptions {
//   isEditMode?: boolean;
//   id?: string;
//   initialValues?: Partial<Property>;
//   onSuccess?: () => void;
// }

// export const usePropertyForm = ({
//   isEditMode = false,
//   id = "",
//   initialValues = {},
//   onSuccess,
// }: UsePropertyFormOptions = {}) => {
//   const [images, setImages] = useState<File[]>([]);
//   const [documents, setDocuments] = useState<File[]>([]);
//   const [imagePreviewUrls, setImagePreviewUrls] = useState<string[]>([]);

//   // Initialize mutations
//   const { mutate: createProperty, isPending: isCreating } = useCreateProperty();
//   const { mutate: editProperty, isPending: isEditing } = useEditProperty();

//   const form = useForm<PropertyFormValues>({
//     resolver: zodResolver(propertySchema),
//     defaultValues: {
//       title: "",
//       description: "",
//       price: "",
//       priceType: "",
//       address: "",
//       rooms: "",
//       bathrooms: "",
//       propertyType: "",
//       status: "",
//       propertySize: "",
//       isAvailable: true,
//       features: {},
//       images: undefined,
//       documents: undefined,
//       ...initialValues,
//     },
//   });

// useEffect(() => {
//   if (isEditMode && initialValues) {
//     const featuresObj = Array.isArray(initialValues.features)
//       ? FEATURES.reduce((acc, feature) => {
//           acc[feature.name] = initialValues.features.includes(feature.name);
//           return acc;
//         }, {} as Record<string, boolean>)
//       : initialValues.features || {};5, ajasa


//     form.reset({
//       ...initialValues,
//       price: initialValues.price?.toString() || "",
//       propertySize: initialValues.propertySize?.toString() || "",
//       rooms: initialValues.rooms?.toString() || "",
//       bathrooms: initialValues.bathrooms?.toString() || "",
//       features: featuresObj,
//       images: undefined, 
//       documents: undefined 
//     });

//     if (initialValues.images) {
//       setImagePreviewUrls(initialValues.images);
//     }
//   }
// }, [isEditMode, initialValues, form]);


//   const handleImageUpload = (files: File[]) => {
//     setImages((prev) => [...prev, ...files]);
//     setImagePreviewUrls((prev) => [...prev, ...files.map(URL.createObjectURL)]);
//   };

//   const handleDocumentUpload = (files: File[]) => {
//     setDocuments((prev) => [...prev, ...files]);
//   };

//   const removeImage = (index: number) => {
//     URL.revokeObjectURL(imagePreviewUrls[index]);
//     setImages((prev) => prev.filter((_, i) => i !== index));
//     setImagePreviewUrls((prev) => prev.filter((_, i) => i !== index));
//   };

//   const removeDocument = (index: number) => {
//     setDocuments((prev) => prev.filter((_, i) => i !== index));
//   };

// const onSubmit = async (data: PropertyFormValues) => {
//   if (images.length === 0 && !isEditMode) {
//     form.setError("images", { message: "At least one image is required" });
//     return;
//   }

//   const formData = new FormData();
  
//   const selectedFeatures = Object.entries(data.features)
//     .filter(([_, isSelected]) => isSelected)
//     .map(([feature]) => feature);

//   Object.entries(data).forEach(([key, value]) => {
//     if (key === "features") {
//       formData.append(key, JSON.stringify(selectedFeatures));
//     } else if (key !== "images" && key !== "documents") {
//       formData.append(key, value as string);
//     }
//   });

//   images.forEach(file => formData.append("images", file));
//   documents.forEach(file => formData.append("documents", file));

//   if (isEditMode) {
//     editProperty(
//       { id, formData },
//       {
//         onSuccess: () => {
//           toast.success("Property updated successfully!");
//           onSuccess?.();
//         },
//         onError: (error) => {
//           toast.error(error.message);
//         }
//       }
//     );
//   } else {
//     createProperty(
//       formData,
//       {
//         onSuccess: () => {
//           toast.success("Property added successfully!");
//           form.reset();
//           setImages([]);
//           setDocuments([]);
//           setImagePreviewUrls([]);
//           onSuccess?.();
//         },
//         onError: (error) => {
//           toast.error(error.message);
//         }
//       }
//     );
//   }
// };

//   return {
//     form,
//     images,
//     documents,
//     imagePreviewUrls,
//     handleImageUpload,
//     handleDocumentUpload,
//     removeImage,
//     removeDocument,
//     onSubmit,
//     isLoading: isEditMode ? isEditing : isCreating,
//     isEditMode,
//   };
// };