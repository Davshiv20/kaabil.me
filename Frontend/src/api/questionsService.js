import axios from "axios";
import { getEnvVariable } from "@utils/getEnvVariable";

const API_URL = getEnvVariable("VITE_API_URL");

// Service for Fetching Questions


export const getQuestionsByLessonId = async (subject, lessonId) => {
  try {
    const response = await axios.get(`${API_URL}/lessons/questions/${subject}/${lessonId}`, {
      headers: {
        "Content-Type": "application/json",
      },
      withCredentials: true, // cookies are included
    });

    return response.data; 
  } catch (error) {
    console.error("Error fetching questions:", error.message); 
    throw new Error(`Failed to fetch questions: ${error.message}`); 
  }
};

export const getQuestionsBySubjectName = async (subjectName) => {
  try {
    const response = await axios.get(`${API_URL}/lessons/questions/${subjectName}`, {
      headers: {        
        "Content-Type": "application/json",
      },
      withCredentials: true, // cookies are included
    });

    console.log('respone', response)
    return response.data
  } catch (error) {
    console.error("Error fetching questions:", error.message)
    throw new Error(`Failed to fetch questions: ${error.message}`)
  }
};
