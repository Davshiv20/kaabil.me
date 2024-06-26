import React, { useEffect, useState } from "react";
import { Button } from "../ui/button";
import { MathJax, MathJaxContext } from "better-react-mathjax";

const QuestionCard = ({
  isCollapsed,
  setIsCollapse,
  isCorrect,
  id,
  questionType,
  question,
  options,
  attempts,
  userInput,
  setUserInput,
  incorrectOptions,
  handleCheckAnswer,
  answer,
}) => {
  const handleNumericalInput = (input) => {
    setUserInput(input);
  };
  

  // const cardClass = isCollapsed ? "max-h-20 overflow-hidden" : "max-h-full";
  // const toggleText = isCollapsed ? 'Expand' : 'Collapse';

  const specificIds = [258, 259, 260];

  const submitNumericalAnswer = (e) => {
    e.stopPropagation();
    // Assuming the correct answer is in the 'answer' prop
    if (userInput === answer) {
      alert("Correct answer!");
      //  setIsCorrect(true);
      // Possibly update the interaction history or other state to reflect the correct answer
    } else {
      alert("Incorrect, try again!");
      handleCheckAnswer(userInput);
      // You can adjust handleCheckAnswer to handle this scenario
    }

  };
  
  useEffect(() => {
    async function typesetMath() {
      if (window.MathJax) {
        await window.MathJax.typesetPromise().catch((error) =>
          console.error("MathJax typesetting failed:", error)
        );
      }
    }
    typesetMath();
  }, [question, options, userInput]);
  const cardBackground =
    isCorrect === true
      ? "bg-green-300"
      : isCorrect === false
      ? "bg-red-300"
      : "bg-slate-200";
  const hoverClass = "hover:bg-opacity-75";

  return (
    <MathJaxContext
      version={3}
      config={{
        loader: { load: ["input/tex", "output/svg"] },
        tex: {
          inlineMath: [
            ["$", "$"],
            ["\\(", "\\)"],
          ],
        },
      }}
    >
      {isCollapsed ? (
        <Button
          className={`w-full ${hoverClass} ${cardBackground} rounded-md py-4 text-center font-bold`}
          onClick={() => setIsCollapse(prev => !prev)}
        >
          Click to Expand the Question
        </Button>
      ) : (
        <div
          className={` flex flex-col ${cardBackground} rounded-md justify-start transition-all duration-300 ease-in-out `}
        >
          <div className="px-6 py-4 flex flex-col">
            <MathJax>
              <h1 className="py-4 font-bold">{`Q. ${question}`}</h1>
            </MathJax>
            {questionType === "Numerical" ? (
              <div>
                <input
                  type="text"
                  value={userInput}
                  onChange={(e) => {
                    e.stopPropagation();
                    handleNumericalInput(e.target.value);
                  }}
                  className="border rounded p-2 text-lg w-full"
                  placeholder="Enter your answer"
                />
                <Button
                  onClick={submitNumericalAnswer}
                  className="mt-4 h-10 w-28 rounded-full"
                  disabled={attempts >= 1}
                >
                  Check Now
                </Button>
              </div>
            ) : options ? (
              options.map((option, key) => (
                <label
                  key={key}
                  className={`text-lg mb-2 flex hover:bg-slate-300 rounded-xl p-1 items-center ${incorrectOptions.includes(key.toString()) ? "line-through text-red-900" : ""}`}
                >
                  <input
                    type="radio"
                    name={`option-${id}`}
                    value={key}
                    checked={userInput === key.toString()}
                    onChange={(e) => {
                      e.stopPropagation();
                      setUserInput(key.toString());
                    }}
                    className="mr-2 form-radio"
                  />
                  {specificIds.includes(id) ? (
                    <MathJax inline>{`$${option}$`}</MathJax>
                  ) : (
                    <MathJax>{option}</MathJax>
                  )}
                </label>
              ))
            ) : (
              <div>
                <input
                  type="text"
                  value={userInput}
                  onChange={(e) => {
                    e.stopPropagation();
                    handleNumericalInput(e.target.value);
                  }}
                  className="border rounded p-2 text-lg w-full"
                  placeholder="Enter your answer"
                />
                {/* <Button onClick={submitNumericalAnswer} className="mt-4 h-10 w-28 rounded-full">
                                Submit Answer
                            </Button> */}
              </div>
            )}
            {questionType !== "Numerical" && (
              <div>
                {attempts>=2?(
                  <p className="font-bold bg-red-500 p-2 rounded-md">You have reached the maximum attempt limit.</p>
                ):(
              <Button
                onClick={(e) => {
                  e.stopPropagation();
                  handleCheckAnswer(id, userInput);
                }}
                className="mt-4 h-10 w-28 rounded-full"
                disabled={attempts >= 2 }
              >
                Check Now
              </Button>
              )}
              </div>
            )}
            {/* <div className="text-lg font-bold mt-2">
  {userInput && `User has selected option: ${options[userInput]}`}
</div> */}
          </div>
        </div>
      )}
    </MathJaxContext>
  );
};

export default QuestionCard;
