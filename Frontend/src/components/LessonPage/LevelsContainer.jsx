import { Button } from "../ui/button";
import React from "react";
import Level from "./LevelsPage";

const LevelsContainer = ({ levels, onLevelClick }) => {
    
   
    return (
        <div className="w-60 bg-slate-200 p-4 rounded-lg shadow-md flex flex-col items-stretch">
            {levels.map((level, index) => (
                <Level
                    key={index}
                    level={level}
                    isActive={level.isActive}
                    isComplete={level.isComplete}
                    onClick={() => onLevelClick(level.number)}
                />
            ))}
        </div>
    );
};


export default LevelsContainer;