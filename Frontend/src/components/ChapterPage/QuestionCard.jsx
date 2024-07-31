



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
  const [isQuestionCorrect, setIsQuestionCorrect] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const handleNumericalInput = (input) => {
    setUserInput(input);
    setSelectedOption(input);
  };

  // Helper function to clean LaTeX strings
  const cleanLatex = (str) => {
    return str.replace(/\\\\/g, '\\').replace(/\\$/g, '');
  };

  const submitAnswer = (e) => {
    e.stopPropagation();
    if (["Numerical", "Integer type question", "Integer Answer Type Question"].includes(questionType)) {
      if (selectedOption === answer) {
        setIsQuestionCorrect(true);
      } else {
        setIsQuestionCorrect(false);
        handleCheckAnswer(selectedOption);
      }
    } else {
      handleCheckAnswer(id, selectedOption);
    }
  };

  const truncateText = (text, maxLength = 100) => {
    const end = text.indexOf('\n');
    if (end !== -1 && end <= maxLength) {
      return text.substring(0, end) + '...';
    }
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
  };

  const truncatedQuestion = truncateText(question);

  useEffect(() => {
    function typesetMath() {
      if (window.MathJax && window.MathJax.typesetPromise) {
        setIsLoading(true);
        window.MathJax.typesetPromise().then(() => {
          setIsLoading(false);
        }).catch(error => {
          console.error("MathJax typesetting failed:", error);
          setIsLoading(false);
        });
      } else {
        setTimeout(typesetMath, 300);
      }
    }

    typesetMath();
  }, [question, options, userInput]);

  const cardBackground = isQuestionCorrect || isCorrect
    ? "bg-green-300" 
    : isQuestionCorrect === false || isCorrect === false
    ? "bg-red-300" 
    : "bg-slate-200";

  useEffect(() => {
    const savedOption = localStorage.getItem(`selectedOption-${id}`);
    if (savedOption) {
      setSelectedOption(savedOption);
    }
  }, [id]);

  const handleOptionChange = (key) => {
    setSelectedOption(key.toString());
    setUserInput(key.toString());
    localStorage.setItem(`selectedOption-${id}`, key.toString());
  };

  const renderQuestionInput = () => {
    if (["Numerical", "Integer type question", "Integer Answer Type Question"].includes(questionType)) {
      return (
        <div>
          <input
            type="number"
            value={selectedOption}
            onChange={(e) => {
              e.stopPropagation();
              handleNumericalInput(e.target.value);
            }}
            className="border rounded p-2 text-lg w-full"
            placeholder="Enter your answer"
            disabled={isQuestionCorrect || attempts >= 2}
          />
          <Button
            onClick={submitAnswer}
            className="mt-4 h-10 w-28 rounded-full"
            disabled={isQuestionCorrect || attempts >= 2 || !selectedOption}
          >
            Check Now
          </Button>
        </div>
      );
    } else if (options && options.length > 0) {
      return options.map((option, key) => (
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
          <MathJax inline>
            {cleanLatex(option)}
          </MathJax>
        </label>
      ));
    }
    return null;
  };

  return (
    <MathJaxContext
      version={3}
      config={{
        loader: { load: ["input/tex", "output/svg"] },
        tex: {
          packages: { '[+]': ['noerrors'] },
          inlineMath: [
            ["$", "$"],
            ["\\(", "\\)"],
          ],
          displayMath: [["$$", "$$"]],
        },
      }}
    >
      {isLoading ? (
        <div className="text-center my-2">Loading the question...</div>
      ) : (
        <>
          {isCollapsed ? (
            <Button
              className={`w-full hover:bg-slate-300 ${cardBackground} rounded-md py-4 text-center font-bold`}
              onClick={() => setIsCollapse(prev => !prev)}
            >
              Click to see Question
            </Button>
          ) : (
            <div
              className={`flex flex-col ${cardBackground} rounded-md justify-start transition-all duration-300 ease-in-out`}
            >
              <div className="px-6 py-4 flex flex-col">
                <MathJax>
                  <h1 className="py-4 font-bold">{`Q. ${cleanLatex(question)}`}</h1>
                </MathJax>
                {renderQuestionInput()}
                {questionType !== "Numerical" && questionType !== "Integer type question" && questionType !== "Integer Answer Type Question" && (
                  <div>
                    {attempts >= 2 ? (
                      <p className="font-bold bg-red-500 p-2 rounded-md">You have reached the maximum attempt limit.</p>
                    ) : (
                      <Button
                        onClick={submitAnswer}
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
        </>
      )}
    </MathJaxContext>
  );
};

export default QuestionCard;




















/*
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
  const [isQuestionCorrect, setIsQuestionCorrect] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const handleNumericalInput = (input) => {
    setUserInput(input);
    setSelectedOption(input);
  };

  const specificIds = [258, 259, 260];

  const submitAnswer = (e) => {
    e.stopPropagation();
    if (["Numerical", "Integer type question", "Integer Answer Type Question"].includes(questionType)) {
      if (selectedOption === answer) {
        setIsQuestionCorrect(true);
      } else {
        setIsQuestionCorrect(false);
        handleCheckAnswer(selectedOption);
      }
    } else {
      handleCheckAnswer(id, selectedOption);
    }
  };

  const truncateText = (text, maxLength = 100) => {
    const end = text.indexOf('\n');
    if (end !== -1 && end <= maxLength) {
      return text.substring(0, end) + '...';
    }
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
  };

  const truncatedQuestion = truncateText(question);

  useEffect(() => {
    function typesetMath() {
      if (window.MathJax && window.MathJax.typesetPromise) {
        setIsLoading(true);
        window.MathJax.typesetPromise().then(() => {
          setIsLoading(false);
        }).catch(error => {
          console.error("MathJax typesetting failed:", error);
          setIsLoading(false);
        });
      } else {
        setTimeout(typesetMath, 300);
      }
    }

    typesetMath();
  }, [question, options, userInput]);

  const cardBackground = isQuestionCorrect || isCorrect
    ? "bg-green-300" 
    : isQuestionCorrect === false || isCorrect === false
    ? "bg-red-300" 
    : "bg-slate-200";

  useEffect(() => {
    const savedOption = localStorage.getItem(`selectedOption-${id}`);
    if (savedOption) {
      setSelectedOption(savedOption);
    }
  }, [id]);

  const handleOptionChange = (key) => {
    setSelectedOption(key.toString());
    setUserInput(key.toString());
    localStorage.setItem(`selectedOption-${id}`, key.toString());
  };

  const renderQuestionInput = () => {
    if (["Numerical", "Integer type question", "Integer Answer Type Question"].includes(questionType)) {
      return (
        <div>
          <input
            type="number"
            value={selectedOption}
            onChange={(e) => {
              e.stopPropagation();
              handleNumericalInput(e.target.value);
            }}
            className="border rounded p-2 text-lg w-full"
            placeholder="Enter your answer"
            disabled={isQuestionCorrect || attempts >= 2}
          />
          <Button
            onClick={submitAnswer}
            className="mt-4 h-10 w-28 rounded-full"
            disabled={isQuestionCorrect || attempts >= 2 || !selectedOption}
          >
            Check Now
          </Button>
        </div>
      );
    } else if (options && options.length > 0) {
      return options.map((option, key) => (
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
      ));
    }
    return null;
  };

  return (
    <MathJaxContext
      version={3}
      config={{
        loader: { load: ["input/tex", "output/svg"] },
        tex: {
          packages: { '[+]': ['noerrors'] },
          inlineMath: [
            ["$", "$"],
            ["\\(", "\\)"],
          ],
          displayMath: [["$$", "$$"]],
        },
      }}
    >
      {isLoading ? (
        <div className="text-center my-2">Loading the question...</div>
      ) : (
        <>
          {isCollapsed ? (
            <Button
              className={`w-full hover:bg-slate-300 ${cardBackground} rounded-md py-4 text-center font-bold`}
              onClick={() => setIsCollapse(prev => !prev)}
            >
              Click to see Question
            </Button>
          ) : (
            <div
              className={`flex flex-col ${cardBackground} rounded-md justify-start transition-all duration-300 ease-in-out`}
            >
              <div className="px-6 py-4 flex flex-col">
                <MathJax>
                  <h1 className="py-4 font-bold">{`Q. ${question}`}</h1>
                </MathJax>
                {renderQuestionInput()}
                {questionType !== "Numerical" && questionType !== "Integer type question" && questionType !== "Integer Answer Type Question" && (
                  <div>
                    {attempts >= 2 ? (
                      <p className="font-bold bg-red-500 p-2 rounded-md">You have reached the maximum attempt limit.</p>
                    ) : (
                      <Button
                        onClick={submitAnswer}
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
        </>
      )}
    </MathJaxContext>
  );
};

export default QuestionCard;

*/
















