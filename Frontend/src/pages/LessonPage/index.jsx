import React, { useState, useEffect } from "react";
import Navbar from "@components/AppNavbar";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import LessonCard from "./components/LessonCard";
import LevelsContainer from "./components/LevelsContainer";
import ReactGA from 'react-ga4';
import { useSelector } from "react-redux";
import { fetchCourses, fetchingQuestions } from "@api/courseApi"

const Lesson = () => {
  const location = useLocation();
  const courseId = location.state?.courseId;
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [questions, setQuestions] = useState([]);
  const user = useSelector((state) => state.auth.user);

  useEffect(() => {
    console.log("Component mounted, courseId:", courseId);
    ReactGA.send({ hitType: "pageview", page: window.location.pathname });
    fetchCourseAndQuestions();
  }, [courseId]);

  const fetchCourseAndQuestions = async () => {
    try {
      const coursesData = await fetchCourses();
      const selectedCourse = coursesData[courseId];
      setCourse(selectedCourse);

      const questionsData = await fetchingQuestions(selectedCourse.subjectName);
      setQuestions(questionsData);
    } catch (error) {
      console.error('Error fetching course and questions:', error);
    }
  };

  const generateLevels = () => {
    const groupedQuestions = questions.reduce((acc, question) => {
      if (!acc[question.LessonId]) {
        acc[question.LessonId] = [];
      }
      acc[question.LessonId].push(question);
      return acc;
    }, {});

    const sortedLessonIds = Object.keys(groupedQuestions).sort((a, b) => parseInt(a) - parseInt(b));

    const frontendLessons = sortedLessonIds.slice(0, 10).map((lessonId, index) => {
      const levelQuestions = groupedQuestions[lessonId];
      return {
        number: index + 1,
        title: `Lesson ${index + 1}`,
        description: levelQuestions.length > 0 ? 
          `${levelQuestions[0].chapter} - ${levelQuestions[0].question_type}` : 
          "No questions available",
        isActive: index === 0,
        isComplete: false,
        lessonId: parseInt(lessonId),
        questionCount: levelQuestions.length
      };
    });

    return frontendLessons;
  };

  const levels = generateLevels();

  const handleStartChapter = () => {
    if (course && levels.length > 0) {
      navigate("/dashboard/Lesson/chapter", { 
        state: { 
          subject: course.subjectName, 
          courseId, 
          lessonId: levels[0].lessonId,
          levelNumber: 1
        } 
      });
    }
  };

  const handleLevelClick = (levelNumber) => {
    if (course && levels[levelNumber - 1]) {
      const level = levels[levelNumber - 1];
      navigate(`/dashboard/Lesson/chapter`, {
        state: { 
          subject: course.subjectName, 
          courseId, 
          lessonId: level.lessonId, 
          levelNumber 
        },
      });
    }
  };

  const getContent = () => {
    if (!course) return {
      title: "Welcome",
      description: "Select a course to start learning.",
      duration: "N/A",
      language: "N/A",
      xp: "0 XP",
      level: "Beginner",
    };
    return {
      title: course.subjectName,
      description: course.courseDescription,
      duration: "45 minutes",
      language: "English",
      xp: "100 XP",
      level: "Intermediate",
    };
  };

  const courseContent = getContent();

  return (
    <>
      <div className="flex flex-col mt-20 min-h-screen bg-slate-100 font-Space Grotesk">
        <div className="flex justify-center items-center px-6 md:px-4 py-4 mt-8 lg:mt-16 md:mt-16 max-w-6xl mx-auto w-full">
          {levels && levels.length > 0 ? (
            <LessonCard
              {...courseContent}
              levels={levels}
              onClickStartChapter={handleStartChapter}
            />
          ) : (
            <p>No levels available</p>
          )}
        </div>
        <div className="flex justify-center items-center w-full py-4 px-4">
          <LevelsContainer levels={levels} onLevelClick={handleLevelClick} />
        </div>
        <Outlet />
      </div>
      <Navbar user={user} />
    </>
  );
};

export default Lesson;






























