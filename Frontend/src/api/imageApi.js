export const imageApi = async () => {
    try {
      const response = await fetch("https://www.kaabil.me/api/image/upload");
      if (!response.ok) {
        throw new Error("Failed to fetch courses");
      }
      return await response.json();
    } catch (err) {
      console.err("Error in fetching courses:", err);
      throw err;
    }
  };
  