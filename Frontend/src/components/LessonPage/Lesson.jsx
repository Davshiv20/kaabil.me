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
    navigate("/dashboard/Lesson/chapter", { state: { subject, courseId } });
  };

  const handleLevelClick = (levelNumber) => {
    console.log("Navigating to level:", levelNumber);
    const subject = courseId === 1 ? "Trigonometry" : "Integration";
    const lessonId = levelNumber; // Example setup, replace with actual logic to get lessonId.
    const isLargeScreen = window.innerWidth >= 1024;
    
    navigate(`/dashboard/Lesson/chapter`, {
      state: { subject, courseId, lessonId, fullscreen: isLargeScreen },
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
