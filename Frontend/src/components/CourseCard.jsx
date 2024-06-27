import React from "react";
import cover from "../assets/Dashboard/courseCover.png";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "./ui/button";
const ExampleCard = ({ title, description, onStartNewLesson }) => {
  return (
    <Card className="max-w-sm hover:scale-105 duration-500 bg-slate-200 px-4 border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700 transform transition-transform relative">
      <CardHeader className="p-5">
        <img src={cover} className="rounded-lg h-[230tripx] w-[290px]" alt="Cover" />
        <CardTitle className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">{title}</CardTitle>
        <CardDescription className="font-normal text-gray-700 dark:text-gray-400">{description}</CardDescription>
      </CardHeader>
      <CardFooter className="p-5">
        <p className="font-normal text-gray-700 dark:text-gray-400">
          <Button onClick={onStartNewLesson}>
            <p className="underline">Start Course</p>
          </Button>
        </p>
      </CardFooter>
    </Card>
  );
};

export default ExampleCard;
