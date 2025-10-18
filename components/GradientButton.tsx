
import React from 'react';

interface GradientButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
}

const GradientButton: React.FC<GradientButtonProps> = ({ children, ...props }) => {
  return (
    <button
      {...props}
      className="px-6 py-3 font-semibold text-white bg-gradient-to-r from-orange-500 to-orange-600 rounded-lg shadow-md hover:scale-105 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-opacity-75 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:scale-100"
    >
      {children}
    </button>
  );
};

export default GradientButton;
