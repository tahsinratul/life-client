import React from 'react';
import { Link } from 'react-router';
import { FaBan } from 'react-icons/fa';

const Forbidden = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 px-4 text-center">
      <FaBan className="text-red-600 text-9xl mb-6" aria-hidden="true" />
      <h1 className="text-5xl font-extrabold mb-4 text-gray-800">403</h1>
      <h2 className="text-2xl font-semibold mb-2 text-gray-700">Access Denied</h2>
      <p className="mb-6 max-w-md text-gray-600">
        Sorry, you don’t have permission to access this page.
        If you think this is an error, please contact support.
      </p>
      <Link
        to="/"
        className="inline-block px-6 py-3 bg-primary text-white font-semibold rounded-lg hover:bg-primary-dark transition"
      >
        Go to Home
      </Link>
    </div>
  );
};

export default Forbidden;
