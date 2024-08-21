import { Button } from "@ui-components/button";
import React from "react";
import start from "@assets/play.png";

const Level = ({ level, isActive, isComplete, onClick }) => {
  const baseStyle = "flex items-center mb-2 max-w-50 py-4 rounded-lg  shadow-lg transition duration-200 ease-in-out transform hover:scale-105 cursor-pointer";
  const activeStyle = "bg-gradient-to-r from-blue-500 to-blue-900 text-white";
  const pendingStyle = "bg-gradient-to-r from-blue-400 to-blue-600 text-gray-800";
  const completedStyle = "bg-gradient-to-r from-green-500 to-green-400 text-white";

  let appliedStyle = baseStyle;
  if (isActive) {
      appliedStyle += ` ${pendingStyle}`;
  } else if (isComplete) {
      appliedStyle += ` ${completedStyle}`;
  } else {
      appliedStyle += ` ${pendingStyle}`;
  }


  return (
      <button onClick={onClick} className={appliedStyle}>
          <div className="flex-grow flex flex-col justify-center items-center">
              <h3 className="font-bold text-xl">{level.title}</h3>
              <img src={start} className="h-5 w-5 my-1 "/>
              <p className="text-sm bg-slate-100 bg-opacity-20 max-w-20 py-2 rounded-lg">{level.description}</p>
              {/* <p className="text-xs text-slate-200 ">{isActive ? 'Current' : isComplete ? 'Completed' : 'Pending'}</p> */}
          </div>
      </button>
  );
};


export default Level;