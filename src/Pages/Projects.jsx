import { useEffect, useRef, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination as SwiperPagination, Autoplay } from "swiper/modules";
import { motion } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import "swiper/css";
import "swiper/css/pagination";

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
    <div className="rounded-2xl overflow-hidden bg-white/25 backdrop-blur-xl border border-white/30 animate-pulse">
      <div className="h-56 bg-white/30" />
      <div className="p-5 space-y-3">
        <div className="h-4 w-3/4 bg-white/30 rounded" />
        <div className="h-3 w-1/2 bg-white/20 rounded" />
        <div className="h-3 w-1/3 bg-white/20 rounded" />
      </div>
    </div>
  );
}

/* ---------------- PROJECT CARD ---------------- */
function ProjectCard({ project }) {
  return (
    <div className="project-card rounded-2xl overflow-hidden bg-white/25 backdrop-blur-2xl border border-white/30 shadow-xl hover:shadow-2xl transition-all">
      <Swiper
        modules={[SwiperPagination, Autoplay]}
        pagination={{ clickable: true }}
        autoplay={{ delay: 3000 }}
        loop
        className="h-56"
      >
        {project.images.map((img, i) => (
          <SwiperSlide key={i}>
            <img
              src={img}
              alt={project.title}
              className="h-56 w-full object-cover"
            />
          </SwiperSlide>
        ))}
      </Swiper>

      <div className="p-5 cursor-pointer">
        <h3 className="text-lg font-semibold text-gray-900">
          {project.title}
        </h3>

        <div className="mt-2 text-sm text-gray-700 space-y-1">
          <p>📍 {project.location}</p>
          <p>🏠 Plot Area : {project.area}</p>
        </div>
      </div>
    </div>
  );
}

/* ---------------- PAGE ---------------- */
export default function ProjectsPage() {
  const sectionRef = useRef(null);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);

  const totalPages = Math.ceil(PROJECTS.length / ITEMS_PER_PAGE);

  const paginatedProjects = PROJECTS.slice(
    (page - 1) * ITEMS_PER_PAGE,
    page * ITEMS_PER_PAGE
  );

  /* Fake loading */
  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1500);
    return () => clearTimeout(timer);
  }, []);

  /* GSAP animation */
  useEffect(() => {
    if (!loading) {
      gsap.fromTo(
        ".project-card",
        { opacity: 0, y: 50 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
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
    <main className="min-h-screen bg-gradient-to-br from-[#f5f5f5] via-[#ededed] to-[#ffffff]">
      {/* HERO */}
      <section className="text-center py-20 px-4 ">
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
          A curated portfolio of luxury steel frame construction projects
          built with precision and excellence.
        </motion.p>
      </section>

      {/* GRID */}
      <section
        ref={sectionRef}
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16 "
      >
        <div className="
          grid gap-6
          grid-cols-2
          sm:grid-cols-2
          md:grid-cols-3
          lg:grid-cols-3
        ">
          {loading
            ? Array.from({ length: 9 }).map((_, i) => (
                <SkeletonCard key={i} />
              ))
            : paginatedProjects.map((project) => (
                <ProjectCard key={project.id} project={project} />
              ))}
        </div>

        {/* PAGINATION */}
        {!loading && totalPages > 1 && (
          <div className="flex justify-center mt-12 gap-3  ">
            {Array.from({ length: totalPages }).map((_, i) => (
              <button
                key={i}
                onClick={() => setPage(i + 1)}
                className={`h-10 w-10 rounded-full border text-sm font-medium transition
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
    </main>
  );
}
