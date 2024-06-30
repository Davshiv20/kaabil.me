import React, { useEffect, useRef, useState } from "react";
import { Button } from "../ui/button";
import Lottie from "lottie-react";
import loader from "../../assets/loader.json";
import { MathJax, MathJaxContext } from "better-react-mathjax";
import MathInput from "react-math-keyboard";
import { v4 as uuidv4 } from 'uuid';
import { FiPaperclip } from 'react-icons/fi';
import { FaCamera } from 'react-icons/fa';
import { AiOutlineClose } from 'react-icons/ai';
import Webcam from "react-webcam";
import Cropper from "react-cropper";
import "cropperjs/dist/cropper.css";

function GPTCard({ questionId, initialPrompt }) {
  const [helpText, setHelpText] = useState([]);
  const [messageCount, setMessageCount] = useState(0);
  const [loading, setLoading] = useState({});
  const [initialLoading, setInitialLoading] = useState(false);
  const [latexInput, setLatexInput] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [currentInteractionIndex, setCurrentInteractionIndex] = useState(-1);
  const [useMathKeyboard, setUseMathKeyboard] = useState(false);
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);
  const [showWebcam, setShowWebcam] = useState(false);
  const [showCropper, setShowCropper] = useState(false);
  const [capturedImage, setCapturedImage] = useState(null);
  const [facingMode, setFacingMode] = useState("user"); // Set default facing mode
  const webcamRef = useRef(null);
  const cropperRef = useRef(null);
  const imagePreviewRef = useRef(null);
  const endOfMessagesRef = useRef(null);
  const mf = useRef(null);

  const mathJaxConfig = {
    loader: { load: ["input/tex", "output/svg"] },
    tex: {
      inlineMath: [["$", "$"], ["\\(", "\\)"]],
      displayMath: [["$$", "$$"], ["\\[", "\\]"]],
      packages: { '[+]': ['noerrors'] }
    },
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
          setMessageCount(history.length);
        }
      }
    };

    loadData();
  }, [questionId, helpText.length]);

  useEffect(() => {
    if (helpText.length > 0 && !helpText.every(item => Object.keys(item).length === 0)) {
      localStorage.setItem(`interactionHistory-${questionId}`, JSON.stringify(helpText));
    }
  }, [helpText, questionId]);

  useEffect(() => {
    if (endOfMessagesRef.current) {
      endOfMessagesRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [helpText]);

  useEffect(() => {
    // Determine the type of device and set the facingMode accordingly
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    setFacingMode(isMobile ? "environment" : "user");
  }, []);

  const handleImageSelect = (image) => {
    setSelectedImage(image);
    setUploadProgress(0);
  };

  const handleCameraClick = () => {
    setShowWebcam(true);
  };

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

  const captureImage = () => {
    const imageSrc = webcamRef.current.getScreenshot();
    setCapturedImage(imageSrc);
    setShowWebcam(false);
    setShowCropper(true);
  };

  const cropImage = () => {
    if (cropperRef.current) {
      const croppedCanvas = cropperRef.current.cropper.getCroppedCanvas();
      croppedCanvas.toBlob((blob) => {
        const file = new File([blob], 'cropped_photo.jpg', { type: 'image/jpeg' });
        handleImageSelect(file);
        setShowCropper(false);
      }, 'image/jpeg');
    }
  };

  const fetchHelp = async (userMessage, index, isInitial = false) => {
    setIsButtonDisabled(true);
    setInitialLoading(isInitial);
    setLoading((prev) => ({ ...prev, [index]: true }));

    const formData = new FormData();
    formData.append("userInput", userMessage || " ");
    if (selectedImage) {
      formData.append("image", selectedImage);
    }
    formData.append("sessionMessages", JSON.stringify(isInitial ? [] : helpText));

    try {
      const response = await fetch("http://localhost:3000/api/openai", {
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

  const toggleMathKeyboard = () => {
    setUseMathKeyboard(!useMathKeyboard);
  };

  const formatResponse = (text) => {
    if (typeof text !== 'string') {
      console.error('Expected text to be a string, but received:', text);
      return <React.Fragment>{JSON.stringify(text)}</React.Fragment>;
    }

    // Split the text by newlines first, then process bold formatting within each line
    return text.split('\n').map((line, lineIndex) => {
      const parts = line.split(/(\*\*[^*]+\*\*)/);
      return (
        <React.Fragment key={lineIndex}>
          {parts.map((part, index) => {
            if (part.startsWith('**') && part.endsWith('**')) {
              return (
                <strong key={index}>{part.slice(2, -2)}</strong>
              );
            }
            return (
              <React.Fragment key={index}>
                {part}
              </React.Fragment>
            );
          })}
          <br />
        </React.Fragment>
      );
    });
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
            key={ht.id}
            className={`flex flex-col p-4 border rounded-md bg-slate-200 shadow ${index === currentInteractionIndex ? "mb-0" : "mb-4"}`}
          >
            <MathJax className="overflow-hidden">
              <p className={`text-left p-4 ${ht.role === "system" ? "font-bold" : "text-slate-600 bg-slate-200 rounded-xl"}`}>
                {ht.role === "system" ? (
                  <MathJax>{ht.content}</MathJax>
                ) : (
                  formatResponse(ht.content[0].text)
                )}
              </p>
            </MathJax>

            {index === currentInteractionIndex && (
              <div className="flex flex-col items-start w-full">
                {showWebcam && (
                  <div className="relative flex flex-col items-center mb-4 w-full">
                    <button onClick={closeCamera} className="absolute top-2 right-2 z-10">
                      <AiOutlineClose size={24} />
                    </button>
                    <Webcam
                      audio={false}
                      ref={webcamRef}
                      screenshotFormat="image/jpeg"
                      className="w-full h-64"
                      facingMode={facingMode} // Set the facingMode based on the device type
                    />
                    <Button onClick={captureImage}>Capture</Button>
                  </div>
                )}

                {showCropper && capturedImage && (
                  <div className="relative flex flex-col items-center mb-4 w-full">
                    <button onClick={closeCropper} className="absolute top-2 right-2 z-10">
                      <AiOutlineClose size={24} />
                    </button>
                    <Cropper
                      src={capturedImage}
                      style={{ height: 400, width: "100%" }}
                      initialAspectRatio={1}
                      guides={false}
                      ref={cropperRef}
                    />
                    <Button onClick={cropImage}>Crop</Button>
                  </div>
                )}

                {selectedImage && (
                  <div className="relative flex flex-col items-start mb-2 w-full">
                    <button onClick={removeSelectedImage} className="absolute top-2 right-2 z-10">
                      <AiOutlineClose size={24} />
                    </button>
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
                  {useMathKeyboard ? (
                    <MathInput
                      ref={mf}
                      setValue={setLatexInput}
                      value={latexInput}
                    />
                  ) : (
                    <input
                      type="text"
                      value={latexInput}
                      onChange={(e) => setLatexInput(e.target.value)}
                      placeholder="Type your response..."
                      style={{
                        width: '100%',
                        padding: '10px',
                        fontSize: '16px',
                        paddingRight: '80px',
                      }}
                    />
                  )}
                  <label className="absolute right-12 cursor-pointer">
                    <FiPaperclip size={24} />
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleImageSelect(e.target.files[0])}
                      style={{ display: 'none' }}
                    />
                  </label>
                  <button
                    className="absolute right-2 cursor-pointer"
                    onClick={handleCameraClick}
                  >
                    <FaCamera size={24} />
                  </button>
                </div>
                <div className="flex mt-4">
                  <Button
                    type="button"
                    className="m-2 rounded-full"
                    onClick={() => {
                      if (useMathKeyboard && mf.current) {
                        fetchHelp(mf.current.latex(), index);
                      } else {
                        fetchHelp(latexInput, index);
                      }
                      setLatexInput("");
                    }}
                    disabled={isButtonDisabled || messageCount >= 12}
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
                {messageCount > 11 && (
                  <div className="text-red-500 text-center font-bold mt-2">
                    You have reached the limit of 12 questions.
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
        ))}
        <div ref={endOfMessagesRef} />
      </div>
    </MathJaxContext>
  );
}

export default GPTCard;
