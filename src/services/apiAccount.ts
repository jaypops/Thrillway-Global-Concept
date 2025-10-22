import { uploadFile } from "./apiProperty";
import axios from "axios";
import { Account, LoginResponse } from "./type";

const API_BASE_URL = import.meta.env.VITE_BACKEND_URL;

type LoginData = Pick<Account, "username" | "password">;

const handleAxiosError = (error: unknown, defaultMessage: string) => {
  if (axios.isAxiosError(error)) {
    const status = error.response?.status;
    const errorMessage = error.response?.data?.message || defaultMessage;

    if (status === 429) {
      return new Error(
        errorMessage || "Too many requests, please try again later"
      );
    }

    return new Error(errorMessage);
  }
  console.error(`${defaultMessage}:`, error);
  return new Error("An unexpected error occurred");
};

export const fetchStaffDetails = async (): Promise<Account[]> => {
  try {
    const res = await axios.get(`${API_BASE_URL}/account/all`, {
      withCredentials: true,
    });
    
    const data = res.data;
    if (data?.success && data.user) {
      return [data.user]; 
    }
    
    if (data?.success && Array.isArray(data.accounts)) {
      return data.accounts;
    }
    return [];
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.status === 403) {
      console.log("🔒 User is not admin, cannot fetch all accounts");
    }
    throw error;
  }
};

export async function createAccount(formData: FormData): Promise<Account> {
  try {
    const image = formData.get("image") as File | null;
    let imageUrl: string | undefined;
    if (image && image.size > 0) {
      imageUrl = await uploadFile(image);
    }

    const accountData: Account = {
      name: formData.get("name") as string,
      username: formData.get("username") as string,
      telephone: formData.get("telephone") as string,
      emergencyContact: formData.get("emergencyContact") as string,
      email: formData.get("email") as string,
      address: formData.get("address") as string,
      password: formData.get("password") as string,
      images: imageUrl ? [imageUrl] : [],
      role:
        (formData.get("role") as "admin" | "fieldAgent" | "customerAgent") ||
        "fieldAgent",
      startDate: formData.get("startDate") as string,
      invitationToken: formData.get("invitationToken") as string,
    };

    if (!accountData.invitationToken) {
      throw new Error("Invitation token is required");
    }

    const response = await axios.post<Account>(
      `${API_BASE_URL}/account/register`,
      accountData,
      {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      }
    );

    return response.data;
  } catch (error) {
    throw handleAxiosError(error, "Failed to create account");
  }
}

export const deleteAccount = async ({
  id,
}: {
  id: string;
}): Promise<Account> => {
  try {
    const res = await axios.delete(`${API_BASE_URL}/account/${id}`, {
      withCredentials: true,
    });
    return res.data;
  } catch (error) {
    throw handleAxiosError(error, "Failed to delete account");
  }
};

export const loginAccount = async (
  formData: FormData
): Promise<{ account: Account }> => {
  try {
    const loginData: LoginData = {
      username: formData.get("username") as string,
      password: formData.get("password") as string,
    };

    const response = await axios.post<LoginResponse>(
      `${API_BASE_URL}/account/login`,
      loginData,
      {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      }
    );

    return { account: response.data.account };
  } catch (error) {
    throw handleAxiosError(error, "Invalid username or password");
  }
};

export const generateInviteLink = async ({
  role,
}: {
  role: "admin" | "fieldAgent" | "customerAgent";
}): Promise<string> => {
  try {
    const response = await axios.post<{ invitationLink: string }>(
      `${API_BASE_URL}/account/invite`,
      { role },
      {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      }
    );
    return response.data.invitationLink;
  } catch (error) {
    throw handleAxiosError(error, "Failed to generate invite link");
  }
};

export const validateInvitationToken = async (token: string) => {
  try {
    const response = await axios.get(
      `${API_BASE_URL}/account/invite/validate`,
      {
        params: { token },
        headers: { "Content-Type": "application/json" },
      }
    );
    console.log("Validate invitation response:", response.data);
    return response.data;
  } catch (error) {
    throw handleAxiosError(error, "Invalid invitation token");
  }
};

export const verifyToken = async (): Promise<boolean> => {
  try {
    await axios.get(`${API_BASE_URL}/auth/account/verify`, {
      withCredentials: true,
    });
    return true;
  } catch (error) {
    console.error("Token verification failed:", error);
    return false;
  }
};

export const logout = async (): Promise<void> => {
  try {
    await axios.post(`${API_BASE_URL}/account/logout`, null, {
      withCredentials: true,
    });
  } catch (error) {
    console.error("Logout error:", error);
    throw handleAxiosError(error, "Failed to logout");
  }
};

export const getCurrentUser = async (): Promise<Account> => {
  try {
    const response = await axios.get<{ user: Account }>(
      `${API_BASE_URL}/account/current`,
      {
        withCredentials: true,
      }
    );
    return response.data.user;
  } catch (error) {
    throw handleAxiosError(error, "Failed to fetch current user");
  }
};

export const refreshToken = async (): Promise<void> => {
  try {
    await axios.post(`${API_BASE_URL}/account/refresh-token`, null, {
      headers: { "Content-Type": "application/json" },
      withCredentials: true,
    });
  } catch (error) {
    throw handleAxiosError(error, "Failed to refresh token");
  }
};
