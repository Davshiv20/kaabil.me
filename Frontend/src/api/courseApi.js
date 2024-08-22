
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

export const fetchQuestionsBySubjectAndLessonId = async (subject, lessonId) => {
  try {
    console.log(`Fetching questions for subject: ${subject} and lessonId: ${lessonId}`);
    const response = await fetch(`http://localhost:3000/api/lessons/questions/${subject}/${lessonId}`);
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to fetch questions: ${errorText}`);
    }
    return await response.json();
  } catch (error) {
    console.error("Error fetching questions:", error);
    throw error;
  }
};


export const fetchQuestionsBySubjectName = async (subjectName) => {
  try {
    const url = `http://localhost:3000/api/lessons/questions/${subjectName}`;
    
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    });

    if (!response.ok) {
      const errorText = await response.text(); // Get the error text for more details
      throw new Error(`Failed to fetch questions: ${errorText}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching questions:", error);
    throw error;
  }
};


