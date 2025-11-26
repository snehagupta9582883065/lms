import React from 'react';

const Loader = ({ size = 'md', message = 'Loading...' }) => {
  let sizeClass = 'h-5 w-5';
  if (size === 'sm') sizeClass = 'h-4 w-4';
  if (size === 'lg') sizeClass = 'h-8 w-8';

  return (
    <div className="flex items-center justify-center space-x-2">
      <div 
        className={`animate-spin rounded-full border-t-2 border-b-2 border-indigo-500 ${sizeClass}`}
      ></div>
      {message && <p className="text-gray-600 text-sm">{message}</p>}
    </div>
  );
};

export default Loader;