import React from 'react';
import { Button } from "@ui-components";
import chart from "@assets/Dashboard/chart.png";
import elearning from "@assets/Dashboard/elearning.png";
import startnew from "@assets/Dashboard/books.png";

const CourseBtn = ({ onStartNewLesson }) => {
  const commonButtonClasses = `
    flex flex-col text-white p-4 font-md rounded-xl
    items-center justify-center text-center py-8 m-2      
  `;

  return (
    <div className="flex flex-wrap justify-between md:flex-row sm:flex-wrap ">
      <Button onClick={onStartNewLesson} className={`${commonButtonClasses} h-30 w-50`}>
        <div className="flex flex-col items-center justify-center h-full ">
          <img src={startnew} alt="Start New Lesson" className="h-10 w-10 mb-2" />
          <span className="text-lg font-normal">Start New Lesson</span>
        </div>
      </Button>
      <Button className={`${commonButtonClasses} bg-purple h-30 w-50`}>
        <div className="flex flex-col items-center justify-center h-full">
          <img src={elearning} alt="Resume Where Left" className="h-10 md:h-20 md:w-20 w-10 m-2" />
          <span className="text-lg font-normal">Resume Where Left</span>
        </div>
      </Button>
      <Button className={`${commonButtonClasses} bg-yellowbg h-30 w-50 `}>
        <div className="flex flex-col items-center justify-center h-full">
          <img src={chart} alt="Progress Report" className="h-10 w-10 mb-2" />
          <span className="text-lg font-normal">Progress Report</span>
        </div>
      </Button>
    </div>
  );
};

export default CourseBtn;
