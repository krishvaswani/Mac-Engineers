import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useNavigate } from "react-router-dom";

// IMAGES
import project1 from "../Assets/project-1.png";
import project2 from "../Assets/project-2.png";
import project3 from "../Assets/project-3.png";
import project4 from "../Assets/project-4.png";

gsap.registerPlugin(ScrollTrigger);

const projects = [
  { title: "Aldan Branding", year: "2025", image: project1 },
  { title: "Aldan Branding", year: "2025", image: project2 },
  { title: "Aldan Branding", year: "2025", image: project3 },
  { title: "Aldan Branding", year: "2026", image: project4 },
];

export default function ProjectsSection() {
  const sliderRef = useRef(null);
  const trackRef = useRef(null);
  const cardsRef = useRef([]);
  const navigate = useNavigate();

  // GSAP image parallax
  useEffect(() => {
    const triggers = [];

    cardsRef.current.forEach((card) => {
      if (!card) return;

      const img = card.querySelector("img");

      const tween = gsap.fromTo(
        img,
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

      triggers.push(tween);
    });

    return () => {
      triggers.forEach((t) => t.scrollTrigger?.kill());
    };
  }, []);

  return (
    <section className="bg-white py-10">
      <div className="max-w-7xl mx-auto px-6">

        {/* HEADER ROW */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true }}
          className="mb-12 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
        >
          <div>
            <h2 className="text-4xl md:text-5xl font-semibold text-slate-900">
              Selected Projects
            </h2>
            <p className="mt-3 text-slate-600 max-w-xl">
              A curated selection of work crafted with clarity and purpose.
            </p>
          </div>

          {/* VIEW MORE BUTTON */}
          <button
            onClick={() => navigate("/projects")}
            className="
              shrink-0
              px-6 py-3
              rounded-full
              border border-slate-900
              text-sm font-medium
              text-slate-900
              hover:bg-slate-900 hover:text-white
              transition-all
              cursor-pointer
            "
          >
            View More
          </button>
        </motion.div>

        {/* SLIDER */}
        <motion.div
          ref={sliderRef}
          className="overflow-hidden py-10 "
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <motion.div
            ref={trackRef}
            drag="x"
            dragConstraints={sliderRef}
            dragElastic={0.08}
            dragMomentum={true}
            whileTap={{ cursor: "grabbing" }}
            className="flex gap-6 cursor-grab"
          >
            {projects.map((project, i) => (
              <motion.div
                key={i}
                ref={(el) => (cardsRef.current[i] = el)}
                className="
                  min-w-[85%]
                  sm:min-w-[48%]
                  lg:min-w-[32%]
                  bg-slate-50
                  border border-slate-200
                  rounded-3xl
                  overflow-hidden
                  transition-shadow duration-300
                  hover:shadow-xl
                "
              >
                {/* IMAGE */}
                <div className="relative h-80 md:h-105 overflow-hidden">
                  <motion.img
                    src={project.image}
                    alt={project.title}
                    loading="lazy"
                    draggable="false"
                    className="w-full h-full object-cover"
                    whileHover={{ scale: 1.06 }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                  />

                  <div className="absolute top-6 left-6 text-white font-semibold drop-shadow">
                    Logoipsum
                  </div>
                </div>

                {/* FOOTER */}
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
