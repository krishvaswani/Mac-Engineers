import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// ✅ IMPORT IMAGE PROPERLY
import aboutMachine from "../Assets/about-img.png";

gsap.registerPlugin(ScrollTrigger);

export default function AboutSection() {
  const cardRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(cardRef.current, {
        y: 120,
        opacity: 0,
        duration: 0.9,
        ease: "power3.out",
        scrollTrigger: {
          trigger: cardRef.current,
          start: "top 85%",
          toggleActions: "play none none none", // run once
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
          rounded-3xl m-5 bg-white
          shadow-[0_30px_80px_rgba(0,0,0,0.12)]
          will-change-transform
        "
      >
        <div className="grid md:grid-cols-2 gap-14 items-center p-12 md:p-16">
          
          {/* LEFT CONTENT */}
          <div className="text-slate-900">
            <h2 className="text-3xl md:text-4xl font-semibold mb-6">
              About <span className="text-[#f6bd19]">Mac Engineers</span>
            </h2>

            <p className="text-slate-600 leading-relaxed text-justify text-sm md:text-base">
              Mac Engineers is a leading manufacturer of industrial air
              distribution and air treatment systems, established in 2018
              in Hastsal, Delhi. We specialize in the design and manufacturing
              of high-performance industrial air cooling and air conditioning
              systems, air handling units, air washer units, and advanced
              wet and dry scrubbers for effective pollution control.
              <br /><br />
              Our product portfolio also includes cabinet and circular type
              inline duct fans, along with a complete range of air
              distribution components such as diffusers, grilles, dampers,
              louvers, and jet nozzles ensuring efficient airflow
              management across industrial and commercial spaces.
            </p>

            <button className="mt-8 fancy-outline">
              Discover Our Expertise →
            </button>
          </div>

          {/* RIGHT IMAGE */}
          <div className="relative flex justify-center">
            <img
              src={aboutMachine}
              alt="Industrial Machine"
              className="max-w-full w-105 drop-shadow-[0_25px_50px_rgba(0,0,0,0.15)]"
              draggable="false"
              loading="lazy"
            />

            {/* soft accent glow */}
            <div className="absolute inset-0 bg-lime-400/15 blur-[140px] rounded-full -z-10" />
          </div>

        </div>
      </div>
    </section>
  );
}
