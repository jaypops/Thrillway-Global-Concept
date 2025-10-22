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
  images?: string[] 
  role: string;
  startDate: string;
  invitationToken?: string;
};

export interface User {
  id: string;
  role: "admin" | "fieldAgent" | "customerAgent";
  name: string;
  username: string;
  telephone: string;
  emergencyContact: string;
  email: string;
  address: string;
  startDate: string;
  images?: string[];
}

export interface LoginResponse {
  success: boolean;
  message: string;
  account: Account;
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

export interface DashboardContextType {
  data: DashboardData | null;
  selectedTimeframe: "weekly" | "monthly" | "yearly";
  setSelectedTimeframe: (timeframe: "weekly" | "monthly" | "yearly") => void;
  isLoading: boolean;
  propertiesSold: number;
  totalRevenue: number;
  totalProperties: number;
  propertiesPending?: number;
}

export interface DashboardData {
  propertyStats: {
    type: string;
    count: number;
    revenue: number;
    averagePrice: number;
  }[];
  monthlyTrends: {
    month: string;
    properties: number;
    revenue: number;
  }[];
}

//Message

export type Message = {
  id: string;
  content: string;
  sender: "user" | "admin";
  timestamp: Date;
};

export type Chat = {
  id: string;
  user: {
    id: string;
    name: string;
    avatar: string;
    online: boolean;
    lastSeen?: Date;
  };
  messages: Message[];
  unreadCount: number;
  lastMessage?: Message;
};

export type ChatContextType = {
  chats: Chat[];
  activeChat: Chat | null;
  setActiveChat: (chat: Chat | null) => void;
  sendMessage: (content: string) => void;
  copyMessageId: (id: string) => void;
  isMobileView: boolean;
  showSidebar: boolean;
  setShowSidebar: (show: boolean) => void;
};