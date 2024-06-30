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
  const [selectedOption, setSelectedOption] = useState(userInput);

  // useEffect(() => {
  //   setSelectedOption(userInput);
  // }, [userInput]);

  const handleNumericalInput = (input) => {
    setUserInput(input);
    setSelectedOption(input);
  };

  const specificIds = [258, 259, 260];

  const submitNumericalAnswer = (e) => {
    e.stopPropagation();
    if (selectedOption === answer) {
      alert("Correct answer!");
    } else {
      handleCheckAnswer(selectedOption);
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

  useEffect(() => {
    const savedOption = localStorage.getItem(`selectedOption-${id}`);
    if (savedOption) {
      setSelectedOption(savedOption);
    }
  }, [id]);

  // useEffect(() => {
  //   localStorage.setItem(`selectedOption-${id}`, selectedOption); 
  // }, [selectedOption, id]);
  const handleOptionChange = (key) => {
    setSelectedOption(key.toString());
    setUserInput(key.toString());
    localStorage.setItem(`selectedOption-${id}`, key.toString());  // Save to local storage
  };
  

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
          displayMath: [["$$", "$$"]],
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
          className={`flex flex-col ${cardBackground} rounded-md justify-start transition-all duration-300 ease-in-out`}
        >
          <div className="px-6 py-4 flex flex-col">
            <MathJax>
              <h1 className="py-4 font-bold">{`Q. ${question}`}</h1>
            </MathJax>
           
            {questionType === "Numerical" ? (
              <div>
                <input
                  type="text"
                  value={selectedOption}
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
                  className={`text-lg mb-2 flex hover:bg-slate-300 rounded-xl p-1 items-center 
                    ${incorrectOptions.includes(key.toString()) ? "line-through text-blue-900" : ""}
                    ${selectedOption === key.toString() ? "opacity-90 bg-slate-200" : ""}`}
                >
                  <input
                    type="radio"
                    name={`option-${id}`}
                    value={key}
                    checked={selectedOption === key.toString()}
                    onChange={(e) => {
                      e.stopPropagation();
                      handleOptionChange(key)
                    }}
                    className="mr-2 form-radio"
                    disabled={isCorrect || attempts >= 2}
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
                  value={selectedOption}
                  onChange={(e) => {
                    e.stopPropagation();
                    handleNumericalInput(e.target.value);
                  }}
                  className="border rounded p-2 text-lg w-full"
                  placeholder="Enter your answer"
                />
                <Button onClick={submitNumericalAnswer} className="mt-4 h-10 w-28 rounded-full">
                  Submit Answer
                </Button>
              </div>
            )}
            {questionType !== "Numerical" && (
              <div>
                {attempts >= 2 ? (
                  <p className="font-bold bg-red-500 p-2 rounded-md">You have reached the maximum attempt limit.</p>
                ) : (
                  <Button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleCheckAnswer(id, selectedOption);
                    }}
                    className="mt-4 h-10 w-28 rounded-full"
                    disabled={attempts >= 2 || !selectedOption}
                  >
                    Check Now
                  </Button>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </MathJaxContext>
  );
};

export default QuestionCard;  