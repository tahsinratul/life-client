import { Link } from "react-router"; // ✅ correct import
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";

// hero section

import "swiper/css";
import "swiper/css/pagination";

import slide1 from "/7.jpg";
import slide2 from "/8.jpg";
import slide3 from "/9.jpg";

const slides = [
  {
    id: 1,
    image: slide1,
    heading: "Secure Your Tomorrow Today",
    tagline: "Plan your future with trusted life insurance solutions.",
  },
  {
    id: 2,
    image: slide2,
    heading: "Protection that Grows with You",
    tagline: "Tailored policies for every life chapter — we’re here with you.",
  },
  {
    id: 3,
    image: slide3,
    heading: "Life Care – Your Digital Life Partner",
    tagline: "Get fast quotes, manage claims, and secure your future with ease.",
  },
];

const Hero = () => {
  return (
    <div className="h-screen max-w-7xl overflow-hidden mx-auto ">
      <Swiper
        modules={[Autoplay, Pagination]}
        autoplay={{ delay: 5000 }}
        loop={true}
        pagination={{ clickable: true }}
        className="w-full h-screen"
      >
        {slides.map((slide) => (
          <SwiperSlide key={slide.id}>
            <div className="relative w-full">
              {/* Image */}
              <img
                src={slide.image}
                alt={slide.heading}
                className="w-full h-screen  bg-cover"
              />

              {/* Overlay */}
              <div className="absolute inset-0 bg-black/40 flex flex-col justify-center items-center text-center px-4">
                <h1 className="text-3xl md:text-5xl font-bold text-white drop-shadow mb-4">
                  {slide.heading}
                </h1>
                <p className="text-white text-base md:text-lg mb-6">
                  {slide.tagline}
                </p>
                <Link
                  to="/policies"
                  className="bg-slate-800 text-white font-bold px-6 py-3 rounded-full shadow-md hover:scale-105 hover:shadow-xl transition-transform duration-300"
                >
                  Browse All Policy
                </Link>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default Hero;
