import React, { useState, useEffect } from "react";
import Navbar from "@components/AppNavbar";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import LessonCard from "./components/LessonCard";
import LevelsContainer from "./components/LevelsContainer";
import ReactGA from 'react-ga4';
import { useSelector } from "react-redux";
import { getCourses } from "@api/courseService";
import { getQuestionsBySubjectName } from "@api/questionsService";

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
      const coursesData = await getCourses()
      const selectedCourse = coursesData[courseId];
      console.log('selectedCourse', selectedCourse)
      setCourse(selectedCourse);
      const questionsData = await getQuestionsBySubjectName(selectedCourse.subjectName);
      setQuestions(questionsData);
    } catch (error) {
      console.error('Error fetching course and questions:', error);
    }
  };

  const generateLevels = () => {
    console.log("Generating levels...");
    // Group questions by LessonId
    const groupedQuestions = questions.reduce((acc, question) => {
      if (!acc[question.LessonId]) {
        acc[question.LessonId] = [];
      }
      acc[question.LessonId].push(question);
      return acc;
    }, {});

    // Sort LessonIds
    const sortedLessonIds = Object.keys(groupedQuestions).sort((a, b) => parseInt(a) - parseInt(b));

    // Create frontend lessons (up to 10)
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

    console.log("Generated levels:", frontendLessons);
    return frontendLessons;
  };

  const levels = generateLevels();

  console.log("Rendered levels:", levels);

  // ... rest of the component code ...

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
      console.log("Navigating to level:", levelNumber);
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