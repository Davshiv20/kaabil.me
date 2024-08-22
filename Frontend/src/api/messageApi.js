export const saveInteraction = async (questionId, interactionData) => {
    try {
      // Uncomment for production
      // const url = `https://www.kaabil.me/api/messages/${questionId}`;
      const url = `http://localhost:3000/api/messages/${questionId}`;
  
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(interactionData),
        credentials: "include",
      });
  
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
  
      const responseData = await response.json();
      return responseData; // Returning the saved interaction data
    } catch (error) {
      console.error("Failed to save interaction:", error);
      throw error; // Re-throwing the error for the calling code to handle
    }
  };
  