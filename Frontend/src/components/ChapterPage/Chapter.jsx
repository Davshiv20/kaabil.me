import React, { useState, useEffect, useCallback, useRef } from "react";
//import React, { useState, useEffect, useCallback, useRef } from "react";
import Navbar from "../Dashboard/Navbar";
import QuestionCard from "./QuestionCard";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "../ui/button";
import back from "../../assets/back.png";
import GPTCard from "./gptCard";
import ReactGA from 'react-ga4';


 // const Chapter = ({ user, interactionHistory, currentQuestionIndex, setUserInputs , userInputs, setInteractionHistory, setCurrentQuestionIndex }) => {
 const Chapter = ({ user }) => {


  useEffect(() => {
    ReactGA.send({ hitType: "pageview", page: window.location.pathname });
  }, []);
  const [attempts, setAttempts] = useState({});
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [questions, setQuestions] = useState([]);
  const [userToggled, setUserToggled] = useState(false);
  const [incorrectOptions, setIncorrectOptions] = useState({});
//  const [questions, setQuestions] = useState([]);
   const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userInputs, setUserInputs] = useState({});
    const [interactionHistory, setInteractionHistory] = useState([]);
 // const [chatHistory, setChatHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isCorrect, setIsCorrect] = useState({});
  const location = useLocation();
  const lastScrollY = useRef(window.scrollY);

  const { subject, courseId, lessonId } = location.state; // Assuming subject is passed in route state
  console.log("Subject:", subject);
  // const lessonId=1;
  console.log("Lesson ID:", lessonId);
  // const [isCurrentQuestionCorrect, setIsCurrentQuestionCorrect] = useState(false);

  const navigate = useNavigate();
  const handleGoBack = () => {
    ReactGA.event({
      category: 'User',
      action: 'Clicked a button'
    });
    navigate(-1);
  };

  /*
  const location = useLocation();
  const { subject, courseId, lessonId } = location.state; // Assuming subject is passed in route state
  console.log("Subject:", subject);
  // const lessonId=1;
  console.log("Lesson ID:", lessonId);
*/










useEffect(() => {
  setIsCollapsed(false);  // Ensure card is expanded when changing questions
}, [currentQuestionIndex]);

const toggleCollapse = (e) => {
  // Prevents the event from bubbling up from child elements
   e.stopPropagation();
  if (e.target === e.currentTarget) {
    // This is technically only necessary if there are other potential parent handlers
    setIsCollapsed((prev) => !prev);

          
  }
  setUserToggled(true);
  setTimeout(() => {
    setUserToggled(false); // Reset after a certain time if needed, or handle this reset elsewhere
  }, 1000);
};


  const handleScroll = () => {
    const currentScrollY = window.scrollY;
    if (
      !userToggled &&
      currentScrollY > lastScrollY.current &&
      currentScrollY > 75
    ) {
      // Only collapse if scrolled more than 300px from the top
   
        setIsCollapsed(true);
      
    }
    // else{
    //   setIsCollapsed(false);
    // }
    lastScrollY.current = currentScrollY; // Update the last scroll position
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
}, [userToggled]);
console.log("Collapsed:", isCollapsed, "User Toggled:", userToggled);





  // Fetch questions from the backend
  useEffect(() => {
    const fetchQuestions = async () => {
      setIsLoading(true);
      try {
        //  console.log(`http://localhost:3000/api/lessons/questions/${subject}/${lessonId}`);
        const response = await fetch(
          //uncomment for local dev
          `http://localhost:3000/api/lessons/questions/${subject}/${lessonId}`

          //uncomment for production
          // do not delete
          // `https://www.kaabil.me/api/lessons/questions/${subject}/${lessonId}`
        );
        if (!response.ok) throw new Error("Failed to fetch");
        const data = await response.json();
        console.log("questions =", data)
        setQuestions(data);
        setIsLoading(false);
      } catch (err) {
        setError(err.message);
        setIsLoading(false);
      }
    };

    fetchQuestions();
  }, []);

  
  
  useEffect(() => {
    const storedUserInputs = localStorage.getItem("userInputs");
    const storedHistory = localStorage.getItem("interactionHistory");
    const storedAttempts = localStorage.getItem("attempts");
    const storedIsCorrect = localStorage.getItem("isCorrect");
    const storedIncorrect= localStorage.getItem("incorrectOptions");
    if(storedIncorrect){
      setIncorrectOptions(JSON.parse(storedIncorrect));
    }
    if (storedIsCorrect) {
      setIsCorrect(JSON.parse(storedIsCorrect));
    }

    if (storedAttempts) {
      setAttempts(JSON.parse(storedAttempts));
    }
    //    const storedQuestionIndex = localStorage.getItem('currentQuestionIndex');
   
    
    

  





    const storedIndex = localStorage.getItem(
      `currentQuestionIndex-${lessonId}`
    );
    if (storedUserInputs) {
      setUserInputs(JSON.parse(storedUserInputs));
    }

    if (storedHistory) {
      setInteractionHistory(JSON.parse(storedHistory));
    }
    if (storedIndex) {
      setCurrentQuestionIndex(parseInt(storedIndex, 10));
    } else {
      setCurrentQuestionIndex(0); // Default to the first question if no index is stored
    }
  }, []);

  console.log("CurrentQuestion:", currentQuestionIndex);


