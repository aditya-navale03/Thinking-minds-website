import React from "react";
import { useNavigate } from "react-router-dom";

interface BackButtonProps {
  className?: string;
}

const BackButton: React.FC<BackButtonProps> = ({ className }) => {
  const navigate = useNavigate();

  return (
    <button
      onClick={() => navigate(-1)}
      className={`
        flex items-center justify-center w-10 h-10 bg-blue-600 text-white rounded-full shadow-md
        hover:bg-blue-700 hover:shadow-lg transition-all duration-200
        ${className}
      `}
    >
      <span className="text-lg">&#8592;</span>
    </button>
  );
};

export default BackButton;
