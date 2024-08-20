import React, { useEffect, useRef, useState } from "react";
import { Button } from "../ui/button";
import Lottie from "lottie-react";
import loader from "../../assets/loader.json";
import { AiOutlineClose } from "react-icons/ai";
import { MathJax, MathJaxContext } from "better-react-mathjax";
import MathInput from "react-math-keyboard";
import { v4 as uuidv4 } from "uuid";
import { FiPaperclip } from "react-icons/fi";
import { FaCamera } from "react-icons/fa";
import { Camera } from "react-camera-pro";
import Cropper from "react-cropper";
import axios from "axios";
import "cropperjs/dist/cropper.css";

function loadState(key, defaultValue) {
  const storedData = localStorage.getItem(key);
  try {
    return storedData ? JSON.parse(storedData) : defaultValue;
  } catch (err) {
    console.error("Error parsing JSON from localStorage:", err);
    return defaultValue;
  }
}

function GPTCard({ questionId, initialPrompt }) {
  
  const [IsButtonDisabled,setIsButtonDisabled]=useState(false);

  const [helpText, setHelpText] = useState([]);
  const [loading, setLoading] = useState(true); // General loading state
  const [initialLoading, setInitialLoading] = useState(false); // Specific state for initial loading
  const [latexInput, setLatexInput] = useState("");
  const [currentInteractionIndex, setCurrentInteractionIndex] = useState(-1);
  const [useMathKeyboard, setUseMathKeyboard] = useState(false);
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);
  const [showWebcam, setShowWebcam] = useState(false);
  const [showCropper, setShowCropper] = useState(false);
  const [capturedImage, setCapturedImage] = useState(null);
  const [mathKeyboardInput, setMathKeyboardInput] = useState("");
  const [latexResult, setLatexResult] = useState("");
  const [mathJaxProcessing, setMathJaxProcessing] = useState(true);
  const webcamRef = useRef(null);
  const cropperRef = useRef(null);
  const imagePreviewRef = useRef(null);
  const endOfMessagesRef = useRef(null);
  const mf = useRef(null);
  const [helpText, setHelpText] = useState(() =>
    loadState(`helpText-${questionId}`, [])
  );
  const [messageCount, setMessageCount] = useState(() =>
    loadState(`messageCount-${questionId}`, 0)
  );
  const [latexInput, setLatexInput] = useState("");
  const [currentInteractionIndex, setCurrentInteractionIndex] = useState(() =>
    loadState(`currentInteractionIndex-${questionId}`, -1)
  );

  useEffect(() => {
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    setFacingMode(isMobile ? "environment" : "user");
  }, []);

  const mathJaxConfig = {
    loader: { load: ["input/tex", "output/svg"] },
    tex: {
      inlineMath: [
        ["$", "$"],
        ["\\(", "\\)"],
      ],
    },
    options: {
      enableMenu: false,
    },
    svg: {
      fontCache: "global",
      scale: 1,
    },
  };

  useEffect(() => {
    localStorage.setItem(`helpText-${questionId}`, JSON.stringify(helpText));
    localStorage.setItem(
      `messageCount-${questionId}`,
      JSON.stringify(messageCount)
    );
    localStorage.setItem(
      `hasFetched-${questionId}`,
      JSON.stringify(hasDataFetched)
    );

    localStorage.setItem(
      `currentInteractionIndex-${questionId}`,
      JSON.stringify(currentInteractionIndex)
    );
  }, [
    helpText,
    messageCount,
    hasDataFetched,
    currentInteractionIndex,
    questionId,
  ]);

  useEffect(() => {
    if (!hasDataFetched && helpText.length === 0 && attempts === 1) {
      fetchHelp(initialPrompt, currentInteractionIndex, true);
      setHasDataFetched(true);
    } else if (hasDataFetched && attempts !== 1) {
      fetchHelp(initialPrompt, attempts);
      setHasDataFetched(false);
    }
  }, [
    initialPrompt,
    attempts,
    hasDataFetched,
    helpText.length,
    currentInteractionIndex,
  ]);

  const isSubmitDisabled = () => {
    return (
      isButtonDisabled ||
      messageCount >= 12 ||
      !latexInput ||
      latexInput.trim().length === 0
    );
  };
  console.log("user options selected:", userAnswer);
  const closeCamera = () => {
    setShowWebcam(false);
  };

  const closeCropper = () => {
    setShowCropper(false);
    setCapturedImage(null);
  };

  const removeSelectedImage = () => {
    setSelectedImage(null);
  };

  useEffect(() => {
    if (helpText.length === 0) {
      fetchHelp(initialPrompt, -1, true);
    }
  }, [initialPrompt, helpText.length]);

  useEffect(() => {
    const storedData = localStorage.getItem(`interactionHistory-${questionId}`);
    if (storedData) {
      const history = JSON.parse(storedData);
      setHelpText(history);
      setCurrentInteractionIndex(history.length - 1);
    }
  }, [questionId]);

  useEffect(() => {
    if (
      helpText.length > 0 &&
      !helpText.every((item) => Object.keys(item).length === 0)
    ) {
      localStorage.setItem(
        `interactionHistory-${questionId}`,
        JSON.stringify(helpText)
      );
    }
  }, [helpText, questionId]);

  const applyMathKeyboardInput = () => {
    setLatexInput((prevInput) => prevInput + mathKeyboardInput);
    setMathKeyboardInput("");
  };

  useEffect(() => {
    if (endOfMessagesRef.current) {
      endOfMessagesRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [helpText]);

  const handleImageSelect = async (image) => {
    setImageLoading(true);
    setSelectedImage(image);
    setUploadProgress(0);

    const formData = new FormData();
    formData.append("file", image);

    try {
      const response = await axios.post(
        // for local development 
      //  "http://localhost:3000/api/image/upload",

      // for production development
      // do not delete
      "https://www.kaabil.me/api/image/upload",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      setLatexResult(response.data.latex);
      setLatexInput(response.data.latex);
    } catch (error) {
      console.error("Error uploading file:", error);
    } finally {
      setImageLoading(false);
    }
  };

  const handleCameraClick = () => {
    setShowWebcam(true);
  };

  const captureImage = () => {
    if (camera.current) {
      const photo = camera.current.takePhoto();
      setCapturedImage(photo);
      setShowWebcam(false);
      setShowCropper(true);
    }
  };

  const cropImage = () => {
    if (cropperRef.current) {
      const croppedCanvas = cropperRef.current.cropper.getCroppedCanvas();
      croppedCanvas.toBlob((blob) => {
        const file = new File([blob], "cropped_photo.jpg", {
          type: "image/jpeg",
        });
        handleImageSelect(file);
        setShowCropper(false);
      }, "image/jpeg");
    }
  };

  const fetchHelp = async (userMessage, index, isInitial = false) => {
    setIsButtonDisabled(true);
    setInitialLoading(isInitial);
    setLoading((prev) => ({ ...prev, [index]: true }));

    const formData = new FormData();
    formData.append("userInput", userMessage);
    formData.append(
      "sessionMessages",
      JSON.stringify(isInitial ? [] : helpText)
    );

    try {
      // for production
    //  const response = await fetch("https://www.kaabil.me/api/openai", {
      // for local dev
     // const response = await fetch("http://localhost:3000/api/openai", {
      const response = await fetch("https://www.kaabil.me/api/openai", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        const messagesToSet = data.updatedMessages.map((message, index) => ({
          ...message,
          visible: index > 0,
          id: uuidv4(),
        }));
        setHelpText(messagesToSet);
        setMessageCount((prevCount) => prevCount + 1);
        setCurrentInteractionIndex(messagesToSet.length - 1);
        setSelectedImage(null);
        const interactionData = {
          questionIndex: currentInteractionIndex,
          chats: messagesToSet,
          userInput: userMessage,
          timestamp: new Date().toISOString(),
          userOption: userAnswer[userAnswer.length - 1],
        };

        console.log("Interaction Data:", interactionData); // Log interaction data

        saveInteraction(interactionData);
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
          id: uuidv4(),
        },
      ]);
      setCurrentInteractionIndex(helpText.length);
    } finally {
      setInitialLoading(false);
      setIsButtonDisabled(false);
      setLoading((prev) => ({ ...prev, [index]: false }));
    }
  };

  const saveInteraction = async (interactionData) => {
    try {
      //un comment for production
       const url = `https://www.kaabil.me/api/messages/${questionId}`;
    //  const url = `http://localhost:3000/api/messages/${questionId}`;
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

  useEffect(() => {
    const checkMathJax = () => {
      if (window.MathJax && window.MathJax.typesetPromise) {
        setMathJaxProcessing(true);
        window.MathJax.typesetPromise()
          .then(() => {
            setMathJaxProcessing(false);
          setMathJaxLoaded(true);
          })
          .catch((error) =>
          {
            console.error("MathJax typesetting failed:", error);
            setMathJaxProcessing(false);
          });
      } else {
        setTimeout(checkMathJax, 300);
      }
    };

    checkMathJax();
  }, []);

  const handleInputChange = (event) => {
    setLatexInput(event.target.value);
  };

  const formatResponse = (text) => {
    if (typeof text !== "string") {
      console.error("Expected text to be a string, but received:", text);
      return <React.Fragment>{JSON.stringify(text)}</React.Fragment>;
    }

    return text.split("\n").map((line, lineIndex) => {
      const parts = line.split(/(\*\*[^*]+\*\*)/);
      return (
        <React.Fragment key={lineIndex}>
          {parts.map((part, index) => {
            if (part.startsWith("**") && part.endsWith("**")) {
              return <strong key={index}>{part.slice(2, -2)}</strong>;
            }
            return <React.Fragment key={index}>{part}</React.Fragment>;
          })}
          <br />
        </React.Fragment>
      );
    });
  };

  const toggleMathKeyboard = () => {
    setUseMathKeyboard(!useMathKeyboard);
  };

  return (
    <MathJaxContext config={mathJaxConfig}>
      {(initialLoading || !mathJaxLoaded) && (
        <Lottie
          animationData={loader}
          loop={true}
          style={{ height: 150, width: 150 }}
        />
      )}

      <div className="flex flex-col w-full justify-start">
        {helpText.map(
          (ht, index) =>
            ht.visible && (
              <div
                key={ht.id}
                className={`flex flex-col p-4 border rounded-md bg-slate-200 shadow ${
                  index === currentInteractionIndex ? "mb-0" : "mb-4"
                }`}
              >{mathJaxProcessing ? (
                <div className="text-black ">Loading Content</div>
              ) : (
                <MathJax>
                  <div className="w-full overflow-x-auto">
                    <div className="min-w-full inline-block ">
                      <p
                        className={`text-left p-4 ${
                          ht.role === "assistant"
                            ? "font-bold"
                            : "text-slate-600 bg-slate-200 rounded-xl"
                        }`}
                      >
                        {ht.role === "system" ? (
                          <MathJax>{ht.content}</MathJax>
                        ) : (
                          formatResponse(ht.content[0].text)
                        )}
                      </p>
                    </div>
                  </div>
                </MathJax>
              )}
                {index === currentInteractionIndex && (
                  <div className="flex flex-col items-start w-full">
                    {showWebcam && (
                      <div className="fixed inset-0 z-50 bg-black bg-opacity-80 flex justify-center items-center">
                        <div className="w-full h-auto">
                          <Camera
                            ref={camera}
                            aspectRatio="cover"
                            numberOfCamerasCallback={setNumberOfCameras}
                            className="h-full w-full object-cover"
                          />
                          <div className="absolute bottom-0 left-0 right-0 flex justify-between items-center p-4 bg-black bg-opacity-50">
                            <button
                              className="p-2 rounded-full bg-white text-black"
                              onClick={closeCamera}
                            >
                              <AiOutlineClose size={24} />
                            </button>
                            <button
                              className="p-4 rounded-full bg-white"
                              onClick={captureImage}
                            >
                              <FaCamera size={24} className="text-black" />
                            </button>
                            <button
                              className="p-2 rounded-full bg-white text-black"
                              disabled={numberOfCameras <= 1}
                              onClick={() => {
                                if (camera.current) {
                                  camera.current.switchCamera();
                                }
                              }}
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-6 w-6"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"
                                />
                              </svg>
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                    {showCropper && capturedImage && (
                      <div className="relative flex flex-col items-center mb-4 w-full">
                        <button
                          onClick={closeCropper}
                          className="absolute top-2 right-2 z-10"
                        >
                          <AiOutlineClose size={24} />
                        </button>
                        <Cropper
                          src={capturedImage}
                          style={{ height: 400, width: "100%" }}
                          initialAspectRatio={1}
                          guides={false}
                          ref={cropperRef}
                        />
                        <Button className="bg-bluebg my-2" onClick={cropImage}>
                          Crop
                        </Button>
                      </div>
                    )}

                    {selectedImage && (
                      <div className="relative flex flex-col items-start mb-2 w-full">
                        <button
                          onClick={removeSelectedImage}
                          className="absolute top-2 right-2 z-10"
                        >
                          <AiOutlineClose size={24} />
                        </button>
                        <div
                          ref={imagePreviewRef}
                          className="w-16 h-16 bg-gray-300 bg-no-repeat bg-center bg-cover rounded"
                          style={{
                            backgroundImage: `url(${URL.createObjectURL(
                              selectedImage
                            )})`,
                          }}
                        ></div>
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
                    {latexInput && (
                      <div className="mt-4 w-full bg-slate-200 rounded-xl p-4">
                        <MathJax>
                          <p>{latexInput}</p>
                        </MathJax>
                      </div>
                    )}
                    {imageLoading && (
                        <span className="ml-2 text-gray-500">
                          Processing image...
                        </span>
                      )}
                    <div className="relative flex items-center w-full mt-4">
                      <input
                        type="text"
                        value={latexInput}
                        onChange={(e) => setLatexInput(e.target.value)}
                        placeholder="Type your response to submit ..."
                        style={{
                          width: "100%",
                          padding: "10px",
                          fontSize: "16px",
                          paddingRight: "80px",
                        }}
                      />
                      
                      <label className="absolute right-12 cursor-pointer">
                        <FiPaperclip size={24} />
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleImageSelect(e.target.files[0])}
                          style={{ display: "none" }}
                        />
                      </label>
                      <button
                        className="absolute right-2 cursor-pointer"
                        onClick={handleCameraClick}
                      >
                        <FaCamera size={24} />
                      </button>
                    </div>

                    {useMathKeyboard && (
                      <div className="flex flex-row w-full mt-4">
                        <MathInput
                          key={mathKeyboardKey}
                          setValue={setMathKeyboardInput}
                          value={mathKeyboardInput}
                        />
                        <Button
                          type="button"
                          className=" flex-row m-2 relative p-1 rounded-full"
                          onClick={applyMathKeyboardInput}
                        >
                          Apply to Main Keyboard
                        </Button>
                      </div>
                    )}

                    <Button
                      type="button"
                      className="mt-4 m-2 rounded-full"
                      onClick={() => {
                        ReactGA.event({
                          category: 'User',
                          action: 'Clicked a button'
                        });

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
                        {useMathKeyboard
                          ? "Hide Math Keyboard"
                          : "Use Math Keyboard"}
                      </Button>
                    </div>

                    {messageCount > 11 && (
                      <div className="text-red-500 text-center font-bold mt-2">
                        You have reached the limit of 10 questions.
                      </div>
                    )}
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
            )
        )}
        <div ref={endOfMessagesRef} />
      </div>
    </MathJaxContext>
  );
}

export default GPTCard;
