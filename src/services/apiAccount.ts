import { uploadFile } from './apiProperty';
import axios from 'axios';
import { Account, LoginResponse } from './type';

const API_BASE_URL = 'http://localhost:3000/api';

type LoginData = Pick<Account, 'username' | 'password'>;

const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export const fetchStaffDetails = async (): Promise<Account[]> => {
  try {
    const res = await axios.get(`${API_BASE_URL}/account`, {
      headers: getAuthHeaders(),
    });
    console.log('API Response:', res.data);
    return res.data;
  } catch (error) {
    console.error('Fetch staff details failed:', error);
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
      role: (formData.get("role") as "admin" | "staff") || "staff",
      startDate: formData.get("startDate") as string,
    };

    const response = await axios.post<Account>(`${API_BASE_URL}/account`, accountData, {
      headers: {
        "Content-Type": "application/json",
        ...getAuthHeaders(), 
      },
    });

    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const errorMessage = error.response?.data?.message || "Failed to create account";
      throw new Error(errorMessage);
    }
    console.error("Account creation failed:", error);
    throw new Error("An unexpected error occurred");
  }
}

export const deleteAccount = async ({ id }: { id: string }): Promise<Account> => {
  const res = await axios.delete(`${API_BASE_URL}/account/${id}`, {
    headers: getAuthHeaders(),
  });
  return res.data;
};

export const loginAccount = async (formData: FormData): Promise<Account> => {
  try {
    const loginData: LoginData = {
      username: formData.get('username') as string,
      password: formData.get('password') as string,
    };

    const response = await axios.post<LoginResponse>(`${API_BASE_URL}/account/login`, loginData, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    localStorage.setItem('token', response.data.token);
    return response.data.account;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const errorMessage = error.response?.data?.message || 'Login failed';
      throw new Error(errorMessage);
    }
    throw new Error('An unexpected error occurred');
  }
};

export const verifyToken = async (): Promise<boolean> => {
  try {
    await axios.get(`${API_BASE_URL}/auth/account/verify`, {
      headers: getAuthHeaders(),
    });
    return true;
  } catch (error) {
    console.error('Token verification failed:', error);
    localStorage.removeItem('token');
    return false;
  }
};

export const logout = () => {
  localStorage.removeItem('token');
};