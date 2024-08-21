import React from "react";
import defaultCover from "@assets/Dashboard/courseCover.png";
import {
  Card,
 // CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@ui-components/card";
import { Button } from "@ui-components/button";

const CourseCard = ({ title, description, onStartNewLesson }) => {
  return (
    <Card className="max-w-sm hover:scale-105 duration-500 bg-slate-200 px-4 border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700 transform transition-transform relative">
      <CardHeader className="p-5">
        <img src={defaultCover} className="rounded-lg h-[230px] w-[290px]" alt="Cover" />
        <CardTitle className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">{title}</CardTitle>

      </CardHeader>
      <CardFooter className="p-5">
        <Button onClick={onStartNewLesson}>
          <p className="underline">Start Course</p>
        </Button>
      </CardFooter>
    </Card>
  );
};

export default CourseCard;


//        <CardDescription className="font-normal text-gray-700 dark:text-gray-400">{description}</CardDescription>