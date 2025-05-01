import { z } from "zod";

export const propertySchema = z.object({
  title: z.string().min(5, { message: "Title must be at least 5 characters" }),
  description: z
    .string()
    .min(20, { message: "Description must be at least 20 characters" }),
  price: z.string().min(1, { message: "Price is required" }),
  priceType: z.string().min(1, { message: "Price type is required" }),
  address: z.string().min(3, { message: "Address is required" }),
  rooms: z.string().optional(),
  bathrooms: z.string().optional(),
  propertyType: z.string().min(1, { message: "Property type is required" }),
  status: z.string().min(1, { message: "Status is required" }),
  propertySize: z.string().min(1, { message: "Property size is required" }),
  isAvailable: z.boolean().default(true),
  features: z.object({
    swimmingPool: z.boolean().default(false),
    garage: z.boolean().default(false),
    balcony: z.boolean().default(false),
    security: z.boolean().default(false),
    garden: z.boolean().default(false),
    airConditioning: z.boolean().default(false),
    furnished: z.boolean().default(false),
    parking: z.boolean().default(false),
  }),
  images: z.any().optional(),
  documents: z.any().optional(),
});

export type PropertyFormValues = z.infer<typeof propertySchema>;
