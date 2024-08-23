import axios from "axios";
import { getEnvVariable } from "@utils/getEnvVariable";

const API_URL = getEnvVariable("VITE_API_URL");


// Service for Fetching Courses
export const getCourses = async () => {
  try {
    const response = await axios.get(`${API_URL}/courses`, {
      headers: {
        "Content-Type": "application/json",
      },
      withCredentials: true, //  cookies are included in the request
    });

    return response.data; 
  } catch (err) {
    console.error("Error fetching courses:", err.message); 
    throw new Error (`Failed to fetch courses: ${err.message}`); // Throw the error
  }
};
