import React from 'react';
import authImage from '/auth.jpg';
import { Outlet, Link } from 'react-router'; // ✅ fix: use 'react-router-dom'
import { FaHome } from 'react-icons/fa';
import Logo from '../Hooks/Logo';

const AuthLayout = () => {
  return (
    <div className="h-screen grid grid-cols-1 md:grid-cols-2 bg-white">

      {/* Left: Logo + Form */}
      <div className="h-full flex flex-col items-center justify-center p-6 md:p-12 bg-white">
        
        {/* Logo with Home icon */}
        <div className="w-full max-w-md mb-8">
          <Link to="/" className="flex items-center gap-2 text-primary hover:scale-105 transition">
            <FaHome className="text-xl md:text-2xl" />
            <Logo />
          </Link>
        </div>

        {/* Form content */}
        <div className="w-full max-w-md">
          <Outlet />
        </div>
      </div>

      {/* Right: Static image */}
      <div className="hidden md:block h-full">
        <img
          src={authImage}
          alt="Authentication Visual"
          className="w-full h-full object-cover"
        />
      </div>
    </div>
  );
};

export default AuthLayout;
