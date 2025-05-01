import { useQueryClient } from "@tanstack/react-query";

const API_BASE_URL = "http://localhost:3000/api";

const uploadFile = async (file: File): Promise<string> => {
  try {
    const res = await fetch(`${API_BASE_URL}/s3Url`);
    const { url } = await res.json();

    await fetch(url, {
      method: "PUT",
      body: file,
      headers: {
        "Content-Type": file.type,
      },
    });

    return url.split("?")[0];
  } catch (error) {
    console.error("S3 upload failed:", error);
    throw new Error("File upload failed. Please try again.");
  }
};

export const createProperty = async (formData: FormData) => {
  try {
    const images: File[] = Array.from(formData.getAll("images") as File[]);
    const documents: File[] = Array.from(
      formData.getAll("documents") as File[]
    );

    const allFiles = [...images, ...documents];
    const fileUrls = await Promise.all(allFiles.map(uploadFile));

    const imageUrls = fileUrls.slice(0, images.length);
    const documentUrls = fileUrls.slice(images.length);
    
    const rawFeatures = JSON.parse(
      (formData.get("features") as string) || "{}"
    );
    const selectedFeatures = Object.entries(rawFeatures)
      .filter(([_, value]) => value)
      .map(([key]) => key);

    const propertyData = {
      title: formData.get("title") as string,
      description: formData.get("description") as string,
      price: Number(formData.get("price")),
      rooms: Number(formData.get("rooms")),
      priceType: formData.get("priceType") as string,
      status: formData.get("status") as string,
      address: formData.get("address") as string,
      bathrooms: Number(formData.get("bathrooms")),
      propertyType: formData.get("propertyType") as string,
      propertySize: formData.get("propertySize") as string,
      isAvailable: formData.get("isAvailable") === "true",
      features: selectedFeatures,
      images: imageUrls,
      documents: documentUrls,
    };

    const response = await fetch(`${API_BASE_URL}/propertys`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(propertyData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to create property");
    }

    return await response.json();
  } catch (error) {
    console.error("Property creation failed:", error);
    throw error;
  }
};

export const usePropertyActions = () => {
  const queryClient = useQueryClient();

  const invalidateProperties = () => {
    queryClient.invalidateQueries({
      queryKey: ["addproperties"],
      refetchType: "active",
    });
  };

  return { invalidateProperties };
};
