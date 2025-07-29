import React from 'react';
import { Link } from 'react-router'; // ✅ FIX: Correct import
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination } from 'swiper/modules';

import 'swiper/css';
import 'swiper/css/pagination';

import slide1 from '/7.jpg';
import slide2 from '/8.jpg';
import slide3 from '/9.jpg';

const slides = [
  {
    id: 1,
    image: slide1,
    heading: 'Secure Your Tomorrow Today',
    tagline: 'Plan your future with trusted life insurance solutions.',
  },
  {
    id: 2,
    image: slide2,
    heading: 'Protection that Grows with You',
    tagline: 'Tailored policies for every life chapter — we’re here with you.',
  },
  {
    id: 3,
    image: slide3,
    heading: 'Sure Life – Your Digital Life Partner',
    tagline: 'Get fast quotes, manage claims, and secure your future with ease.',
  },
];

const Hero = () => {
  return (
    <div className="w-full overflow-hidden">
      <Swiper
        modules={[Autoplay, Pagination]}
        autoplay={{ delay: 5000 }}
        loop={true}
        pagination={{ clickable: true }}
        className="w-full"
      >
        {slides.map((slide) => (
          <SwiperSlide key={slide.id}>
            <div className="flex flex-col-reverse md:flex-row items-center justify-between gap-8 max-w-7xl mx-auto px-4 py-12 min-h-[80vh]">
              
              {/* Left: Text Content */}
              <div className="w-full md:w-1/2 text-center md:text-left space-y-5">
                <h1 className="text-3xl md:text-5xl font-bold text-[#1E40AF] drop-shadow">
                  {slide.heading}
                </h1>
                <p className="text-gray-600 text-base md:text-lg leading-relaxed">
                  {slide.tagline}
                </p>
                <Link
                  to="/policies"
                  className="btn bg-slate-800 text-white px-6 py-3 rounded-full shadow-md hover:scale-105 transition-transform duration-300"
                >
                  Browse All Policy
                </Link>
              </div>

              {/* Right: Image */}
              <div className="w-full md:w-1/2 flex justify-center items-center">
                <img
                  src={slide.image}
                  alt={slide.heading}
                  className="max-w-full h-auto object-contain rounded-lg"
                />
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default Hero;