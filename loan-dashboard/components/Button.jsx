import React from 'react';

const Button = ({ children, onClick, disabled, type = 'button', variant = 'primary', ...props }) => {
  const baseClasses = 'w-full px-4 py-2 font-semibold rounded-lg shadow-md transition duration-150 ease-in-out';
  
  let variantClasses;
  if (variant === 'primary') {
    variantClasses = 'bg-indigo-600 text-white hover:bg-indigo-700 focus:ring-indigo-500';
  } else if (variant === 'secondary') {
    variantClasses = 'bg-gray-200 text-gray-800 hover:bg-gray-300 focus:ring-gray-500';
  }
  
  const disabledClasses = disabled ? 'opacity-50 cursor-not-allowed' : 'focus:outline-none focus:ring-2 focus:ring-offset-2';

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${baseClasses} ${variantClasses} ${disabledClasses}`}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;