console.log("currnt question index = ", currentQuestionIndex)
console.log("question with id =",questions[currentQuestionIndex])



  // Save to local storage on state changes
  //&& interactionHistory.length > 0
  
  useEffect(() => {
    if (Object.keys(userInputs).length > 0 && interactionHistory.length > 0 ) {
      localStorage.setItem(
        `currentQuestionIndex-${lessonId}`,
        JSON.stringify(currentQuestionIndex)
      );
      localStorage.setItem("incorrectOptions",JSON.stringify(incorrectOptions))
      localStorage.setItem("incorrectOptions",JSON.stringify(incorrectOptions))
      localStorage.setItem("userInputs", JSON.stringify(userInputs));
      localStorage.setItem(
        "interactionHistory",
        JSON.stringify(interactionHistory)
      );
      localStorage.setItem(
        "currentQuestionIndex",
        currentQuestionIndex.toString()
      );

      localStorage.setItem("isCorrect", JSON.stringify(isCorrect));

      localStorage.setItem("attempts", JSON.stringify(attempts));
    }
  }, [currentQuestionIndex, userInputs, incorrectOptions,isCorrect,interactionHistory,attempts]);




  const handleCheckAnswer = useCallback(
   
    

    (id, userInput) => {
      console.log("getting clicked again");
      if (!userInput) {
        alert("Please select an option before talking to the interactive assistant");
        alert("Please select an option before talking to the interactive assistant");
        return;
      }


      // Update attempts
      setAttempts(prev => ({
        ...prev,
        [id]: (prev[id] || 0) + 1
      }));


      const inputToOption = ["A", "B", "C", "D"];
      const userAnswer = inputToOption[userInput];

      const question = questions.find(q => q.id === id);
      setUserInputs(prev => ({ ...prev, [id]: userInput }));


    //  const question = questions.find((q) => q.id === id);
      setUserInputs((prev) => ({ ...prev, [id]: userInput }));
      console.log(question.answer);
      console.log("Solution is:", question.options[userInput]);
      if (userAnswer.toLowerCase() === question.answer.toLowerCase()) {
        alert("Correct answer!");
        setIsCorrect(prev => ({ ...prev, [id]: true }));
        setIncorrectOptions(prev => ({ ...prev, [id]: [] }));
        // Remove all interactions related to this question on correct answer
        setInteractionHistory(prev => prev.filter(interaction => interaction.questionId !== id));


        setInteractionHistory((prev) =>
          prev.filter((interaction) => interaction.questionId !== id)
        );
      } else {
        setIsCorrect(prev => ({ ...prev, [id]: false }));
        setIncorrectOptions(prev => ({
       
          ...prev,
          [id]: [...(prev[id] || []), userInput]
        }));
  
        // Determine the appropriate prompt based on attempts
        const currentAttempts = attempts[id] || 0;
        let prompt;
        if (currentAttempts === 0) {
          prompt = `Help the student solve the question step by step. Do not reveal the answer directly at any cost. Here's the question: '${question.question}', here are the options: ${question.options} The correct answer was: '${question.answer}'. The user selected the input ${userInput}. Please try again, and let's solve it step by step.`;
        } else {
          prompt = `Help the student solve the question step by step. Do not reveal the answer directly at any cost. Here's the question: '${question.question}', here are the options: ${question.options} The correct answer was: '${question.answer}'. The user selected the input ${userInput}. Please try again, and let's solve it step by step.`;
        }
  
        
       
  
        // Update or add new interaction
        const existingIndex = interactionHistory.findIndex(interaction => interaction.questionId === id);
        if (existingIndex !== -1) {
          // Update existing interaction
          setInteractionHistory(prev => prev.map((interaction, index) => {
            if (index === existingIndex) {
              return { ...interaction, initialPrompt: prompt };
            }
            return interaction;
          }));
        } else {
          // Add new interaction if none exists
          setInteractionHistory(prev => [
            ...prev,
            { questionId: id, initialPrompt: prompt }
          ]);
        }
      }
    },
    [questions, attempts, interactionHistory]
  //  [questions, attempts, interactionHistory]
  );


  useEffect(() => {
    console.log("Current question index:", currentQuestionIndex);
    console.log("Question with ID:", questions[currentQuestionIndex]);
    console.log("Filtered Interaction History:", interactionHistory.filter(
      (interaction) => interaction.questionId === questions[currentQuestionIndex]?.id
    ));
  }, [currentQuestionIndex, questions, interactionHistory]);
  

  const handleNext = useCallback(() => {
    ReactGA.event({
      category: 'User',
      action: 'Clicked a button'
    });

    const currentInput = userInputs[questions[currentQuestionIndex].id];
    // Explicitly check for undefined or any non-allowed value
    if (currentInput === undefined || currentInput === null) {
      alert(
        "Please answer the current question before moving to the next one."
      );
      return; // Stop the function if there's no answer
    }

    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      // Optional: Handle what happens if it's the last question (e.g., navigate away or show a message)
      alert("You have reached the end of the questions.");
    }
  }, [currentQuestionIndex, questions.length, userInputs]);

  const handleBack = useCallback(() => {

    ReactGA.event({
      category: 'User',
      action: 'Clicked a button'
    });
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    } else {
      alert("You are at the first question.");
    }
  }, [currentQuestionIndex]);

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="flex flex-col min-h-screen w-full text-black bg-slate-100">
      <div className="flex flex-col mt-28 w-full md:w-3/4 md:mx-auto lg:mx-auto">
        <div className="px-2">
          <Button
            variant="ghost"
            className="bg-slate-200"
            onClick={handleGoBack}
          >
            Lesson-{lessonId}
          </Button>
        </div>
        <div className="flex flex-col items-center px-2 py-6">
          {questions[currentQuestionIndex] && (

<div
className={`sticky top-10 transition-height duration-500 ease-in-out ${
  isCollapsed
    ? "h-20 cursor-pointer duration-500 ease-in-out  mb-4 "
    : "h-auto cursor-pointer duration-500 ease-in-out py-2"
} w-full my-1 z-10`}
onClick={toggleCollapse}
>
            <QuestionCard
             isCollapsed={isCollapsed}
             setIsCollapse={setIsCollapsed}
             isCorrect={isCorrect[questions[currentQuestionIndex].id]}
              id={questions[currentQuestionIndex].id}
              answer={questions[currentQuestionIndex].answer}
              key={questions[currentQuestionIndex].id}
              incorrectOptions={incorrectOptions[questions[currentQuestionIndex].id] || []}
              questionType={questions[currentQuestionIndex].question_type}
              question={questions[currentQuestionIndex].question}
              options={questions[currentQuestionIndex].options}
              attempts={attempts[questions[currentQuestionIndex].id] || 0}
              userInput={userInputs[questions[currentQuestionIndex].id] || ""}
              setUserInput={(input) =>
                setUserInputs({
                  ...userInputs,
                  [questions[currentQuestionIndex].id]: input,
                })
              }
              handleCheckAnswer={() =>
                

                handleCheckAnswer(
                  questions[currentQuestionIndex].id,
                  userInputs[questions[currentQuestionIndex].id] || ""
                )
                
              }
            />
             </div>
          )}
          <div className="flex flex-col items-center">
          {interactionHistory
            .filter((interaction) => interaction.questionId === questions[currentQuestionIndex].id)
            .map((interaction, index) => (
            //  console.log("Rendering GPTCard with ID:", interaction.questionId);
           
           <GPTCard
            key={`gpt-${interaction.questionId}-${index}`}  // Unique key using index
            questionId={interaction.questionId}
            initialPrompt={interaction.initialPrompt}
              />
              ))}
          </div>
        </div>
        <div className="flex justify-start pt-2"></div>
        <div className="flex justify-between w-full py-2">
          <Button variant="ghost" onClick={handleGoBack}>
            <img src={back} className="h-[10px] w-[10px] mr-1"></img>
            Back to Lesson
          </Button>
          <div>
            <Button className="mr-2 rounded-full" onClick={handleBack}>
              Back
            </Button>
            <Button className="rounded-full mr-1" onClick={handleNext}>
              Next
            </Button>
          </div>
        </div>
      </div>
      <Navbar user={user} className="" />
    </div>
  );
            };

export default Chapter;
