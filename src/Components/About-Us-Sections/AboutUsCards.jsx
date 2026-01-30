// components/AboutUsCards.jsx
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const testimonials = [
  {
    quote:
      "Quick turnaround and super clear communication throughout. They compared multiple options and helped me choose the right plan without pushing anything unnecessary.",
    author: "Saurabh Mishra",
    role: "Lucknow",
  },
  {
    quote:
      "Very professional experience. Documentation was handled smoothly and I got regular updates on every step. Everything was explained in simple terms.",
    author: "Pooja Nair",
    role: "Kochi",
  },
  {
    quote:
      "Transparent advice and responsive support even after the work was completed. The team was patient with my questions and guided me clearly.",
    author: "Harshita Sharma",
    role: "Jaipur",
  },
  {
    quote:
      "Smooth process from start to finish. Timelines were respected and the coordination was excellent. I would definitely recommend them to anyone looking for reliable service.",
    author: "Mohit Bansal",
    role: "Gurugram",
  },
  {
    quote:
      "Great experience overall—fast replies, honest guidance, and no last-minute surprises. Everything was well-structured and easy to track.",
    author: "Sneha Iyer",
    role: "Bengaluru",
  },
  {
    quote:
      "They took the time to understand my requirements and suggested practical options. Really appreciated the clarity, especially around costs and next steps.",
    author: "Ritesh Kulkarni",
    role: "Pune",
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
              aria-label="Previous testimonial"
            >
              ←
            </motion.button>
            <motion.button
              whileTap={{ scale: 0.85 }}
              onClick={nextSlide}
              className="cursor-pointer"
              aria-label="Next testimonial"
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
          src="https://firebasestorage.googleapis.com/v0/b/mac-engineers.firebasestorage.app/o/Assets%2Fhvasc.png?alt=media&token=d001efcc-473e-4670-b58c-fb22e6bfce2c"
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
            Our Foundation of
            <br />
            Quality & <br />
            Reliability
          </h3>
        </div>

        <div className="text-right text-xs md:text-sm opacity-70 mt-4">
          * 2026
        </div>
      </motion.div>
    </div>
  );
};

export default AboutUsCards;
