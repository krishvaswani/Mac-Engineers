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
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" },
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
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-7xl mx-auto px-4 py-12">
      {/* Card 1 - Testimonial */}
      <motion.div
        variants={cardVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        whileHover={{ scale: 1.02, y: -6 }}
        className="bg-[#aaff00] text-black rounded-3xl p-8 md:p-10 flex flex-col shadow-xl relative overflow-hidden min-h-[580px]"
      >
        <div className="flex-1 flex flex-col justify-center">
          <AnimatePresence mode="wait">
            <motion.blockquote
              key={currentIndex}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
              className="text-xl md:text-2xl font-semibold leading-tight tracking-tight mb-6"
            >
              {testimonials[currentIndex].quote}
            </motion.blockquote>
          </AnimatePresence>

          <motion.div
            key={`author-${currentIndex}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.15 }}
          >
            <p className="font-bold text-lg">
              {testimonials[currentIndex].author}
            </p>
            <p className="text-sm opacity-80 mt-1">
              {testimonials[currentIndex].role}
            </p>
          </motion.div>
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between mt-8">
          <div className="flex space-x-3">
            {testimonials.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentIndex(idx)}
                className={`w-2.5 h-2.5 rounded-full transition-all duration-300 cursor-pointer ${
                  idx === currentIndex
                    ? "bg-black scale-150"
                    : "bg-black/40 hover:bg-black/70"
                }`}
              />
            ))}
          </div>

          <div className="flex space-x-4 text-2xl">
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

        {/* Button */}
        <motion.button
          whileHover={{ y: -4 }}
          whileTap={{ scale: 0.95 }}
          className="mt-8 bg-black text-white px-8 py-4 rounded-full font-medium text-lg flex items-center justify-center gap-3 hover:shadow-xl hover:shadow-black/20"
        >
          Free Consultation
          <motion.span
            whileHover={{ x: 6 }}
            transition={{ type: "spring", stiffness: 300 }}
            className="text-xl"
          >
            →
          </motion.span>
        </motion.button>
      </motion.div>

      {/* Card 2 - Image */}
      <motion.div
        variants={cardVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        whileHover={{ scale: 1.02, y: -6 }}
        className="rounded-3xl overflow-hidden shadow-xl min-h-[580px]"
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
        whileHover={{ scale: 1.02, y: -6 }}
        className="bg-[#006400] text-white rounded-3xl p-8 md:p-10 flex flex-col justify-between shadow-xl relative overflow-hidden min-h-[580px]"
      >
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 0.1 }}
          transition={{ duration: 0.8 }}
          className="absolute -top-10 -right-10 text-9xl font-black pointer-events-none"
        >
          *
        </motion.div>

        <div className="flex-1 flex items-center">
          <h3 className="text-3xl md:text-4xl font-bold leading-tight">
            2024 Diversity, Equity, <br />
            and Inclusion <br />
            Report
          </h3>
        </div>

        <div className="text-right text-base opacity-70 mt-8">* 2025</div>
      </motion.div>
    </div>
  );
};

export default AboutUsCards;
