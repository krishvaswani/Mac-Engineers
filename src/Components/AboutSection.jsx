import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import aboutMachine from "../Assets/about-img.png";

gsap.registerPlugin(ScrollTrigger);

export default function AboutSection() {
  const cardRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(cardRef.current, {
        y: 120,
        opacity: 0,
        duration: 1,
        ease: "power3.out",
        scrollTrigger: {
          trigger: cardRef.current,
          start: "top 85%",
          toggleActions: "play none none none",
        },
      });
    }, cardRef);

    return () => ctx.revert();
  }, []);

  return (
    <section className="py-10">
      <div
        ref={cardRef}
        className="
          relative mx-5
          rounded-[32px]
          bg-white
          shadow-[0_40px_90px_rgba(0,0,0,0.12)]
          overflow-hidden
        "
      >
        <div className="grid lg:grid-cols-2 gap-16 items-center px-8 py-14 md:px-16 md:py-12">
          
          {/* LEFT CONTENT */}
          <div className="max-w-xl">
            {/* Small badge */}
            <span className="inline-block mb-4 px-4 py-1.5 rounded-full bg-[#fabd14]/15 text-[#c99500] text-xs font-semibold tracking-wide uppercase">
              About Us
            </span>

            <h2 className="text-3xl md:text-4xl lg:text-[42px] font-semibold leading-tight text-slate-900 mb-6">
              Engineering Air <br />
              <span className="text-[#fabd14]">Solutions That Perform</span>
            </h2>

            <p className="text-slate-600 leading-relaxed text-sm md:text-base text-justify">
              <strong>Mac Engineers</strong> is a leading manufacturer of
              industrial air distribution and air treatment systems,
              established in 2018 in Hastsal, Delhi. We specialize in the
              design and manufacturing of high-performance industrial air
              cooling, air conditioning systems, air handling units, air
              washer units, and advanced wet & dry scrubbers for pollution
              control.
              <br /><br />
              Our portfolio also includes inline duct fans and a complete
              range of air distribution components diffusers, grilles,
              dampers, louvers, and jet nozzles ensuring efficient airflow
              across industrial and commercial spaces.
            </p>

            {/* CTA BUTTON */}
            <button
              className="
                relative group overflow-hidden
                mt-10
                inline-flex items-center gap-3
                rounded-full
                bg-white text-black
                px-7 py-3.5
                font-semibold
                shadow-[0_10px_30px_rgba(0,0,0,0.15)]
              "
            >
              {/* Hover bg */}
              <span
                className="
                  absolute inset-0
                  bg-[#fabd14]
                  -translate-x-full
                  group-hover:translate-x-0
                  transition-transform
                  duration-500
                  ease-out
                "
              />

              <span className="relative z-10 flex items-center gap-3">
                Discover Our Expertise

                <span
                  className="
                    bg-black/90
                    rounded-full
                    p-2
                    transition-all
                    duration-300
                    group-hover:bg-black
                  "
                >
                  <svg
                    className="
                      w-4 h-4 text-white
                      transition-transform duration-300
                      -rotate-45 group-hover:rotate-0
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
            </button>
          </div>

          {/* RIGHT IMAGE */}
          <div className="relative flex justify-center lg:justify-center">
            <img
              src={aboutMachine}
              alt="Industrial Machine"
              className="
                w-full max-w-md rounded-3xl
                drop-shadow-[0_30px_60px_rgba(0,0,0,0.15)]
                select-none
              "
              draggable="false"
              loading="lazy"
            />

            {/* Soft glow */}
            <div className="absolute -inset-10 bg-[#fabd14]/20 blur-[160px] rounded-full -z-10" />
          </div>

        </div>
      </div>
    </section>
  );
}
