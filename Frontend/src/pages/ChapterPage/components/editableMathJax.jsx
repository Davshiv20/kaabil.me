import React, { useState, useRef, useEffect } from 'react';
import { MathJax } from 'better-react-mathjax';

const EditableMathJaxInput = ({ value, onChange, placeholder }) => {
  const [isEditing, setIsEditing] = useState(false);
  const inputRef = useRef(null);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isEditing]);

  const handleClick = () => {
    setIsEditing(true);
  };

  const handleBlur = () => {
    setIsEditing(false);
  };

  const handleChange = (e) => {
    onChange(e.target.value);
  };

  return (
    <div onClick={handleClick} className="border p-2 min-h-[100px] cursor-text">
      {isEditing ? (
        <textarea
          ref={inputRef}
          value={value}
          onChange={handleChange}
          onBlur={handleBlur}
          placeholder={placeholder}
          className="w-full h-full outline-none"
        />
      ) : (
        <MathJax>
          {value || <span className="text-gray-400">{placeholder}</span>}
        </MathJax>
      )}
    </div>
  );
};

export default EditableMathJaxInput;