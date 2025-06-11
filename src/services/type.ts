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

export type Account = {
  _id?: string;
  name: string;
  username: string;
  telephone: string;
  emergencyContact: string;
  email: string;
  address: string;
  images?: string;
  startDate: string;
};
