// components/AboutUsCards.jsx
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const testimonials = [
  {
    quote:
      "Our purpose is to help people and organizations dream bigger, move faster, and build better tomorrows for all.",
    author: "John Smith",
    role: "CEO / Founder",
  },
  {
    quote:
      "Working with this team transformed how we approach inclusion and growth — highly recommended!",
    author: "Sarah Johnson",
    role: "HR Director",
  },
  {
    quote:
      "The best consulting experience we've had — real impact, real results.",
    author: "Michael Chen",
    role: "CTO",
  },
];

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" },
  },
};

const AboutUsCards = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextSlide = () =>
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);

  const prevSlide = () =>
    setCurrentIndex(
      (prev) => (prev - 1 + testimonials.length) % testimonials.length
    );

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-5 max-w-7xl mx-auto px-4 py-10">
      {/* Card 1 - Testimonial */}
      <motion.div
        variants={cardVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        whileHover={{ scale: 1.02, y: -4 }}
        className="bg-[#fabd15] text-black rounded-3xl 
                   p-6 md:p-8 
                   flex flex-col shadow-xl relative overflow-hidden
                   min-h-95 md:min-h-115"
      >
          <h1 className="text-2xl mb-12">Testimonials</h1>
        <div className="flex-1 flex flex-col justify-between">
          <AnimatePresence mode="wait">
            <motion.blockquote
              key={currentIndex}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.35 }}
              className="text-base sm:text-lg md:text-xl font-semibold leading-snug mb-4"
            >
              {testimonials[currentIndex].quote}
            </motion.blockquote>
          </AnimatePresence>

          <motion.div
            key={`author-${currentIndex}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
          >
            <p className="font-bold text-sm md:text-base">
              {testimonials[currentIndex].author}
            </p>
            <p className="text-xs md:text-sm opacity-80 mt-0.5">
              {testimonials[currentIndex].role}
            </p>
          </motion.div>
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between mt-6">
          <div className="flex space-x-2">
            {testimonials.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentIndex(idx)}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  idx === currentIndex
                    ? "bg-black scale-125"
                    : "bg-black/40 hover:bg-black/70"
                }`}
              />
            ))}
          </div>

          <div className="flex space-x-3 text-xl">
            <motion.button
              whileTap={{ scale: 0.85 }}
              onClick={prevSlide}
              className="cursor-pointer"
            >
              ←
            </motion.button>
            <motion.button
              whileTap={{ scale: 0.85 }}
              onClick={nextSlide}
              className="cursor-pointer"
            >
              →
            </motion.button>
          </div>
        </div>
      </motion.div>

      {/* Card 2 - Image */}
      <motion.div
        variants={cardVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        whileHover={{ scale: 1.02, y: -4 }}
        className="rounded-3xl overflow-hidden shadow-xl
                   h-65 sm:h-80 md:h-auto
                   md:min-h-115"
      >
        <img
          src="https://media.istockphoto.com/id/1289220781/photo/portrait-of-happy-smiling-woman-at-desk.jpg?s=612x612&w=0&k=20&c=FtC05luuxRpiKRj5F84e2CiPf0h_ZuX6o7o5JwlNaJM="
          alt="Professional smiling woman"
          className="w-full h-full object-cover"
        />
      </motion.div>

      {/* Card 3 - Report */}
      <motion.div
        variants={cardVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        whileHover={{ scale: 1.02, y: -4 }}
        className="bg-[#facd15] text-white rounded-3xl 
                   p-6 md:p-8 
                   flex flex-col justify-between shadow-xl relative overflow-hidden
                   min-h-80 md:min-h-115"
      >
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 0.08 }}
          transition={{ duration: 0.7 }}
          className="absolute -top-8 -right-8 text-8xl font-black pointer-events-none"
        >
          *
        </motion.div>

        <div className="flex-1 flex items-center">
          <h3 className="text-xl sm:text-2xl md:text-3xl font-bold leading-tight">
            2024 Diversity, Equity, <br />
            and Inclusion <br />
            Report
          </h3>
        </div>

        <div className="text-right text-xs md:text-sm opacity-70 mt-4">
          * 2025
        </div>
      </motion.div>
    </div>
  );
};

export default AboutUsCards;
