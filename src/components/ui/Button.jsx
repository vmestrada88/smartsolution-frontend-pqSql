/**
 * Reusable Button component.
 *
 * @component
 * @param {object} props - Component props.
 * @param {React.ReactNode} props.children - Content to be displayed inside the button.
 * @param {function} [props.onClick] - Function to be called when the button is clicked.
 * @param {string} [props.type='button'] - Button type attribute (e.g., 'button', 'submit', 'reset').
 * @param {string} [props.className=''] - Additional CSS classes to apply to the button.
 * @returns {JSX.Element} The rendered button element.
 */
import React from 'react';

const Button = ({ children, onClick, type = 'button', className = '' }) => {
  return (
    <button
      type={type}
      onClick={onClick}
      className={`
        px-4 py-2
        bg-blue-800 
        text-white 
        rounded text-sm 
        font-bold 
        items-center space-x-2
        hover:bg-blue-400
        transition
        inline-block
        mr-2
        ${className}`}
    >
      {children}
    </button>
  );
};

export default Button;
