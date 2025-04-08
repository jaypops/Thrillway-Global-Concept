import axios from "axios";
const API_KEY = "pk.84f97c8d7d2981477355785e7fc4be85";
const API_URL = "https://us1.locationiq.com/v1/autocomplete";

export const fetchLocation = async (query: string) => {
  try {
    const res = await axios.get(`${API_URL}`, {
      params: {
        key: API_KEY,
        q: query,
        format: "json",
        counterycodes: "ng"
      },
    });
    return res.data;
  } catch (error) {
    console.log(error);
  }
};
