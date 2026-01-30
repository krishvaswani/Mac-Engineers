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
    name: "Saurabh Mishra",
    year: "2020",
    text:
      "Quick turnaround and super clear communication throughout. They compared multiple options and helped me choose the right plan without pushing anything unnecessary.",
    author: "Saurabh Mishra",
    location: "Lucknow",
  },
  {
    name: "Pooja Nair",
    year: "2018",
    text:
      "Very professional experience. Documentation was handled smoothly and I got regular updates on every step. Everything was explained in simple terms.",
    author: "Pooja Nair",
    location: "Kochi",
  },
  {
    name: "Harshita Sharma",
    year: "2023",
    text:
      "Transparent advice and responsive support even after the work was completed. The team was patient with my questions and guided me clearly.",
    author: "Harshita Sharma",
    location: "Jaipur",
  },
  {
    name: "Mohit Bansal",
    year: "2024",
    text:
      "Smooth process from start to finish. Timelines were respected and the coordination was excellent. I would definitely recommend them.",
    author: "Mohit Bansal",
    location: "Gurugram",
  },
  {
    name: "Sneha Iyer",
    year: "2025",
    text:
      "Great experience overall—fast replies, honest guidance, and no last-minute surprises. Everything was well-structured and easy to track.",
    author: "Sneha Iyer",
    location: "Bengaluru",
  },
  {
    name: "Ritesh Kulkarni",
    year: "2024",
    text:
      "They took the time to understand my requirements and suggested practical options. Really appreciated the clarity, especially around costs.",
    author: "Ritesh Kulkarni",
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
            <SwiperSlide key={index} className="h-auto">
              <motion.div
                whileHover={{ y: -6 }}
                transition={{ duration: 0.3 }}
                className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm
                           h-full min-h-[340px] flex flex-col"
              >
                {/* Header */}
                <div className="flex justify-between items-center bg-slate-100 rounded-xl px-4 py-3 mb-4">
                  <span className="font-medium text-slate-900">
                    {review.name}
                  </span>
                  <span className="text-sm text-slate-500">{review.year}</span>
                </div>

                {/* Stars */}
                <div className="flex gap-1 mb-4">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <span key={i} className="text-orange-500 text-lg">
                      ★
                    </span>
                  ))}
                </div>

                {/* Text (takes remaining height, keeps footer at bottom) */}
                <p className="text-slate-700 text-sm leading-relaxed flex-grow">
                  {review.text}
                </p>

                {/* Footer (always aligned at bottom) */}
                <div className="mt-8 pt-4 border-t border-slate-200">
                  {/* <p className="font-medium text-slate-900">{review.author}</p> */}
                  <p className="text-sm text-slate-500">{review.location}</p>
                </div>
              </motion.div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
}
