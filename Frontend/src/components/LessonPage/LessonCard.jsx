import React from 'react';
import ReactGA from 'react-ga4';
import cover from '../../assets/Dashboard/courseCover.png';
import trigoCover from '../../assets/trigoImg.jpg'
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import PublicSharpIcon from '@mui/icons-material/PublicSharp';
import TimelineSharpIcon from '@mui/icons-material/TimelineSharp';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import { Progress } from "@/components/ui/progress"
import {Button} from '../ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';


const LessonCard = ({
  courseId,
  levels,
  title = 'UPSC Exam- Complete',
  description = 'The Union Public Service Commission (UPSC) conducts the Civil Services Examination (CSE) in India, which is one of the most prestigious and challenging exams in the country. The Prelims test basic knowledge and aptitude, while the Mains assess in-depth knowledge through descriptive papers in various subjects. The final interview evaluates the candidate\'s personality and suitability for a career in public service. Extensive preparation and a thorough understanding of a wide range of subjects are essential for success in the UPSC CSE.',
  duration = '40 minutes',
  language = 'English',
  xp = '200 XP',
  level = 'Beginner',
  onClickStartChapter
}) => {
  const coverImg = courseId === 1 ? trigoCover : cover;
  const handleStartNow = () => {
    console.log('Levels:', levels); // This will show what levels contains
    ReactGA.event({
      category: 'User',
      action: 'Clicked a button'
    });
    console.log(courseId);
   
    const startLevel = levels.find(l => l.isActive) || levels[0];
    onClickStartChapter(startLevel.number);
  };
  console.log(levels.number);
  return (
    <Card className="flex flex-col md:flex-row w-full bg-slate-200 border border-gray-200 rounded-2xl shadow dark:bg-gray-800 dark:border-gray-700">
      <div className="md:flex-1 p-5 flex flex-col justify-between">
        <CardHeader className="mb-2">
          <CardTitle className="text-3xl md:text-4xl font-bold tracking-tight text-gray-900 dark:text-white">
            {title}
           
          </CardTitle>
        </CardHeader>
        <CardDescription className="flex-grow mb-4 text-gray-700 dark:text-gray-400 overflow-auto">
          <p>{description}</p>
        </CardDescription>
        <div className="flex md:flex-row mb-4 text-sm">
          <div className="flex flex-col mr-8 mb-8">
            <p className="flex items-center hover:text-blue-900 duration-500">
              <AccessTimeIcon fontSize="small" className="m-2" />{duration}
            </p>
            <p className="flex items-center hover:text-blue-900 duration-500">
              <PublicSharpIcon fontSize='small' className='m-2'/>{language}
            </p>
          </div>
          <div className="flex flex-col">
            <p className="flex items-center hover:text-blue-900 duration-500">
              <TimelineSharpIcon fontSize='small' className='m-2'/>{xp}
            </p>
            <p className="flex items-center hover:text-blue-900 duration-500">
              <PlayArrowIcon fontSize='small' className='m-2'/>{level}
            </p>
          </div>
        </div>
        <CardFooter className="flex flex-col ">
       {/*<Progress value={50} className="mb-4"/>*/} 

          <Button onClick={handleStartNow} className="rounded-full md:mb-8 ">
            <p className='p-4s'>Start Now</p>
          </Button>
          
        </CardFooter>
      </div>
      <div className="md:flex-1 p-5">
        <img src={coverImg} className="rounded-xl " alt="Course Cover" />
      </div>
    </Card>
  );
};

export default LessonCard;
