import axios from "axios";
import { getEnvVariable } from "@utils/getEnvVariable";

const API_URL = getEnvVariable("VITE_API_URL");

export const addInteraction = async (questionId, interactionData) => {
  try {
    const url = `${API_URL}/messages/${questionId}`;
    
    const response = await axios.post(url, interactionData, {
      headers: {
        "Content-Type": "application/json",
      },
      withCredentials: true, // cookies are included
    });

    return response
  } catch (error) {
    console.error("Failed to save interaction:", error.message);
    throw error;
  }
};
