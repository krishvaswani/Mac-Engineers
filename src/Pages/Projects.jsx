import { useEffect, useRef, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import {
  Pagination as SwiperPagination,
  Autoplay,
  Navigation,
} from "swiper/modules";
import { motion, AnimatePresence } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

gsap.registerPlugin(ScrollTrigger);

/* ---------------- DUMMY DATA ---------------- */
const PROJECTS = Array.from({ length: 18 }).map((_, i) => ({
  id: i,
  title: `Luxury Steel Frame Villa ${i + 1}`,
  location: "Dehradun, Uttarakhand",
  area: `${1400 + i * 120} SQFT`,
  images: [
    "https://images.unsplash.com/photo-1503387762-592deb58ef4e",
    "https://images.unsplash.com/photo-1523413651479-597eb2da0ad6",
    "https://images.unsplash.com/photo-1600585154340-be6161a56a0c",
  ],
}));

const ITEMS_PER_PAGE = 9;

/* ---------------- SKELETON ---------------- */
function SkeletonCard() {
  return (
    <div className="rounded-2xl bg-white/30 backdrop-blur-xl border border-white/30 animate-pulse min-h-135">
      <div className="m-4 h-80 bg-white/30 rounded-xl" />
      <div className="px-6 pt-6 pb-14 space-y-4">
        <div className="h-4 w-3/4 bg-white/30 rounded" />
        <div className="h-3 w-1/2 bg-white/20 rounded" />
        <div className="h-3 w-1/3 bg-white/20 rounded" />
      </div>
    </div>
  );
}

/* ---------------- LIGHTBOX ---------------- */
function ImageLightbox({ images, startIndex, onClose }) {
  useEffect(() => {
    const esc = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", esc);
    return () => window.removeEventListener("keydown", esc);
  }, [onClose]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-black/90 backdrop-blur-lg flex items-center justify-center"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9 }}
        animate={{ scale: 1 }}
        exit={{ scale: 0.9 }}
        transition={{ type: "spring", stiffness: 120 }}
        className="relative w-full max-w-6xl px-4"
        onClick={(e) => e.stopPropagation()}
      >
        <Swiper
          initialSlide={startIndex}
          modules={[SwiperPagination, Navigation]}
          pagination={{ clickable: true }}
          navigation
          loop
          className="rounded-2xl overflow-hidden"
        >
          {images.map((img, i) => (
            <SwiperSlide key={i}>
              <img
                src={img}
                alt=""
                className="w-full h-[80vh] object-contain bg-black"
              />
            </SwiperSlide>
          ))}
        </Swiper>

        <button
          onClick={onClose}
          className="absolute top-6 right-6 text-white text-3xl hover:scale-110 transition z-50"
        >
          ✕
        </button>
      </motion.div>
    </motion.div>
  );
}

/* ---------------- PROJECT CARD ---------------- */
function ProjectCard({ project, onImageClick }) {
  return (
    <motion.div
      whileHover={{ y: -10 }}
      transition={{ type: "spring", stiffness: 200 }}
      className="
        project-card
        rounded-2xl
        bg-white/30
        backdrop-blur-2xl
        border border-white/40
        shadow-xl
        hover:shadow-2xl
        min-h-135
        flex flex-col
        overflow-hidden
      "
    >
      {/* IMAGE SLIDER */}
      <div className="p-4 relative">
        <Swiper
          modules={[SwiperPagination, Autoplay, Navigation]}
          pagination={{ clickable: true }}
          navigation
          autoplay={{ delay: 3500 }}
          loop
          className="rounded-xl overflow-hidden project-image-swiper"
        >
          {project.images.map((img, i) => (
            <SwiperSlide key={i}>
              <div
                onClick={() => onImageClick(project.images, i)}
                className="relative group cursor-pointer"
              >
                <img
                  src={img}
                  alt={project.title}
                  className="
                    h-80 w-full object-cover
                    transition-transform duration-700
                    group-hover:scale-110
                  "
                />

                <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition flex items-center justify-center">
                  <span className="text-white text-sm tracking-wide">
                    View Gallery
                  </span>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      {/* CONTENT */}
      <div className="px-6 pt-5 pb-16 mt-auto">
        <h3 className="text-lg font-semibold text-gray-900">
          {project.title}
        </h3>

        <div className="mt-4 text-sm text-gray-700 space-y-2">
          <p>📍 {project.location}</p>
          <p>🏠 Plot Area : {project.area}</p>
        </div>
      </div>
    </motion.div>
  );
}

/* ---------------- PAGE ---------------- */
export default function ProjectsPage() {
  const sectionRef = useRef(null);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [lightbox, setLightbox] = useState({
    open: false,
    images: [],
    index: 0,
  });

  const totalPages = Math.ceil(PROJECTS.length / ITEMS_PER_PAGE);
  const paginatedProjects = PROJECTS.slice(
    (page - 1) * ITEMS_PER_PAGE,
    page * ITEMS_PER_PAGE
  );

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 1200);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    if (!loading) {
      gsap.fromTo(
        ".project-card",
        { opacity: 0, y: 60 },
        {
          opacity: 1,
          y: 0,
          duration: 0.9,
          stagger: 0.12,
          ease: "power3.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 80%",
          },
        }
      );
    }
  }, [loading, page]);

  return (
    <main className="min-h-screen bg-linear-to-br from-[#f5f5f5] via-[#ededed] to-[#ffffff]">
      {/* HERO */}
      <section className="text-center py-20 px-4">
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-3xl md:text-4xl font-bold"
        >
          Our Premium Projects
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mt-4 text-gray-600 max-w-xl mx-auto"
        >
          A curated portfolio of luxury steel frame construction projects.
        </motion.p>
      </section>

      {/* GRID */}
      <section
        ref={sectionRef}
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-24"
      >
        <div className="grid gap-10 grid-cols-2 md:grid-cols-3">
          {loading
            ? Array.from({ length: 9 }).map((_, i) => (
                <SkeletonCard key={i} />
              ))
            : paginatedProjects.map((project) => (
                <ProjectCard
                  key={project.id}
                  project={project}
                  onImageClick={(images, index) =>
                    setLightbox({ open: true, images, index })
                  }
                />
              ))}
        </div>

        {/* PAGINATION */}
        {!loading && totalPages > 1 && (
          <div className="flex justify-center mt-20 gap-4">
            {Array.from({ length: totalPages }).map((_, i) => (
              <button
                key={i}
                onClick={() => setPage(i + 1)}
                className={`h-11 w-11 rounded-full border transition
                  ${
                    page === i + 1
                      ? "bg-black text-white"
                      : "bg-white hover:bg-black hover:text-white"
                  }
                `}
              >
                {i + 1}
              </button>
            ))}
          </div>
        )}
      </section>

      {/* LIGHTBOX */}
      <AnimatePresence>
        {lightbox.open && (
          <ImageLightbox
            images={lightbox.images}
            startIndex={lightbox.index}
            onClose={() =>
              setLightbox({ open: false, images: [], index: 0 })
            }
          />
        )}
      </AnimatePresence>
    </main>
  );
}
