import axios from "axios";
import { Property } from "./type";
const API_BASE_URL = "http://localhost:3000/api";

export const fetchProperties = async (): Promise<Property[]> => {
  const res = await axios.get(`${API_BASE_URL}/propertys`);
  return res.data;
};

export const uploadFile = async (file: File): Promise<string> => {
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

    const featuresJson = formData.get("features") as string;
    const features = featuresJson ? JSON.parse(featuresJson) : {};

    const propertyData = {
      title: formData.get("title") as string,
      description: formData.get("description") as string,
      price: Number(formData.get("price")),
      rooms: formData.get("rooms") as string,
      bathrooms: formData.get("bathrooms") as string,
      priceType: formData.get("priceType") as string,
      status: formData.get("status") as string,
      address: formData.get("address") as string,
      propertyType: formData.get("propertyType") as string,
      propertySize: formData.get("propertySize") as string,
      isAvailable: formData.get("isAvailable") === "true",
      features,
      images: fileUrls.slice(0, images.length),
      documents: fileUrls.slice(images.length),
    };

    const response = await axios.post(
      `${API_BASE_URL}/propertys`,
      propertyData,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error("Property creation failed:", error);
    throw error;
  }
};

export const editProperty = async ({
  id,
  formData,
}: {
  id: string;
  formData: FormData;
}): Promise<Property> => {
  try {
    const images: File[] = Array.from(
      formData.getAll("images") as File[]
    ).filter((file) => file.size > 0);
    const documents: File[] = Array.from(
      formData.getAll("documents") as File[]
    ).filter((file) => file.size > 0);

    let imageUrls: string[] = [];
    let documentUrls: string[] = [];

    if (images.length > 0 || documents.length > 0) {
      const allFiles = [...images, ...documents];
      const fileUrls = await Promise.all(allFiles.map(uploadFile));
      imageUrls = fileUrls.slice(0, images.length);
      documentUrls = fileUrls.slice(images.length);
    }

    const existingProperty = await getSingleProperty(id);

    const featuresJson = formData.get("features") as string;
    const features = featuresJson ? JSON.parse(featuresJson) : {};

    const removedImagesJson = formData.get("removedImages") as string;
    const removedDocumentsJson = formData.get("removedDocuments") as string;
    const removedImages = removedImagesJson
      ? JSON.parse(removedImagesJson)
      : [];
    const removedDocuments = removedDocumentsJson
      ? JSON.parse(removedDocumentsJson)
      : [];


    const propertyData = {
      title: formData.get("title") as string,
      description: formData.get("description") as string,
      price: Number(formData.get("price")),
      rooms: formData.get("rooms") as string,
      bathrooms: formData.get("bathrooms") as string,
      priceType: formData.get("priceType") as string,
      status: formData.get("status") as string,
      address: formData.get("address") as string,
      propertyType: formData.get("propertyType") as string,
      propertySize: formData.get("propertySize") as string,
      isAvailable: formData.get("isAvailable") === "true",
      features,
      images: [
        ...(existingProperty.images || []).filter(
          (url) => !removedImages.includes(url)
        ),
        ...imageUrls,
      ],
      documents: [
        ...(existingProperty.documents || []).filter(
          (url) => !removedDocuments.includes(url)
        ),
        ...documentUrls,
      ],
      removedImages,
      removedDocuments, 
    };
    const response = await axios.patch(
      `${API_BASE_URL}/propertys/${id}`,
      propertyData,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error("Property update failed:", error);
    throw error;
  }
};

export const getSingleProperty = async (id: string): Promise<Property> => {
  const res = await axios.get(`${API_BASE_URL}/propertys/${id}`);
  return res.data;
};

export const deleteProperty = async ({
  id,
}: {
  id: string;
}): Promise<Property> => {
  const res = await axios.delete(`${API_BASE_URL}/propertys/${id}`);
  return res.data;
};

export const deleteAllProperty = async (
  propertyIds: string[]
): Promise<Property[]> => {
  const res = await axios.delete(`${API_BASE_URL}/propertys`, {
    data: { ids: propertyIds },
  });
  return res.data;
};
