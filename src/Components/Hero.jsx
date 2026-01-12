import { motion } from "framer-motion";
import Herovideo from "../Assets/HvAc.mp4";

export default function Hero() {
  return (
    <section
      className="
        relative mx-5 my-0 rounded-3xl overflow-hidden
        h-[85vh]
        min-h-150
        max-h-225
        sm:h-[80vh]
        md:h-[90vh]
      "
    >
      {/* VIDEO BACKGROUND (NO ANIMATION) */}
      <video
        autoPlay
        muted
        loop
        playsInline
        className="absolute inset-0 w-full h-full object-cover"
      >
        <source src={Herovideo} type="video/mp4" />
      </video>

      {/* OVERLAY */}
      <div className="absolute inset-0 bg-black/50" />

      {/* CONTENT */}
      <div className="relative z-20 h-full flex items-center">
        <motion.div
          className="px-6 sm:px-10 lg:px-16 max-w-3xl text-white"
          initial="hidden"
          animate="visible"
          variants={{
            hidden: {},
            visible: {
              transition: {
                staggerChildren: 0.15,
              },
            },
          }}
        >
          {/* HEADING */}
          <motion.h1
            variants={{
              hidden: { opacity: 0, y: 40 },
              visible: { opacity: 1, y: 0 },
            }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="
              font-bold leading-tight
              text-[clamp(2rem,4.5vw,3.75rem)]
            "
          >
            Affordable <br />
            HVAC Solution <br />
            in New Texas.
          </motion.h1>

          {/* BUTTON */}
          <motion.button
            variants={{
              hidden: { opacity: 0, y: 30 },
              visible: { opacity: 1, y: 0 },
            }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="group mt-6 sm:mt-8 cursor-pointer bg-white text-black px-5 sm:px-6 py-3 sm:py-4 rounded-full flex items-center gap-3 text-sm sm:text-base font-medium"
          >
            GET STARTED NOW

            <span className="bg-yellow-500 rounded-full p-2 flex items-center justify-center">
              <svg
                className="
                  w-4 h-4 text-white
                  transition-transform duration-300 ease-out
                  -rotate-45 group-hover:rotate-0
                "
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M5 12h14" />
                <path d="M13 6l6 6-6 6" />
              </svg>
            </span>
          </motion.button>

          {/* DESCRIPTION */}
          <motion.p
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: { opacity: 1, y: 0 },
            }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="mt-4 sm:mt-6 text-xs sm:text-sm text-gray-200 max-w-md"
          >
            Expert HVAC solutions for homes & businesses across New Texas.
          </motion.p>
        </motion.div>
      </div>
    </section>
  );
}
