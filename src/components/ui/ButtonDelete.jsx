/**
 * ButtonDelete component for reusable styled delete buttons.
 * @module components/ui/ButtonDelete
 * @description Renders a customizable delete button element for user interactions.
 * @param {object} props - Component props.
 * @param {React.ReactNode} props.children - Button content.
 * @param {function} [props.onClick] - Click event handler.
 * @param {string} [props.type='button'] - Button type attribute.
 * @param {string} [props.className] - Additional CSS classes.
 * @returns {JSX.Element} Button element.
 */
import React from 'react';

const Button = ({ children, onClick, type = 'button', className = '' }) => {
  return (
    <button
      type={type}
      onClick={onClick}
      className={`
        px-4 py-2
        bg-red-600 
        text-white 
        rounded text-sm 
        font-bold 
         

        hover:bg-red-800
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
