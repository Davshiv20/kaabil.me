import { getEnvVariable } from "@utils/getEnvVariable";
import axios from "axios";

const API_URL = getEnvVariable("VITE_API_URL");


//TODO : 
// 1. Backend Dev should Create two different endpints for Image and File 



// Service for Uploading Image or File
export const uploadImage = async (formData) => {
  try {
    const response = await axios.post(`${API_URL}/image/upload`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return response
  } catch (err) {
    console.error("Error uploading image:", err.message); 
    throw err;
  }
};
