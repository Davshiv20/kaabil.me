import React, { useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import Navbar from "./Navbar";
import ReactGA from 'react-ga4';
import wave from "/src/assets/Dashboard/wave.png";
import CourseCard from "@/components/CourseCard";
import Footer from "@/components/Footer";
import Lottie from "lottie-react";
import loader from "/src/assets/loader.json"; // Assuming you have a loader animation

const Dashboard = ({ user }) => {
  const [courses, setCourses] = useState([
    { id: 1, title: "Trigonometry", description: `Start your trigonometry lesson`, imageUrl: "/src/assets/trigonometry.png" },
    { id: 2, title: "Integration", description: "Begin the integration course", imageUrl: "/src/assets/integration.png" }
  ]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  const handleStartNewLesson = (courseId) => {
    ReactGA.event({
      category: 'User',
      action: 'Clicked a button'
    });

    navigate("/dashboard/lesson",{state:{courseId} });
  };

  useEffect(() => {
    let loadedImages = 0;

    const imageLoadHandler = () => {
      loadedImages++;
      if (loadedImages === courses.length) {
        setIsLoading(false);
      }
    };

    courses.forEach(course => {
      const img = new Image();
      img.src = course.imageUrl;
      img.onload = imageLoadHandler;
      img.onerror = imageLoadHandler; // Handle errors as well
    });

    // Set a timeout to ensure the loading state changes after a certain period even if some images fail to load
    const loadingTimeout = setTimeout(() => {
      setIsLoading(false);
    }, 5000); // 5 seconds timeout

    return () => clearTimeout(loadingTimeout); // Cleanup timeout
  }, [courses]);

  return (
    <div className="flex flex-col min-h-screen w-full text-black bg-slate-100 font-Space Grotesk">
      {isLoading ? (
        <div className="flex justify-center items-center min-h-screen">
          <Lottie animationData={loader} loop={true} style={{ height: 150, width: 150 }} />
        </div>
      ) : (
        <>
          <div className="flex-grow md:text-3xl lg:text-3xl text-xl sm:text-xl flex flex-col text-left px-8 md:px-12 mt-16 md:mt-24">
            <div className="flex md:flex-row lg:flex-row mt-16 sm:flex-col justify-center mb-4 md:w-140">
              <h1 className="bg-gradient-to-r from-red-900 to-orange inline-block text-transparent bg-clip-text font-bold">
                Welcome Back, {user && user.displayName ? user.displayName : "Guest"}!
              </h1>
              <img src={wave} className="md:h-8 md:w-8 sm:h-4 sm:w-4 h-4 w-4 ml-2 md:ml-8" alt="hand wave" />
            </div>
            <h1 className="py-8">My Courses</h1>
            <div className="flex flex-row justify-center flex-wrap mt-8">
              {courses.map(course => (
                <div key={course.id} className="p-4 mb-8 mr-4">
                  <CourseCard course={course} onStartNewLesson={() => handleStartNewLesson(course.id)} />
                </div>
              ))}
            </div>
          </div>
          <Navbar user={user} />
          <Outlet />
        </>
      )}
    </div>
  );
};

export default Dashboard;