/*
import React, { useState, useEffect } from "react";
import Navbar from "../Dashboard/Navbar";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import LessonCard from "./LessonCard";
import LevelsContainer from "./LevelsContainer";
import ReactGA from 'react-ga4';
const isLargeScreen = window.innerWidth >= 1024;


const Lesson = ({ user }) => {
  const location = useLocation();
  const courseId = location.state?.courseId;
  const navigate = useNavigate();

  useEffect(() => {
    ReactGA.send({ hitType: "pageview", page: window.location.pathname });
  }, []);

  // Function to generate levels dynamically
  const generateLevels = (courseId) => {
    if (courseId === 1) {
      return [
        {
          number: 1,
          title: "Level 1",
          description: "Complete overview of Trigonometry.",
          isActive: true,
          isComplete: false,
        },
      ];
    } else if (courseId === 2) {
      return Array.from({ length: 26 }, (_, i) => ({
        number: i + 1,
        title: `Level ${i + 1}`,
        description: `Integration topic ${i + 1}.`,
        isActive: i === 0,
        isComplete: false,
      }));
    }
    return []; // Default empty array for courses without specific levels
  };

  // State initialization using the generateLevels function
  const [levels, setLevels] = useState(generateLevels(courseId));

  const handleStartChapter = () => {
    const subject = courseId === 1 ? "Trigonometry" : "Integration";
    navigate("/dashboard/Lesson/chapter", { state: { subject, courseId,fullscreen: isLargeScreen } });
  };

  const handleLevelClick = (levelNumber) => {
    console.log("Navigating to level:", levelNumber);
    const subject = courseId === 1 ? "Trigonometry" : "Integration";
    const lessonId = levelNumber; // Example setup, replace with actual logic to get lessonId.
    navigate(`/dashboard/Lesson/chapter`, {
      state: { subject, courseId, lessonId, fullscreen: true },
    });
  };

  const getContent = () => {
    switch (courseId) {
      case 1:
        return {
          title: "Trigonometry",
          description:
            "Trigonometry forms a major part of the JEE syllabus, with questions appearing consistently each year. Trigonometric principles are essential for solving problems in calculus, complex numbers, mechanics, wave motion, and electromagnetism which are heavily tested in JEE.",
          duration: "45 minutes",
          language: "English",
          xp: "100 XP",
          level: "Intermediate",
        };
      case 2:
        return {
          title: "Integration",
          description:
            "Dive into the essential techniques of Integration with this course. A strong foundation in integration helps in other sections too such as calculus, mechanics, electromagnetism, and thermodynamics, to name a few.",
          duration: "90 minutes",
          language: "English",
          xp: "150 XP",
          level: "Advanced",
        };
      default:
        return {
          title: "Welcome",
          description: "Select a course to start learning.",
          duration: "N/A",
          language: "N/A",
          xp: "0 XP",
          level: "Beginner",
        };
    }
  };

  const course = getContent();

  return (
    <>
      <div className="flex flex-col mt-20 min-h-screen bg-slate-100 font-Space Grotesk">
        <div className="flex justify-center items-center px-6 md:px-4 py-4 mt-8 lg:mt-16 md:mt-16 max-w-6xl mx-auto w-full">
          {levels && levels.length > 0 && (
            <LessonCard
            courseId={courseId}
              {...course}
              levels={levels}
              onClickStartChapter={handleLevelClick}
            />
          )}
        </div>
        <div className="flex justify-center items-center w-full py-4 px-4">
          <LevelsContainer levels={levels} onLevelClick={handleLevelClick} />
        </div>
        <Outlet />
      </div>
      <Navbar user={user} />
    </>
  );
};

export default Lesson;
*/




/*
import React, { useState, useEffect } from "react";
import Navbar from "../Dashboard/Navbar";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import LessonCard from "./LessonCard";
import LevelsContainer from "./LevelsContainer";
import ReactGA from 'react-ga4';

const Lesson = ({ user }) => {
  const location = useLocation();
  const courseId = location.state?.courseId;
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [lessons, setLessons] = useState([]);

  useEffect(() => {
    ReactGA.send({ hitType: "pageview", page: window.location.pathname });
    fetchCourseAndLessons();
  }, [courseId]);

  const fetchCourseAndLessons = async () => {
    try {
      const courseResponse = await fetch(
        `http://localhost:3000/api/courses/`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include'
      }
      );
      const coursesData = await courseResponse.json();
      const selectedCourse = coursesData[courseId];
      setCourse(selectedCourse);

      const lessonsResponse = await fetch(`http://localhost:3000/api/lessons/questions/?subjectName=${selectedCourse.subjectName}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include'
      });
      const lessonsData = await lessonsResponse.json();
      setLessons(lessonsData);
    } catch (error) {
      console.error('Error fetching course and lessons:', error);
    }
  };

  const generateLevels = () => {
    const totalLevels = 10;
    const questionsPerLevel = Math.ceil(lessons.length / totalLevels);
    
    return Array.from({ length: totalLevels }, (_, index) => {
      const startIndex = index * questionsPerLevel;
      const endIndex = Math.min((index + 1) * questionsPerLevel, lessons.length);
      const levelLessons = lessons.slice(startIndex, endIndex);
      
      return {
        number: index + 1,
        title: `Level ${index + 1}`,
        description: levelLessons.length > 0 ? 
          `${levelLessons[0].chapter} - ${levelLessons[0].question_type}` : 
          "No lessons available",
        isActive: index === 0,
        isComplete: false,
      };
    });
  };

  const levels = generateLevels();

  const handleStartChapter = () => {
    if (course) {
      navigate("/dashboard/Lesson/chapter", { state: { subject: course.subjectName, courseId } });
    }
  };

  const handleLevelClick = (levelNumber) => {
    if (course) {
      console.log("Navigating to level:", levelNumber);
      const questionsPerLevel = Math.ceil(lessons.length / 10);
      const startIndex = (levelNumber - 1) * questionsPerLevel;
      const lessonId = lessons[startIndex]?.LessonId;
      navigate(`/dashboard/Lesson/chapter`, {
        state: { subject: course.subjectName, courseId, lessonId, levelNumber },
      });
    }
  };

  const getContent = () => {
    if (!course) return {
      title: "Welcome",
      description: "Select a course to start learning.",
      duration: "N/A",
      language: "N/A",
      xp: "0 XP",
      level: "Beginner",
    };

    return {
      title: course.subjectName,
      description: course.courseDescription,
      duration: "45 minutes",
      language: "English",
      xp: "100 XP",
      level: "Intermediate",
    };
  };

  const courseContent = getContent();

  return (
    <>
      <div className="flex flex-col mt-20 min-h-screen bg-slate-100 font-Space Grotesk">
        <div className="flex justify-center items-center px-6 md:px-4 py-4 mt-8 lg:mt-16 md:mt-16 max-w-6xl mx-auto w-full">
          {levels && levels.length > 0 && (
            <LessonCard
              {...courseContent}
              levels={levels}
              onClickStartChapter={handleLevelClick}
            />
          )}
        </div>
        <div className="flex justify-center items-center w-full py-4 px-4">
          <LevelsContainer levels={levels} onLevelClick={handleLevelClick} />
        </div>
        <Outlet />
      </div>
      <Navbar user={user} />
    </>
  );
};

export default Lesson;

*/


