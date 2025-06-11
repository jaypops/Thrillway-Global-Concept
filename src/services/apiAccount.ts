import { uploadFile } from "./apiProperty";
import axios from "axios";
import { Account } from "./type";

const API_BASE_URL = "http://localhost:3000/api";

export const fetchStaffDetails = async (): Promise<Account[]> => {
  try {
    const res = await axios.get(`${API_BASE_URL}/account`);
    console.log("API Response:", res.data); 
    return res.data;
  } catch (error) {
    console.error("Fetch staff details failed:", error);
    throw error;
  }
};

export const createAccount = async (formData: FormData): Promise<Account> => {
  try {
    const image = formData.get("image") as File | null;
    let imageUrl: string | undefined;
    
    if (image) {
      imageUrl = await uploadFile(image);
    }

    const accountData: Account = {
      name: formData.get("name") as string,
      username: formData.get("username") as string,
      telephone: formData.get("telephone") as string,
      emergencyContact: formData.get("emergencyContact") as string,
      email: formData.get("email") as string,
      address: formData.get("address") as string,
      images: imageUrl,
      startDate: formData.get("startDate") as string, 
    };

    const response = await axios.post<Account>(
      `${API_BASE_URL}/account`, 
      accountData,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error("Account creation failed:", error);
    throw error; 
  }
};

export const deleteAccount = async ({
  id,
}: {
  id: string;
}): Promise<Account> => {
  const res = await axios.delete(`${API_BASE_URL}/account/${id}`);
  return res.data;
};