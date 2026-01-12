// components/AboutUsCards.jsx
import React, { useState } from 'react';

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

const AboutUsCards = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-7xl mx-auto px-4 py-12">
      {/* Card 1 - Modern Minimal Testimonial - fixed height */}
      <div className="bg-[#aaff00] text-black rounded-3xl p-8 md:p-10 flex flex-col shadow-xl transition-all duration-300 hover:shadow-2xl hover:scale-[1.02] group relative overflow-hidden min-h-[580px] h-full">
        {/* Testimonial content - smaller fonts */}
        <div className="flex-1 flex flex-col justify-center">
          <blockquote className="text-xl md:text-2xl font-semibold leading-tight tracking-tight mb-6 transition-opacity duration-500">
            {testimonials[currentIndex].quote}
          </blockquote>

          <div>
            <p className="font-bold text-lg">{testimonials[currentIndex].author}</p>
            {testimonials[currentIndex].role && (
              <p className="text-sm opacity-80 mt-1">{testimonials[currentIndex].role}</p>
            )}
          </div>
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
                aria-label={`Go to testimonial ${idx + 1}`}
              />
            ))}
          </div>

          <div className="flex space-x-4">
            <button
              onClick={prevSlide}
              className="text-black hover:text-gray-800 text-2xl font-light transition-colors duration-200 cursor-pointer"
              aria-label="Previous testimonial"
            >
              ←
            </button>
            <button
              onClick={nextSlide}
              className="text-black hover:text-gray-800 text-2xl font-light transition-colors duration-200 cursor-pointer"
              aria-label="Next testimonial"
            >
              →
            </button>
          </div>
        </div>

        {/* Button */}
        <button
          className="mt-8 bg-black text-white px-8 py-4 rounded-full font-medium text-lg flex items-center justify-center gap-3 group-hover:bg-gray-900 transition-all duration-300 hover:shadow-xl hover:shadow-black/20 transform hover:-translate-y-1 active:scale-95 cursor-pointer"
        >
          Free Consultation
          <span className="text-xl group-hover:translate-x-2 transition-transform">→</span>
        </button>
      </div>

      {/* Card 2 - Image - fixed height */}
      <div className="rounded-3xl overflow-hidden shadow-xl transition-all duration-300 hover:shadow-2xl hover:scale-[1.02] min-h-[580px] h-full">
        <img
          src="https://media.istockphoto.com/id/1289220781/photo/portrait-of-happy-smiling-woman-at-desk.jpg?s=612x612&w=0&k=20&c=FtC05luuxRpiKRj5F84e2CiPf0h_ZuX6o7o5JwlNaJM="
          alt="Professional smiling woman in modern office"
          className="w-full h-full object-cover"
        />
      </div>

      {/* Card 3 - Report - fixed height */}
      <div className="bg-[#006400] text-white rounded-3xl p-8 md:p-10 flex flex-col justify-between shadow-xl transition-all duration-300 hover:shadow-2xl hover:scale-[1.02] relative overflow-hidden min-h-[580px] h-full">
        <div className="absolute -top-10 -right-10 text-9xl font-black opacity-10 pointer-events-none">
          *
        </div>

        <div className="flex-1 flex items-center">
          <h3 className="text-3xl md:text-4xl font-bold leading-tight tracking-tight">
            2024 Diversity, Equity, <br />
            and Inclusion <br />
            Report
          </h3>
        </div>

        <div className="text-right text-base opacity-70 mt-8">* 2025</div>
      </div>
    </div>
  );
};

export default AboutUsCards;