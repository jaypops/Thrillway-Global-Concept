import { uploadFile } from "./apiProperty";
import axios from "axios";
import { Account, LoginResponse } from "./type";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
// const FRONTEND_URL = import.meta.env.VITE_FRONTEND_URL;

type LoginData = Pick<Account, "username" | "password">;

export const fetchStaffDetails = async (): Promise<Account[]> => {
  try {
    console.log("🔄 Fetching staff details...");
    const res = await axios.get(`${API_BASE_URL}/account`, {
      withCredentials: true,
    });

    const data = res.data;
    return Array.isArray(data) ? data : data.accounts || [];
  } catch (error) {
    console.error("❌ Fetch staff details failed:", error);
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
    if (axios.isAxiosError(error)) {
      const errorMessage =
        error.response?.data?.message || "Failed to create account";
      throw new Error(errorMessage);
    }
    console.error("Account creation failed:", error);
    throw new Error("An unexpected error occurred");
  }
}

export const deleteAccount = async ({
  id,
}: {
  id: string;
}): Promise<Account> => {
  const res = await axios.delete(`${API_BASE_URL}/account/${id}`, {
    withCredentials: true,
  });
  return res.data;
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
    if (axios.isAxiosError(error)) {
      const errorMessage =
        error.response?.data?.message || "Invalid username or password.";
      throw new Error(errorMessage);
    }
    throw new Error("An unexpected error occurred");
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
    if (axios.isAxiosError(error)) {
      const errorMessage =
        error.response?.data?.message || "Failed to generate invite link";
      throw new Error(errorMessage);
    }
    throw new Error("An unexpected error occurred");
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
    if (axios.isAxiosError(error)) {
      const errorMessage =
        error.response?.data?.message || "Invalid invitation token";
      console.error("Invitation token validation failed:", {
        message: errorMessage,
        status: error.response?.status,
        data: error.response?.data,
      });
      throw new Error(errorMessage);
    }
    console.error("Unexpected error during token validation:", error);
    throw new Error("An unexpected error occurred");
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
  }
};
