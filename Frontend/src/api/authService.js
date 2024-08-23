import { getEnvVariable } from "@utils/getEnvVariable";
import axios from "axios";

const API_URL = getEnvVariable("VITE_API_URL")

export const getUserData = async () => {
   try{
    const { data } = await axios.get(`${API_URL}/auth/login/sucess`, { withCredentials: true });
    return data
   } catch (err) {
    console.error("Error fetching user data:", err);
    throw new Error(`Failed to fetch user data: ${err.message}`);
  };
}
  