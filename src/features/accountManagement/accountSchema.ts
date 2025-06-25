import { z } from "zod";

export const formSchema = z.object({
  name: z.string().min(1, "Name is required"),
  username: z.string().min(1, "Username is required"),
  telephone: z.string().min(1, "Telephone is required"),
  emergencyContact: z.string().min(1, "Emergency contact is required"),
  email: z.string().email("Invalid email address"),
  address: z.string().min(1, "Address is required"),
  password: z.string().min(3, "Password is required"),
  startDate: z.date().optional(),
  image: z.instanceof(File).optional(),
});