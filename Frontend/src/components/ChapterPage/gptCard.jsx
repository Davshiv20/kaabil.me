import React, { useEffect, useRef, useState } from "react";
import { Button } from "../ui/button";
import Lottie from "lottie-react";
import loader from "../../assets/loader.json";
import { MathJax, MathJaxContext } from "better-react-mathjax";
import MathInput from "react-math-keyboard";
import { v4 as uuidv4 } from 'uuid';
import { FiPaperclip } from 'react-icons/fi'; // Import paperclip icon from react-icons

function GPTCard({ questionId, initialPrompt }) {
  const [helpText, setHelpText] = useState([]);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(false);
  const [latexInput, setLatexInput] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [currentInteractionIndex, setCurrentInteractionIndex] = useState(-1);
  const [useMathKeyboard, setUseMathKeyboard] = useState(false);
  const [IsButtonDisabled, setIsButtonDisabled] = useState(false);
  const endOfMessagesRef = useRef(null);
  const imagePreviewRef = useRef(null); // Add ref for image preview
  const mf = useRef(null);

  const mathJaxConfig = {
    loader: { load: ["input/tex", "output/svg"] },
    tex: { inlineMath: [["$", "$"], ["\\(", "\\)"]] },
    svg: { fontCache: "global" }
  };

  useEffect(() => {
    if (initialPrompt) {
      fetchHelp(initialPrompt, -1, true);
    }
  }, [initialPrompt]);

  useEffect(() => {
    const loadData = async () => {
      const storedData = localStorage.getItem(`interactionHistory-${questionId}`);
      if (storedData) {
        const history = JSON.parse(storedData);
        if (history.length > 0 && helpText.length === 0) {
          setHelpText(history);
          setCurrentInteractionIndex(history.length - 1);
        }
      }
    };

    loadData();
  }, [questionId, helpText.length]);

  useEffect(() => {
    if (helpText.length > 0 && !helpText.every(item => Object.keys(item).length === 0)) {
      console.log('Saving to Local Storage', helpText);
      localStorage.setItem(`interactionHistory-${questionId}`, JSON.stringify(helpText));
    }
  }, [helpText, questionId]);

  useEffect(() => {
    if (endOfMessagesRef.current) {
      endOfMessagesRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [helpText]);

  const handleImageSelect = (image) => {
    setSelectedImage(image);
    setUploadProgress(0); // Reset upload progress
  };

  const fetchHelp = async (userMessage, index, isInitial = false) => {
    if (isInitial) {
      setInitialLoading(true);
    } else {
      setLoading((prev) => ({ ...prev, [index]: true }));
    }

    const saveInteraction = async (interactionData) => {
      try {
        const url = `http://localhost:3000/api/messages/${questionId}`;
        console.log("url =", url);
        const response = await fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(interactionData),
          credentials: 'include'
        });
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const responseData = await response.json();
        console.log('Interaction saved:', responseData);
      } catch (error) {
        console.error('Failed to save interaction:', error);
      }
    };

    const formData = new FormData();
    formData.append("userInput", userMessage);
    if (selectedImage) {
      formData.append("image", selectedImage);
    }
    formData.append("sessionMessages", JSON.stringify(isInitial ? [] : helpText));

    // Log FormData content
    for (let pair of formData.entries()) {
      console.log(pair[0] + ': ' + pair[1]);
    }

    try {
      const xhr = new XMLHttpRequest();
      xhr.open("POST", "http://localhost:3000/api/azureOpenai", true);

      xhr.upload.onprogress = (event) => {
        if (event.lengthComputable) {
          const percentComplete = (event.loaded / event.total) * 100;
          setUploadProgress(percentComplete);
        }
      };

      xhr.onload = async () => {
        if (xhr.status === 200) {
          const data = JSON.parse(xhr.responseText);
          console.log("Server response:", data);
          const messagesToSet = data.updatedMessages.map((message, index) => ({
            ...message,
            visible: true, // Ensure visibility is set to true
            id: uuidv4(),
          }));

          if (JSON.stringify(messagesToSet) !== JSON.stringify(helpText)) {
            setHelpText(messagesToSet);
            setCurrentInteractionIndex(messagesToSet.length - 1);
          }
          // Clear selected image after submission
          setSelectedImage(null);
        } else {
          throw new Error("Failed to fetch help");
        }
      };

      xhr.onerror = () => {
        console.error("Error fetching help");
        setHelpText(prev => [...prev, {
          role: "system",
          content: "Failed to fetch help, please try again later.",
          visible: true,
          id: uuidv4(),
        }]);
        setCurrentInteractionIndex(helpText.length);
      };

      xhr.onloadend = () => {
        setLoading(false);
        if (isInitial) {
          setInitialLoading(false);
        }
      };

      xhr.send(formData);

    } catch (error) {
      console.error("Error fetching help:", error);
      setHelpText(prev => [...prev, {
        role: "system",
        content: "Failed to fetch help, please try again later.",
        visible: true,
        id: uuidv4(),
      }]);
      setCurrentInteractionIndex(helpText.length);
      setLoading(false);
      if (isInitial) {
        setInitialLoading(false);
      }
    }
  };

  const handleSubmit = (index) => {
    fetchHelp(latexInput, index);
    setLatexInput("");
  };

  const toggleMathKeyboard = () => {
    setUseMathKeyboard(!useMathKeyboard);
  };

  return (
    <MathJaxContext config={mathJaxConfig}>
      {initialLoading && (
        <Lottie
          animationData={loader}
          loop={true}
          style={{ height: 150, width: 150 }}
        />
      )}

      <div className="flex flex-col w-full justify-start">
        {helpText.map((ht, index) => ht.visible && (
          <div
            key={ht.id} // Ensure each element has a unique key
            className={`flex flex-col p-4 border rounded-md bg-slate-200 shadow ${index === currentInteractionIndex ? "mb-0" : "mb-4"}`}
          >
            <MathJax className="overflow-hidden">
              <p className={`text-left p-4 ${ht.role === "system" ? "font-bold" : "text-slate-600 bg-slate-200 rounded-xl"}`}>
                {ht.content}
              </p>
            </MathJax>

            {index === currentInteractionIndex && (
              <div className="flex flex-col items-start">
                {selectedImage && (
                  <div className="flex flex-col items-start mb-2 w-full">
                    <div
                      ref={imagePreviewRef}
                      className="w-16 h-16 bg-gray-300 bg-no-repeat bg-center bg-cover rounded"
                      style={{ backgroundImage: `url(${URL.createObjectURL(selectedImage)})` }}
                    >
                    </div>
                    {uploadProgress > 0 && uploadProgress < 100 && (
                      <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                        <div
                          className="bg-blue-600 h-2 rounded-full"
                          style={{ width: `${uploadProgress}%` }}
                        />
                      </div>
                    )}
                  </div>
                )}
                <div className="relative flex items-center w-full">
                  <input
                    type="text"
                    value={latexInput}
                    onChange={(e) => setLatexInput(e.target.value)}
                    placeholder="Type your response..."
                    style={{
                      width: '100%',
                      padding: '10px',
                      fontSize: '16px',
                      paddingRight: '40px', // Add space for the icon
                    }}
                  />
                  <label className="absolute right-2 cursor-pointer">
                    <FiPaperclip size={24} />
                    <input
                      type="file"
                      accept="image/*" // Restrict to image files only
                      onChange={(e) => handleImageSelect(e.target.files[0])}
                      style={{ display: 'none' }}
                    />
                  </label>
                </div>
                <div className="flex mt-4">
                  <Button
                    type="button"
                    className="m-2 rounded-full"
                    onClick={() => {
                      // Check if using Math Keyboard and mf.current is initialized
                      if (useMathKeyboard && mf.current) {
                        console.log("Current LaTeX value:", mf.current.latex());
                        fetchHelp(mf.current.latex(), index); // Use LaTeX input if Math Keyboard is active
                      } else {
                        console.log("Current input value:", latexInput);
                        fetchHelp(latexInput, index); // Use regular input if standard keyboard is used
                      }
                      setLatexInput("");
                    }}
                    disabled={IsButtonDisabled}
                  >
                    Submit
                  </Button>

                  <Button
                    type="button"
                    className="m-2 rounded-full"
                    onClick={toggleMathKeyboard}
                  >
                    {useMathKeyboard ? 'Use Standard Keyboard' : 'Use Math Keyboard'}
                  </Button>
                </div>
              </div>
            )}
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
          </div>
        ))}
        <div ref={endOfMessagesRef} />
      </div>
    </MathJaxContext>
  );
}

export default GPTCard;
