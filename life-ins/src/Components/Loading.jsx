import React from 'react';

const Loading = ({ message = "Loading, please wait..." }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[300px] space-y-4">
      <svg
        className="animate-spin -ml-1 mr-3 h-10 w-10 text-primary"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        aria-label="Loading spinner"
      >
        <circle
          className="opacity-25"
          cx="12" cy="12" r="10"
          stroke="currentColor"
          strokeWidth="4"
        ></circle>
        <path
          className="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
        ></path>
      </svg>
      <p className="text-gray-600 text-lg font-medium">{message}</p>
    </div>
  );
};

export default Loading;
