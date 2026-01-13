import { motion } from "framer-motion";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules";

import "swiper/css";

// Images
import industry1 from "../Assets/industry-1.png";
import industry2 from "../Assets/about-img.png";
import industry3 from "../Assets/industry-3.png";

// DATA
const industries = [
  { title: "Industrial & Manufacturing Facilities", image: industry1 },
  { title: "Commercial Buildings & Complexes", image: industry2 },
  { title: "Healthcare & Clean Environments", image: industry3 },
  { title: "Food Processing & Cold Chain", image: industry1 },
  { title: "Hospitality & Commercial Kitchens", image: industry2 },
  { title: "Pharmaceutical & Laboratory Plants", image: industry3 },
  { title: "Institutional & Public Facilities", image: industry1 },
  { title: "MEP Engineering & Projects", image: industry2 },
];

export default function IndustriesSection() {
  return (
    <section className="py-20 md:py-28 bg-slate-50 relative">
      <div className="max-w-7xl mx-auto px-6 relative">

        {/* Header */}
        <div className="mb-14 max-w-2xl">
          <h2 className="text-4xl md:text-5xl font-semibold text-slate-900">
            Industries We Serve
          </h2>
          <p className="mt-4 text-slate-600">
            Engineered air management solutions tailored for performance,
            compliance, and operational excellence across industries.
          </p>
        </div>

        {/* Desktop Navigation Arrows */}
        <div className="hidden lg:flex items-center gap-4 absolute right-6 top-16 z-20">
          <button
            className="
              industries-prev
              w-12 h-12
              rounded-full
              bg-white
              shadow-[0_10px_25px_rgba(0,0,0,0.15)]
              flex items-center justify-center
              hover:bg-[#fabd14]
              transition-colors
            "
          >
            <svg
              className="w-5 h-5 text-black"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M15 18l-6-6 6-6" />
            </svg>
          </button>

          <button
            className="
              industries-next
              w-12 h-12
              rounded-full
              bg-white
              shadow-[0_10px_25px_rgba(0,0,0,0.15)]
              flex items-center justify-center
              hover:bg-[#fabd14]
              transition-colors
            "
          >
            <svg
              className="w-5 h-5 text-black"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M9 18l6-6-6-6" />
            </svg>
          </button>
        </div>

        {/* Slider */}
        <Swiper
          modules={[Navigation, Autoplay]}
          spaceBetween={30}
          loop
          autoplay={{
            delay: 4000,
            disableOnInteraction: false,
          }}
          navigation={{
            prevEl: ".industries-prev",
            nextEl: ".industries-next",
          }}
          breakpoints={{
            0: { slidesPerView: 1 },
            640: { slidesPerView: 1.2 },
            768: { slidesPerView: 2 },
            1024: { slidesPerView: 3 },
            1280: { slidesPerView: 4 },
          }}
        >
          {industries.map((item, index) => (
            <SwiperSlide key={index}>
              <IndustryCard item={item} />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
}

/* CARD */
function IndustryCard({ item }) {
  return (
    <motion.div
      whileHover={{ y: -8 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className=" py-10
        group relative h-95
        rounded-3xl overflow-hidden
        bg-white
        shadow-[0_20px_50px_rgba(0,0,0,0.1)]
      "
    >
      <img
        src={item.image}
        alt={item.title}
        className="
          absolute inset-0 w-full h-full object-cover
          transition-transform duration-700
          group-hover:scale-110
        "
        draggable="false"
        loading="lazy"
      />

      <div className="absolute inset-0 bg-linear-to-t from-black/70 via-black/30 to-transparent" />

      <div className="relative z-10 p-6 flex flex-col justify-end h-full">
        <span className="text-xs uppercase tracking-widest text-[#fabd14] mb-2">
          Industry
        </span>

        <h3 className="text-lg font-semibold text-white leading-snug">
          {item.title}
        </h3>
      </div>
    </motion.div>
  );
}
