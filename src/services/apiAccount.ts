import { uploadFile } from "./apiProperty";
import axios from "axios";
import { Account, LoginResponse } from "./type";

const API_BASE_URL = "http://localhost:3000/api";

type LoginData = Pick<Account, "username" | "password">;

let authToken: string | null = null;

export const setAuthToken = (token: string | null) => {
  authToken = token;
};

export const getAuthToken = (): string | null => {
  return authToken;
};

const getAuthHeaders = () => {
  return authToken ? { Authorization: `Bearer ${authToken}` } : {};
};

export const fetchStaffDetails = async (): Promise<Account[]> => {
  try {
    const res = await axios.get(`${API_BASE_URL}/account`, {
      headers: getAuthHeaders(),
    });
    console.log("API Response:", res.data);
    return res.data;
  } catch (error) {
    console.error("Fetch staff details failed:", error);
    throw error;
  }
};

export async function createAccount(formData: FormData): Promise<Account> {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("Please log in to create an account");
    }

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
    headers: getAuthHeaders(),
  });
  return res.data;
};

export const storeToken = async (token: string): Promise<void> => {
  try {
    await axios.post(
      `${API_BASE_URL}/account/token`,
      { token },
      {
        headers: getAuthHeaders(),
      }
    );
  } catch (error) {
    console.error("Failed to store token:", error);
    throw new Error("Failed to store authentication token");
  }
};

export const getStoredToken = async (): Promise<string | null> => {
  try {
    const response = await axios.get(`${API_BASE_URL}/account/token`, {
      headers: getAuthHeaders(),
    });
    return response.data.token;
  } catch (error) {
    console.error("Failed to retrieve token:", error);
    return null;
  }
};

// In your apiAccount.ts file, update the loginAccount function
export const loginAccount = async (formData: FormData): Promise<{account: Account, token: string}> => {
  try {
    const loginData: LoginData = {
      username: formData.get("username") as string,
      password: formData.get("password") as string,
    };

    const response = await axios.post<LoginResponse>(
      `${API_BASE_URL}/account/login`,
      loginData,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    // Set the token in memory and store in backend
    setAuthToken(response.data.token);
    await storeToken(response.data.token);
    
    // Return both account and token
    return {
      account: response.data.account,
      token: response.data.token
    };
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const errorMessage = error.response?.data?.message || "Login failed";
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
        headers: {
          "Content-Type": "application/json",
          ...getAuthHeaders(),
        },
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
        headers: {
          "Content-Type": "application/json",
        },
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
    const storedToken = await getStoredToken();
    if (!storedToken) {
      setAuthToken(null);
      return false;
    }
    
    setAuthToken(storedToken);
    
    await axios.get(`${API_BASE_URL}/auth/account/verify`, {
      headers: getAuthHeaders(),
    });
    return true;
  } catch (error) {
    console.error("Token verification failed:", error);
    setAuthToken(null);
    return false;
  }
};

export const logout = async (): Promise<void> => {
  try {
    await axios.post(
      `${API_BASE_URL}/account/logout`,
      {},
      {
        headers: getAuthHeaders(),
      }
    );
  } catch (error) {
    console.error("Logout error:", error);
  } finally {
    setAuthToken(null);
  }
};