import { useEffect, useRef } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import { motion } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import "swiper/css";

gsap.registerPlugin(ScrollTrigger);

const reviews = [
  {
    name: "John Doe",
    year: "2026",
    text:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut ",
    author: "Elizabeth",
    location: "Chicago",
  },
  {
    name: "Rahul Singh",
    year: "2026",
    text:
      "Very smooth process and great support. Everything was clearly explained and handled professionally.",
    author: "Rahul Singh",
    location: "Delhi",
  },
  {
    name: "Amit Verma",
    year: "2026",
    text:
      "The team compared multiple options and helped me take the right decision confidently.",
    author: "Amit Verma",
    location: "Mumbai",
  },
  {
    name: "Neha Kapoor",
    year: "2026",
    text:
      "Excellent experience. Transparent advice and very responsive communication.",
    author: "Neha Kapoor",
    location: "Bangalore",
  },
  {
    name: "Rohit Mehta",
    year: "2026",
    text:
      "Professional and reliable. Would definitely recommend their services.",
    author: "Rohit Mehta",
    location: "Pune",
  },
];

export default function ReviewsCarousel() {
  const sectionRef = useRef(null);

  useEffect(() => {
    gsap.fromTo(
      sectionRef.current,
      { opacity: 0, y: 30 },
      {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: "power3.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 80%",
          once: true,
        },
      }
    );
  }, []);

  return (
    <section ref={sectionRef} className="bg-slate-50 py-16">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Heading */}
        <div className="max-w-xl mb-16">
          <h2 className="text-4xl font-semibold text-slate-900">
            What our clients say
          </h2>
          <p className="mt-4 text-slate-600">
            Trusted by professionals across industries.
          </p>
        </div>

        {/* Carousel */}
        <Swiper
          modules={[Autoplay]}
          spaceBetween={24}
          centeredSlides
          loop
          autoplay={{ delay: 3500, disableOnInteraction: false }}
          breakpoints={{
            0: { slidesPerView: 1.1 },
            640: { slidesPerView: 1.5 },
            1024: { slidesPerView: 3 },
          }}
        >
          {reviews.map((review, index) => (
            <SwiperSlide key={index}>
              <motion.div
                whileHover={{ y: -6 }}
                transition={{ duration: 0.3 }}
                className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm"
              >
                {/* Header */}
                <div className="flex justify-between items-center bg-slate-100 rounded-xl px-4 py-3 mb-4">
                  <span className="font-medium text-slate-900">
                    {review.name}
                  </span>
                  <span className="text-sm text-slate-500">
                    {review.year}
                  </span>
                </div>

                {/* Stars */}
                <div className="flex gap-1 mb-4">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <span key={i} className="text-orange-500 text-lg">★</span>
                  ))}
                </div>

                {/* Text */}
                <p className="text-slate-700 text-sm leading-relaxed">
                  {review.text}
                </p>

                {/* Footer */}
                <div className="mt-8 pt-4 border-t border-slate-200">
                  <p className="font-medium text-slate-900">
                    {review.author}
                  </p>
                  <p className="text-sm text-slate-500">
                    {review.location}
                  </p>
                </div>
              </motion.div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
}
