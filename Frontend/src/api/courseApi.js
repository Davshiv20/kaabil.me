
// Fetching Courses

export const fetchCourses = async () => {
  try {
    const response = await fetch("http://localhost:3000/api/courses", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    });
    if (!response.ok) {
      throw new Error("Failed to fetch courses");
    }
    return await response.json();
  } catch (err) {
    console.err("Error in fetching courses:", err);
    throw err;
  }
};

//Fetching Question

export const fetchingQuestions = async (subjectName) => {
  try {
    const response = await fetch(
      `http://localhost:3000/api/lessons/questions/${subjectName}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      }
    );
    if (!response.ok) {
      throw new Error("Failed to fetch questions");
    }
    return await response.json();
  } catch (error) {
    console.error("Error fetching questions:", error);
    throw error;
  }
};
