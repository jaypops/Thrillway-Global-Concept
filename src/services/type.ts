export type Property = {
  _id: string;  
  id?: string;
  title: string;
  description: string;
  status: "pending" | "processing" | "success" | "failed";
  address: string;
  priceType: string;
  propertyType: string;
  price: string;
  rooms: string;
  bathrooms: string;
  propertySize: string;
  isAvailable: boolean;
  features: {
    swimmingPool: boolean;
    garage: boolean;
    balcony: boolean;
    security: boolean;
    garden: boolean;
    airConditioning: boolean;
    furnished: boolean;
    parking: boolean;
  };
  images?: string[];
  documents?: string[];
};





