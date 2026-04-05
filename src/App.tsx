import React, { useState, useEffect, useCallback } from 'react';
import { ChevronLeft, ChevronRight, Play, Pause } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const images = [
  { id: 1, url: 'https://picsum.photos/seed/nature/800/400', title: 'Nature' },
  { id: 2, url: 'https://picsum.photos/seed/city/800/400', title: 'City' },
  { id: 3, url: 'https://picsum.photos/seed/technology/800/400', title: 'Technology' },
  { id: 4, url: 'https://picsum.photos/seed/animals/800/400', title: 'Animals' },
  { id: 5, url: 'https://picsum.photos/seed/architecture/800/400', title: 'Architecture' },
];

export default function App() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlay, setIsAutoPlay] = useState(true);
  const [direction, setDirection] = useState(1);

  const nextSlide = useCallback(() => {
    setDirection(1);
    setCurrentIndex((prevIndex) => (prevIndex === images.length - 1 ? 0 : prevIndex + 1));
  }, []);

  const prevSlide = useCallback(() => {
    setDirection(-1);
    setCurrentIndex((prevIndex) => (prevIndex === 0 ? images.length - 1 : prevIndex - 1));
  }, []);

  const goToSlide = (index: number) => {
    setDirection(index > currentIndex ? 1 : -1);
    setCurrentIndex(index);
  };

  useEffect(() => {
    let intervalId: NodeJS.Timeout;
    if (isAutoPlay) {
      intervalId = setInterval(() => {
        nextSlide();
      }, 5000);
    }
    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [isAutoPlay, nextSlide]);

  const variants = {
    enter: (direction: number) => {
      return {
        x: direction > 0 ? 1000 : -1000,
        opacity: 0
      };
    },
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1
    },
    exit: (direction: number) => {
      return {
        zIndex: 0,
        x: direction < 0 ? 1000 : -1000,
        opacity: 0
      };
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4 font-sans">
      <div className="max-w-4xl w-full bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-100">
        <div className="p-8">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Featured Gallery</h1>
              <p className="text-gray-500 mt-1">Explore our curated collection of images</p>
            </div>
            
            {/* Auto-play Toggle */}
            <button
              onClick={() => setIsAutoPlay(!isAutoPlay)}
              className={`flex items-center gap-2 px-4 py-2 rounded-full font-medium transition-colors ${
                isAutoPlay 
                  ? 'bg-blue-50 text-blue-700 hover:bg-blue-100' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
              aria-label={isAutoPlay ? "Pause auto-play" : "Start auto-play"}
            >
              {isAutoPlay ? <Pause size={18} /> : <Play size={18} />}
              <span className="text-sm">{isAutoPlay ? 'Auto-playing' : 'Paused'}</span>
            </button>
          </div>
          
          <div className="relative h-[450px] w-full rounded-2xl overflow-hidden group bg-gray-100 shadow-inner">
            <AnimatePresence initial={false} custom={direction}>
              <motion.img
                key={currentIndex}
                src={images[currentIndex].url}
                alt={images[currentIndex].title}
                custom={direction}
                variants={variants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{
                  x: { type: "spring", stiffness: 300, damping: 30 },
                  opacity: { duration: 0.2 }
                }}
                className="absolute w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </AnimatePresence>

            {/* Navigation Buttons */}
            <button
              onClick={prevSlide}
              className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-gray-800 p-3 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-300 z-10 hover:scale-110 focus:opacity-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
              aria-label="Previous image"
            >
              <ChevronLeft size={24} />
            </button>
            <button
              onClick={nextSlide}
              className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-gray-800 p-3 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-300 z-10 hover:scale-110 focus:opacity-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
              aria-label="Next image"
            >
              <ChevronRight size={24} />
            </button>

            {/* Title Overlay */}
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-8 pt-24 z-0">
              <motion.h2 
                key={currentIndex}
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="text-white text-2xl font-semibold tracking-wide"
              >
                {images[currentIndex].title}
              </motion.h2>
            </div>

            {/* Indicators */}
            <div className="absolute bottom-6 right-8 flex space-x-2 z-10">
              {images.map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToSlide(index)}
                  className={`h-2 rounded-full transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-white/50 ${
                    index === currentIndex 
                      ? 'bg-white w-8' 
                      : 'bg-white/40 hover:bg-white/70 w-2'
                  }`}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
