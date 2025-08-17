import React, { useEffect, useState } from "react";
import Lottie from "lottie-react";
import animationData from "../assets/lottie.json";
import { Link } from "react-router";
import Navbar from "./Navbar/Navbar";
import Footer from "./Footer/Footer";




const ErrorPage = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate short loading time
    const timer = setTimeout(() => {
      setLoading(false);
    }, 800); // 0.8 second loader

    return () => clearTimeout(timer);
  }, []);


  return (
    <div className="bg-gradient-to-b from-slate-50 via-slate-100 to-slate-200 min-h-screen flex flex-col">
      <Navbar></Navbar>

      <div className="flex-1 flex flex-col items-center justify-center text-center px-4 mt-20">
        {/* Animation */}
        <div className="max-w-md w-full animate-pulse">
          <Lottie animationData={animationData} loop autoplay />
        </div>

        {/* Error Message */}
        <h1 className="text-4xl md:text-5xl font-extrabold text-slate-800 drop-shadow-md mt-6">
          Oops! Page Not Found
        </h1>
        <p className="text-lg text-slate-600 mt-3 max-w-lg">
          The page you’re looking for might have been moved, deleted, or never existed.
          Don’t worry — let’s get you back on track.
        </p>

        {/* Go Back Button */}
        <Link to={"/"} className="mt-8">
          <button className="px-6 py-3 bg-slate-800 text-white font-semibold rounded-lg shadow-md hover:bg-slate-700 hover:shadow-lg transition-all duration-300">
            ⬅ Go Home
          </button>
        </Link>
      </div>

      <Footer></Footer>
    </div>
  );
};

export default ErrorPage;
