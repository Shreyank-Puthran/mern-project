import { useState, useEffect } from "react";
// import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa6";
import slider1 from "../assets/slider1.jpg";
import slider2 from "../assets/slider2.jpg";

const images = [slider1, slider2];

const ImageSlider = () => {
  const [loaded, setLoaded] = useState(false);
  const [current, setCurrent] = useState(0);

  const prevSlide = () => {
    setCurrent((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const nextSlide = () => {
    setCurrent((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  useEffect(() => {
    setLoaded(false);
    const timer = setTimeout(() => setLoaded(true), 100);

    return () => clearTimeout(timer);
  }, [current]);

  return (
    <div className="relative overflow-hidden w-full h-[100vh] ">
      <div
        className="flex transition-transform duration-700 ease-in-out"
        style={{ transform: `translateX(-${current * 100}%)` }}
      >
        {images.map((src, index) => (
          <div key={index} className="relative w-full flex-shrink-0 h-screen">
            <img
              key={index}
              src={src}
              alt={`Slide ${index}`}
              className="w-full h-full object-cover"
            />
            {/* Caption overlay */}
            <div
              className={`
    absolute inset-0 
    flex flex-col items-center sm:items-end justify-center 
    text-white font-bold
    transition-opacity duration-1000 text-3xl
    px-10
    ${
      loaded && index === current
        ? "opacity-100 scale-100"
        : "opacity-0 scale-0"
    }
  `}
            >
              {index === 0 ? (
                <>
                  <p
                    className={`skew-6 transition-opacity duration-700 delay-100 md:text-[6rem] text-center sm:text-right text-[#471715] ${
                      loaded && index === current ? "opacity-100" : "opacity-0"
                    }`}
                  >
                    Welcome to
                  </p>
                  <p
                    className={`skew-6 transition-opacity duration-700 md:text-[5rem] my-4 text-center sm:text-right pl-0 sm:pl-5 delay-500 ${
                      loaded && index === current ? "opacity-100" : "opacity-0"
                    }`}
                  >
                    Real Soccer
                  </p>
                  <p
                    className={`skew-6 transition-opacity duration-700 md:text-[4rem] text-center sm:text-right pl-0 sm:pl-10 delay-900 ${
                      loaded && index === current ? "opacity-100" : "opacity-0"
                    }`}
                  >
                    Football Club
                  </p>
                </>
              ) : (
                <>
                  <p
                    className={`transition-opacity duration-700 md:text-[5rem] my-4 text-center sm:text-right pl-0 sm:pl-5 delay-500 ${
                      loaded && index === current ? "opacity-100" : "opacity-0"
                    }`}
                  >
                    Real Soccer
                  </p>
                  <p
                    className={`transition-opacity duration-700 md:text-[4rem] text-center sm:text-right pl-0 sm:pl-10 delay-900 ${
                      loaded && index === current ? "opacity-100" : "opacity-0"
                    }`}
                  >
                    Football Club
                  </p>
                </>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Navigation Buttons */}
      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 transform -translate-y-1/2 md:text-5xl font-thin hover:cursor-pointer p-2 text-white rounded-full"
      >
        <FaChevronLeft />
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 transform -translate-y-1/2 md:text-5xl font-thin hover:cursor-pointer p-2 text-white rounded-full"
      >
        <FaChevronRight />
      </button>
    </div>
  );
};

export default ImageSlider;
