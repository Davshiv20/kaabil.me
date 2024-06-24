import React, { useEffect, useRef, useState } from "react";
import { Button } from "../ui/button";
import ReactGA from "react-ga4";
import Lottie from "lottie-react";
import loader from "../../assets/loader.json";
import { MathJax, MathJaxContext } from "better-react-mathjax";
import MathInput from "react-math-keyboard";

function GPTCard({ questionId, initialPrompt }) {
  const [IsButtonDisabled, setIsButtonDisabled] = useState(false);
  const [messageCount, setMessageCount] = useState(0); // Track the number of messages sent
  const [standardInput, setStandardInput] = useState("");
  const [input, setInput] = useState("");
  const [helpText, setHelpText] = useState([]);
  const [loading, setLoading] = useState(true); // General loading state
  const [initialLoading, setInitialLoading] = useState(false); // Specific state for initial loading
  const [latexInput, setLatexInput] = useState("");
  const [currentInteractionIndex, setCurrentInteractionIndex] = useState(-1);
  const [useMathKeyboard, setUseMathKeyboard] = useState(false);
  // const [isInitialCalled, setIsInitialCalled] = useState(false);

  const endOfMessagesRef = useRef(null);
  const mf = useRef(null);

  useEffect(() => {
    if (initialPrompt) {
      fetchHelp(initialPrompt, -1, true);
    }
  }, [initialPrompt]);

  useEffect(() => {
    const loadData = async () => {
      const storedData = localStorage.getItem(
        `interactionHistory-${questionId}`
      );
      if (storedData) {
        const history = JSON.parse(storedData);
        console.log("Loaded History:", history);
        //   if (history.length > 0 && helpText.length === 0) {
        console.log("Loaded History second time:", history);
        setHelpText(history);
        setCurrentInteractionIndex(history.length - 1);
        setMessageCount(history.length);
      }
    };

    loadData();
  }, [questionId]); // Ensure this only runs when `questionId` changes

  // Save interaction history to local storage
  useEffect(() => {
    // Only save to localStorage if there's meaningful data
    if (
      helpText.length > 0 &&
      !helpText.every((item) => Object.keys(item).length === 0)
    ) {
      console.log("Saving to Local Storage", helpText);
      localStorage.setItem(
        `interactionHistory-${questionId}`,
        JSON.stringify(helpText)
      );
    }
  }, [helpText, questionId]);
  useEffect(() => {
    if (endOfMessagesRef.current) {
      endOfMessagesRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [helpText]);

  const fetchHelp = async (userMessage, index, isInitial = false) => {
    setIsButtonDisabled(true);

    if (isInitial) {
      setInitialLoading(true); // Start initial loading
    } else {
      setLoading((prev) => ({ ...prev, [index]: true })); // Set loading true for the specific index
    }

    const saveInteraction = async (interactionData) => {
      try {
        const url = `http://localhost:3000/api/messages/${questionId}`;
        // const url=`https://www.kaabil.me/api/messages/${questionId}`

        console.log("uri =", url);
        const response = await fetch(url, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(interactionData),
          credentials: "include",
        });
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const responseData = await response.json();
        console.log("Interaction saved:", responseData);
      } catch (error) {
        console.error("Failed to save interaction:", error);
      }
    };

    try {
      //uncomment for local
      const response = await fetch("http://localhost:3000/api/openai", {
        // for production
        // const response = await fetch("https://www.kaabil.me/api/openai", {
        // https://www.kaabil.me/
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userInput: userMessage || "hint",
          //   sessionMessages: isInitial ? [] : helpText,
          sessionMessages: isInitial ? [] : helpText,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        const messagesToSet = data.updatedMessages.map((message, index) => ({
          ...message,
          visible: index > 1,
        }));
        if (JSON.stringify(messagesToSet) !== JSON.stringify(helpText)) {
          setHelpText(messagesToSet);
          setMessageCount((prev) => prev + 1);
          setCurrentInteractionIndex(messagesToSet.length - 1);
          saveInteraction({
            questionIndex: currentInteractionIndex,
            chats: messagesToSet,
            userInput: userMessage,
          });
          saveInteraction({
            questionIndex: currentInteractionIndex,
            chats: messagesToSet,
            userInput: userMessage,
          });
        }
      } else {
        throw new Error("Failed to fetch help");
      }
    } catch (error) {
      console.error("Error fetching help:", error);
      setHelpText((prev) => [
        ...prev,
        {
          role: "system",
          content: "Failed to fetch help, please try again later.",
          visible: true,
        },
      ]);
      setCurrentInteractionIndex(helpText.length);
    } finally {
      if (isInitial) {
        setInitialLoading(false); // Turn off initial loading
      }
      setIsButtonDisabled(false); // Re-enable the button regardless of request success or failure
      // Re-enable the button regardless of request success or failure
      setLoading((prev) => ({ ...prev, [index]: false })); // Turn off loading for the specific index
    }
  };

  const toggleMathKeyboard = () => setUseMathKeyboard(!useMathKeyboard);

  return (
    <MathJaxContext
      version={3}
      config={{
        loader: { load: ["input/tex", "output/svg", "ui/menu", "[tex]/html"] },
        tex: { packages: { "[+]": ["html"] } },
      }}
    >
      {initialLoading && (
        <Lottie
          animationData={loader}
          loop={true}
          style={{ height: 150, width: 150 }}
        />
      )}

      <div className="flex flex-col w-full mb-4 justify-start">
        {helpText.map(
          (ht, index) =>
            ht.visible && (
              <div
                key={index}
                className={`flex flex-col p-4 border rounded-md bg-slate-200 shadow ${
                  index === currentInteractionIndex ? "mb-0" : "mb-4"
                }`}
              >
                <MathJax className="overflow-hidden">
                  <p
                    className={`text-left p-4 ${
                      ht.role === "system"
                        ? "font-bold"
                        : "text-slate-600 bg-slate-200 rounded-xl"
                    }`}
                  >
                    {ht.content}
                  </p>
                </MathJax>

                {index === currentInteractionIndex && (
                  <div className="transition-transform duration-500">
                    {useMathKeyboard ? (
                      <MathInput
                        setValue={setLatexInput}
                        setMathfieldRef={(mathfield) =>
                          (mf.current = mathfield)
                        }
                        placeholder="Type your response..."
                      />
                    ) : (
                      messageCount<12 &&
                      <input
                        type="text"
                        value={latexInput}
                        onChange={(e) => setLatexInput(e.target.value)}
                        placeholder="Type your response..."
                        style={{
                          width: "100%", // Makes the input field take the full width of its container
                          padding: "10px", // Adds more padding inside the input field
                          fontSize: "16px", // Increases the font size for better readability
                        }}
                       
                      />
                     
                    )}

                    <Button
                      type="button"
                      className="mt-4 m-2 rounded-full"
                      onClick={() => {
                        ReactGA.event({
                          category: "User",
                          action: "Clicked a button",
                        });

                        // Check if using Math Keyboard and mf.current is initialized
                        if (useMathKeyboard && mf.current) {
                          console.log(
                            "Current LaTeX value:",
                            mf.current.latex()
                          );
                          fetchHelp(mf.current.latex(), index); // Use LaTeX input if Math Keyboard is active
                        } else {
                          console.log("Current input value:", latexInput);
                          fetchHelp(latexInput, index); // Use regular input if standard keyboard is used
                        }
                        setLatexInput("");
                      }}
                      disabled={IsButtonDisabled || messageCount >= 12}
                    >
                      Submit
                    </Button>

                    <Button
                      type="button"
                      className="mt-4 m-2 bg-bluebg hover:bg-blue-800 hover:text-white rounded-full"
                      onClick={toggleMathKeyboard}
                    >
                      {useMathKeyboard
                        ? "Use Standard Keyboard"
                        : "Use Math Keyboard"}
                    </Button>
                    {loading[index] && (
                      <div className="flex justify-center items-center h-full w-full">
                        <Lottie
                          animationData={loader}
                          loop={true}
                          style={{ height: 150, width: 150 }}
                          className="flex justify-center"
                        />
                      </div>
                    )}
                     {messageCount > 11 && (
                        <div className="text-red-500 text-center font-bold mt-2">
                          You have reached the limit of `{messageCount}` questions.
                        </div>
                      )}
                    
                  </div>
                )}
              </div>
            )
        )}
        <div ref={endOfMessagesRef} />
      </div>
    </MathJaxContext>
  );
}

export default GPTCard;
