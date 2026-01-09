import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// ✅ IMPORT IMAGES
import project1 from "../Assets/project-1.png";
import project2 from "../Assets/project-2.png";
import project3 from "../Assets/project-3.png";
import project4 from "../Assets/project-4.png";

gsap.registerPlugin(ScrollTrigger);

// DATA
const projects = [
  {
    title: "Aldan Branding",
    year: "2025",
    image: project1,
  },
  {
    title: "Aldan Branding",
    year: "2025",
    image: project2,
  },
  {
    title: "Aldan Branding",
    year: "2025",
    image: project3,
  },
  {
    title: "Aldan Branding",
    year: "2026",
    image: project4,
  },
];

export default function ProjectsSection() {
  const sliderRef = useRef(null);
  const cardsRef = useRef([]);

  useEffect(() => {
    cardsRef.current.forEach((card) => {
      if (!card) return;

      gsap.fromTo(
        card.querySelector("img"),
        { y: 40 },
        {
          y: -40,
          ease: "none",
          scrollTrigger: {
            trigger: card,
            start: "top bottom",
            end: "bottom top",
            scrub: true,
          },
        }
      );
    });
  }, []);

  return (
    <section className="bg-white py-16 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true }}
          className="mb-10"
        >
          <h2 className="text-4xl md:text-5xl font-semibold text-slate-900">
            Selected Projects
          </h2>
          <p className="mt-3 text-slate-600 max-w-xl">
            A curated selection of work crafted with clarity and purpose.
          </p>
        </motion.div>

        {/* Slider */}
        <motion.div
          ref={sliderRef}
          className="cursor-grab overflow-hidden"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <motion.div
            drag="x"
            dragConstraints={sliderRef}
            dragElastic={0.12}
            className="flex gap-6"
          >
            {projects.map((project, i) => (
              <motion.div
                key={i}
                ref={(el) => (cardsRef.current[i] = el)}
                className="
                  min-w-[85%]
                  sm:min-w-[48%]
                  lg:min-w-[32%]
                  bg-slate-50 border border-slate-200
                  rounded-3xl overflow-hidden
                "
                whileHover={{ y: -6 }}
                transition={{ type: "spring", stiffness: 260 }}
              >
                {/* Image */}
                <div className="relative h-[320px] md:h-[420px] overflow-hidden">
                  <img
                    src={project.image}
                    alt={project.title}
                    className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                    loading="lazy"
                    draggable="false"
                  />

                  {/* Logo */}
                  <div className="absolute top-6 left-6 text-white font-semibold drop-shadow">
                    Logoipsum
                  </div>
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between px-6 py-5 bg-white">
                  <span className="text-slate-900 font-medium">
                    {project.title}
                  </span>
                  <span className="text-slate-500 text-sm">
                    {project.year}
                  </span>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>

      </div>
    </section>
  );
}
