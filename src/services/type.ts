//Property
export type FeatureName =
  | "swimmingPool"
  | "garage"
  | "balcony"
  | "security"
  | "garden"
  | "airConditioning"
  | "furnished"
  | "parking";

export type Property = {
  _id: string;
  id?: string;
  title: string;
  description: string;
  status: string;
  address: string;
  priceType: string;
  propertyType: string;
  price: string;
  rooms: string;
  bathrooms: string;
  propertySize: string;
  isAvailable: boolean;
  features: Record<FeatureName, boolean>;
  images?: string[] | undefined;
  documents?: string[];
};

//Account

export type Account = {
  _id?: string;
  name: string;
  username: string;
  telephone: string;
  emergencyContact: string;
  email: string;
  address: string;
  password?: string;
  images?: string[];
  role: string;
  startDate: string;
  invitationToken?: string;
};

//Login

export interface LoginResponse {
  success: boolean;
  message: string;
  token: string;
  account: Account;
}

export interface User {
  id: string;
  role: "admin" | "fieldAgent" | "customerAgent";
}

//Dashboard

export type PropertyType =
  | "house"
  | "land"
  | "shop"
  | "duplex"
  | "apartment"
  | "office-space"
  | "warehouse"
  | "industrial-property"
  | "restaurant"
  | "hotel"
  | "parking-space"
  | "farm";

export interface PropertyStats {
  type: PropertyType;
  count: number;
  revenue: number;
  averagePrice: number;
}

export interface DashboardData {
  totalProperties: number;
  totalRevenue: number;
  averagePrice: number;
  propertiesSold: number;
  propertyStats: PropertyStats[];
  monthlyTrends: Array<{
    month: string;
    properties: number;
    revenue: number;
  }>;
}

export interface DashboardContextType {
  data: DashboardData;
  selectedTimeframe: "weekly" | "monthly" | "yearly";
  setSelectedTimeframe: (timeframe: "weekly" | "monthly" | "yearly") => void;
  isLoading: boolean;
}
