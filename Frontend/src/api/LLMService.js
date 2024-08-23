import axios from "axios";
import { getEnvVariable } from "@utils/getEnvVariable";

const API_URL = getEnvVariable("VITE_API_URL");

export const getHelp = async (formData) => {
  try {
    const response = await axios.post(`${API_URL}/openai`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return response.data;
  } catch (error) {
    console.error("Error fetching help from API:", error.message);
    throw error; // Throw the error 
  }
};

