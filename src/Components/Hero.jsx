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
  className="
    relative group overflow-hidden
    mt-6 sm:mt-8
    cursor-pointer
    rounded-full
    px-6 sm:px-8
    py-3.5 sm:py-4
    text-sm sm:text-base
    font-semibold
    text-black
    bg-white
    flex items-center gap-3
    shadow-[0_10px_30px_rgba(0,0,0,0.12)]
  "
>
  {/* Hover background animation */}
  <span
    className="
      absolute inset-0
      bg-[#fabd14]
      translate-x-[-100%]
      group-hover:translate-x-0
      transition-transform
      duration-500
      ease-out
    "
  />

  {/* Button content */}
  <span className="relative z-10 flex items-center gap-3">
    GET STARTED NOW

    <span
      className="
        bg-black/90
        rounded-full
        p-2
        flex items-center justify-center
        transition-all
        duration-300
        group-hover:bg-black
      "
    >
      <svg
        className="
          w-4 h-4
          text-white
          transition-transform
          duration-300
          ease-out
          -rotate-45
          group-hover:rotate-0
          group-hover:translate-x-0.5
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
