import React, { useState, useRef } from 'react';
import MathInput from "react-math-keyboard";
import ReactGA from 'react-ga4';

function UnifiedInput({ onSubmit }) {
  const [input, setInput] = useState("");
  const [useMathKeyboard, setUseMathKeyboard] = useState(false);
  const mathInputRef = useRef(null);

  const toggleKeyboard = () => {
    // Ensure switching retains input
    if (useMathKeyboard && mathInputRef.current) {
      // If switching from math to standard, update input to current LaTeX
      setInput(mathInputRef.current.latex());
    }
    setUseMathKeyboard(!useMathKeyboard);
  };

  const handleSubmit = () => {
    ReactGA.event({
      category: 'User',
      action: 'Submitted Unified Input'
    });
    onSubmit(input);
    setInput(''); // Reset the input field after submission
  };

  return (
    <div>
      {useMathKeyboard ? (
        <MathInput
          value={input}
          setValue={setInput}
          setMathfieldRef={(ref) => { mathInputRef.current = ref; }} // Correctly setting the reference
          placeholder="Type math here..."
        />
      ) : (
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type here..."
        />
      )}
      <button onClick={toggleKeyboard}>
        {useMathKeyboard ? 'Use Standard Keyboard' : 'Use Math Keyboard'}
      </button>
      <button onClick={handleSubmit} disabled={!input}>
        Submit
      </button>
    </div>
  );
}

export default UnifiedInput;
