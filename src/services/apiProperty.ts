import axios from "axios";
import { Property } from "./type";
const API_BASE_URL = "http://localhost:3000/api";

export const fetchProperties = async (): Promise<Property[]> => {
  const res = await axios.get(`${API_BASE_URL}/propertys`);
  return res.data;
};

export const getSingleProperty = async (id: string): Promise<Property> => {
  const res = await axios.get(`${API_BASE_URL}/propertys/${id}`);
  return res.data;
};

export const updateProperty = async (id: string, data: FormData): Promise<Property> => {
  const res = await axios.patch(`${API_BASE_URL}/properties/${id}`, data, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return res.data;
};

// const API_BASE_URL = "http://localhost:3000/api";
// export const fetchProperty = async () => {
//   const res = await axios.get(`${API_BASE_URL}/propertys`);
//   return res.data;
// };

// export const getSingleProperty = async (id:string) => {
//   const res = await axios.get(`${API_BASE_URL}/propertys/:${id}`)
//   return res.data
// }

// export const updateProperty = async (id: string, data: FormData) => {
//   const res = await axios.put(`${API_BASE_URL}/propertys/:${id}`, data);
//   return res.data;
// };
