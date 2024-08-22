export const openApi = async () => {
    try {
      const response = await fetch("http://localhost:3000/api/openai");
      if (!response.ok) {
        throw new Error("Failed to fetch courses");
      }
      return await response.json();
    } catch (err) {
      console.err("Error in fetching courses:", err);
      throw err;
    }
  };
  