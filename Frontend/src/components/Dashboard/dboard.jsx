import React, { useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import Navbar from "./Navbar";
import ReactGA from 'react-ga4';
import wave from "/src/assets/Dashboard/wave.png";
import CourseCard from "@/components/CourseCard";
import Footer from "@/components/Footer";

const Dashboard = ({ user }) => {
  const [courses, setCourses] = useState([
    { id: 1, title: "Trigonometry", description: `Start your trigonometry lesson` },
    { id: 2, title: "Integration", description: "Begin the integration course" }
  ]);
  const navigate = useNavigate();

  const handleStartNewLesson = (courseId) => {
    ReactGA.event({
      category: 'User',
      action: 'Clicked a button'
    });

    navigate("/dashboard/lesson",{state:{courseId} });
  };

  return (
    <div className="flex flex-col min-h-screen w-full text-black bg-slate-100 font-Space Grotesk">
    
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
      <Navbar user={user}/>
  
    
      <Outlet />
    </div>
  );
};

export default Dashboard;
