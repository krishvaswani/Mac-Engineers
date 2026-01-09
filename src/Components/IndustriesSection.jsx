import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

// ✅ IMPORT IMAGES PROPERLY
import industry1 from "../Assets/industry-1.png";
import industry2 from "../Assets/about-img.png";
import industry3 from "../Assets/industry-3.png";

// DATA
const industries = [
  {
    category: "INDUSTRY",
    date: "Manufacturing",
    title: "Advanced Industrial Air Cooling Solutions",
    image: industry1,
  },
  {
    category: "INDUSTRY",
    date: "Infrastructure",
    title: "High-Performance Ventilation Systems",
    image: industry2,
  },
  {
    category: "INDUSTRY",
    date: "Healthcare",
    title: "Clean Air & Filtration for Critical Environments",
    image: industry3,
  },
];

export default function IndustriesSection() {
  const sectionRef = useRef(null);

  /* 🔥 Scroll position */
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start 90%", "end 60%"],
  });

  /* 🔥 Scroll-linked transforms */
  const sectionY = useTransform(scrollYProgress, [0, 1], [120, 0]);
  const sectionOpacity = useTransform(scrollYProgress, [0, 0.4], [0, 1]);

  return (
    <section ref={sectionRef} className="pb-20">
      <motion.div
        style={{ y: sectionY, opacity: sectionOpacity }}
        className="max-w-7xl mx-auto px-6"
      >
        {/* Header */}
        <div className="mb-20">
          <h2 className="text-4xl md:text-5xl font-semibold text-slate-900">
            Industries We Serve
          </h2>
          <p className="mt-4 text-slate-600 max-w-2xl">
            Tailored air management and cooling solutions engineered for
            performance, efficiency, and reliability.
          </p>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {industries.map((item, index) => (
            <IndustryCard key={index} item={item} />
          ))}
        </div>
      </motion.div>
    </section>
  );
}

/* 🔥 Individual card */
function IndustryCard({ item }) {
  const cardRef = useRef(null);

  const { scrollYProgress } = useScroll({
    target: cardRef,
    offset: ["start 95%", "end 70%"],
  });

  const y = useTransform(scrollYProgress, [0, 1], [80, 0]);
  const opacity = useTransform(scrollYProgress, [0, 0.6], [0, 1]);

  return (
    <motion.div
      ref={cardRef}
      style={{ y, opacity }}
      className="group bg-white rounded-2xl overflow-hidden
        shadow-[0_20px_40px_rgba(0,0,0,0.08)]
        hover:shadow-[0_30px_60px_rgba(0,0,0,0.12)]
        transition-shadow"
    >
      {/* Image */}
      <div className="relative h-90 overflow-hidden">
        <motion.img
          src={item.image}
          alt={item.title}
          className="w-full h-full object-cover"
          whileHover={{ scale: 1.05 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          loading="lazy"
          draggable="false"
        />
      </div>

      {/* Content */}
      <div className="p-8">
        <div className="flex items-center gap-3 text-xs uppercase tracking-wider text-slate-500 mb-4">
          <span>{item.category}</span>
          <span className="w-1 h-1 rounded-full bg-slate-400" />
          <span>{item.date}</span>
        </div>

        <h3 className="text-xl md:text-2xl font-semibold text-slate-900 leading-snug">
          {item.title}
        </h3>
      </div>
    </motion.div>
  );
}
