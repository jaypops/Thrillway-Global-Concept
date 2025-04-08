import { useQueryClient } from "@tanstack/react-query";
import { db, storage } from "@/services/firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";

const upLoading = async (file: File, path: string) => {
  try {
    const storageRef = ref(storage, `${path}/${file.name}`);
    await uploadBytes(storageRef, file);
    return await getDownloadURL(storageRef);
  } catch (error) {
    console.error(`Error uploading ${file.name}:`, error);
    throw new Error("File upload failed. Please try again.");
  }
};

export const createProperty = async (formData: FormData) => {
  try {
    const images: File[] = formData.getAll("images") as File[];
    const documents: File[] = formData.getAll("documents") as File[];

    console.log("Firebase Submission Data:", {
      title: formData.get("title"),
      images: images, 
      documents: documents
    });

    console.log("Firebase Config:", {
      projectId: db.app.options.projectId,
      storageBucket: storage.app.options.storageBucket
    });

    const imageUrls = await Promise.all(
      images.map((file) => upLoading(file, "property_images"))
    );

    const documentUrls =
      documents.length > 0
        ? await Promise.all(
            documents.map((file) => upLoading(file, "property_documents"))
          )
        : []; 

    const propertyData = {
      title: formData.get("title"),
      description: formData.get("description"),
      price: Number(formData.get("price")),
      rooms: Number(formData.get("rooms")),
      priceType: formData.get("priceType"),
      location: formData.get("location"),
      // rooms: formData.get("rooms"),
      bathrooms: formData.get("bathrooms"),
      propertyType: formData.get("propertyType"),
      propertySize: formData.get("propertySize"),
      isAvailable: formData.get("isAvailable") === "true",
      features: JSON.parse(formData.get("features") as string),
      images: imageUrls,
      documents: documentUrls,
      createdAt: serverTimestamp(),
    };

    const docRef = await addDoc(collection(db, "properties"), propertyData);
    return docRef.id;
  } catch (error) {
    console.error("Property creation failed:", error);
    throw new Error("Property could not be created. Try again.");
  }
};

export const usePropertyActions = () => {
  const queryClient = useQueryClient();

  const invalidateProperties = () => {
    queryClient.invalidateQueries({ queryKey: ["properties"] });
  };

  return { invalidateProperties };
};
