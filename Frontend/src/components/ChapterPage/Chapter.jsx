import React, { useState, useEffect, useCallback, useRef } from "react";
import Navbar from "../Dashboard/Navbar";
import QuestionCard from "./QuestionCard";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "../ui/button";
import back from "../../assets/back.png";
import { FaExpand, FaCompress } from "react-icons/fa"; // Import icons for fullscreen toggle
import GPTCard from "./gptCard";
import ReactGA from "react-ga4";

// import debounce from 'lodash/debounce';

const Chapter = ({ user }) => {
  const [attempts, setAttempts] = useState({});
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [currentActiveInteractionId, setCurrentActiveInteractionId] =useState(null);
  const [secondAttemptInput, setSecondAttemptInput] = useState({});
  const [questions, setQuestions] = useState([]);
  const [userToggled, setUserToggled] = useState(false);
  const [incorrectOptions, setIncorrectOptions] = useState({});
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userInputs, setUserInputs] = useState({});
  const [interactionHistory, setInteractionHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentActiveInteraction, setCurrentActiveInteraction] = useState([]);
  const [isCorrect, setIsCorrect] = useState({});
  const location = useLocation();
  const lastScrollY = useRef(window.scrollY);

  const { subject, courseId, lessonId, fullscreen } = location.state; // Assuming subject is passed in route state
  console.log("Subject:", subject);
  // const lessonId=1;
  console.log("Lesson ID:", lessonId);

  // const [isCurrentQuestionCorrect, setIsCurrentQuestionCorrect] = useState(false);

  useEffect(() => {
    ReactGA.send({ hitType: "pageview", page: window.location.pathname });
  }, []);

  const navigate = useNavigate();
  const handleGoBack = () => {
    navigate(-1);
  };
  useEffect(() => {
    setIsCollapsed(false); // Ensure card is expanded when changing questions
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
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [userToggled]);
  console.log("Collapsed:", isCollapsed, "User Toggled:", userToggled);

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
    const storedIncorrect = localStorage.getItem("incorrectOptions");
    if (storedIncorrect) {
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
  // Save to local storage on state changes
  useEffect(() => {
    if (Object.keys(userInputs).length > 0 && interactionHistory.length > 0) {
      localStorage.setItem(
        `currentQuestionIndex-${lessonId}`,
        JSON.stringify(currentQuestionIndex)
      );
      localStorage.setItem(
        "incorrectOptions",
        JSON.stringify(incorrectOptions)
      );
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
  }, [
    currentQuestionIndex,
    userInputs,
    incorrectOptions,
    isCorrect,
    interactionHistory,
    attempts,
  ]);

  const handleCheckAnswer = useCallback(
    (id, userInput) => {
      if (!userInput) {
        alert(
          "Please select an option before talking to the interactive assistant"
        );
        return;
      }

      // Update attempts
      setAttempts((prev) => ({
        ...prev,
        [id]: (prev[id] || 0) + 1,
      }));

      const inputToOption = ["A", "B", "C", "D"];
      const userAnswer = inputToOption[userInput];
      const question = questions.find((q) => q.id === id);

      // Ensure userInputs[id] is always an array
      setUserInputs((prev) => ({
        ...prev,
        [id]: [...(prev[id] || []), userInput],
      }));

      if (userAnswer.toLowerCase() === question.answer.toLowerCase()) {
        //  alert("Correct answer!");
        setIsCorrect((prev) => ({ ...prev, [id]: true }));
        setIncorrectOptions((prev) => ({ ...prev,  [id]: []  }));
        setInteractionHistory((prev) =>
          prev.filter((interaction) => interaction.questionId !== id)
        );
      } else {
        setIsCorrect((prev) => ({ ...prev, [id]: false }));
        setIncorrectOptions((prev) => ({
          ...prev,
          [id]: [...(prev[id] || []), userInput],
        }));

        const currentAttempts = attempts[id] || 0;
        const allUserInputs = Array.isArray(userInputs[id])
          ? userInputs[id]
          : [];

        // Dynamic prompt generation
        let prompt;
        if (currentAttempts === 0) {
          // If it's the first attempt, use a specific prompt
          prompt = `Help the student solve the question step by step. Do not reveal the answer directly at any cost. Here's the question: '${question.question}', here are the options: ${question.options}. The correct answer was: '${question.answer}'. The user selected the input ${userAnswer}. Please try again, and let's solve it step by step.`;
        } else if (currentAttempts === 1) {
          // For the second attempt, use the new input if available
          const secondInput = secondAttemptInput[id];
          const secondAnswer =
            secondInput !== undefined ? inputToOption[secondInput] : null;
          prompt = `The user's second attemp was incorrect. They selected ${userAnswer}. ${
            secondAnswer
              ? `For their second attempt, they selected ${secondAnswer}.`
              : ""
          } Here's the question again: '${question.question}', with options: ${
            question.options
          }. Let's continue to solve it step by step, focusing on why their selection(s) might be incorrect.`;
        } else {
          prompt =
            allUserInputs
              .map(
                (input, index) =>
                  `Attempt ${index + 1}: You selected ${inputToOption[input]}`
              )
              .join("\n") +
            `\nHere's the question again: '${question.question}', with options: ${question.options}. Please try again!`;
        }
        console.log("prompt", prompt);
        const existingIndex = interactionHistory.findIndex(
          (interaction) => interaction.questionId === id
        );
        if (existingIndex !== -1) {
          setInteractionHistory((prev) =>
            prev.map((interaction, index) => {
              if (index === existingIndex) {
                return { ...interaction, initialPrompt: prompt };
              }
              return interaction;
            })
          );
        } else {
          setInteractionHistory((prev) => [
            ...prev,
            { questionId: id, initialPrompt: prompt },
          ]);
        }
      }
    },
    [questions, attempts, interactionHistory, userInputs]
  );

  const handleNext = useCallback(() => {
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
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    } else {
      alert("You are at the first question.");
    }
  }, [currentQuestionIndex]);
  const handleFullscreenToggle = () => {
    if (!document.fullscreenElement) {
      document.documentElement
        .requestFullscreen()
        .then(() => setIsFullscreen(true))
        .catch((err) =>
          console.error(
            `Error attempting to enable full-screen mode: ${err.message} (${err.name})`
          )
        );
    } else {
      document
        .exitFullscreen()
        .then(() => setIsFullscreen(false))
        .catch((err) =>
          console.error(
            `Error attempting to exit full-screen mode: ${err.message} (${err.name})`
          )
        );
    }
  };

  const handleFullscreenChange = () => {
    setIsFullscreen(!!document.fullscreenElement);
  };

  // const [isCurrentQuestionCorrect, setIsCurrentQuestionCorrect] = useState(false);

  useEffect(() => {
    if (fullscreen) {
      handleFullscreenToggle();
    }

    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
    };
  }, [fullscreen]);

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div>
      <div className="flex flex-col min-h-screen w-full text-black bg-slate-100">
        <div className="flex flex-col mt-28 w-full md:w-3/4 md:mx-auto lg:mx-auto">
          <div className="px-2 flex flex-row justify-between space-between">
            <Button
              variant="ghost"
              className="bg-slate-200"
              onClick={handleGoBack}
            >
              Lesson-{lessonId}
            </Button>
            <Button
              variant="ghost"
              className="bg-slate-200"
              onClick={handleFullscreenToggle}
            >
              {isFullscreen ? <FaCompress /> : <FaExpand />}
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
                  incorrectOptions={
                    incorrectOptions[questions[currentQuestionIndex].id] || []
                  }
                  questionType={questions[currentQuestionIndex].question_type}
                  question={questions[currentQuestionIndex].question}
                  options={questions[currentQuestionIndex].options}
                  attempts={attempts[questions[currentQuestionIndex].id] || 0}
                  userInput={
                    userInputs[questions[currentQuestionIndex].id] || ""
                  }
                  setUserInput={(input) => {
                    const currentId = questions[currentQuestionIndex].id;
                    const currentAttempts = attempts[currentId] || 0;
                    if (currentAttempts === 1) {
                      setSecondAttemptInput({
                        ...secondAttemptInput,
                        [currentId]: input,
                      });
                    } else {
                      setUserInputs({
                        ...userInputs,
                        [currentId]: input,
                      });
                    }
                  }}
                  handleCheckAnswer={
                    () =>
                    handleCheckAnswer(
                      questions[currentQuestionIndex].id,
                      attempts[questions[currentQuestionIndex].id] === 1
                        ? secondAttemptInput[questions[currentQuestionIndex].id]
                        : userInputs[questions[currentQuestionIndex].id] || ""
                    )
                  }
                />
              </div>
            )}
            <div className="flex flex-col items-center">
              {interactionHistory
                .filter(
                  (interaction) =>
                    interaction.questionId ===
                    questions[currentQuestionIndex].id
                )
                .map((interaction) => (
                  <GPTCard
                    key={`gpt-${interaction.questionId}`}
                    questionId={interaction.questionId}
                    initialPrompt={interaction.initialPrompt}
                    userAnswer={interaction.userAnswer} // Pass the userAnswer here
                    isCurrentInteraction={
                      currentActiveInteractionId === interaction.questionId
                    }
                    attempts={attempts[interaction.questionId] || 0} // Pass the attempts for the specific question
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
        {!isFullscreen && <Navbar user={user} />}
      </div>
    </div>
  );
};

export default Chapter;
