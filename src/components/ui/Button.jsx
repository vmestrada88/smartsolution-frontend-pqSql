import React from 'react';

const Button = ({ children, onClick, type = 'button', className = '' }) => {
  return (
    <button
      type={type}
      onClick={onClick}
      className={`
        px-4 py-2
        bg-teal-600 
        text-white 
        rounded text-sm 
        font-bold 
        flex 

        hover:bg-teal-800
      

        transition ${className}`}
    >
      {children}
    </button>
  );
};

export default Button;
