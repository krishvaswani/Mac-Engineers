import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const stats = [
  { value: 86, suffix: "%", label: "Completion rate" },
  { value: 2512, suffix: "", label: "Projects delivered" },
  { value: 93, suffix: "%", label: "Happy clients" },
  { value: 79, suffix: "%", label: "Yearly growth" },
];

export default function StatsSection() {
  const sectionRef = useRef(null);
  const numbersRef = useRef([]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      numbersRef.current.forEach((el, index) => {
        const counter = { val: 0 };

        ScrollTrigger.create({
          trigger: sectionRef.current,
          start: "top 75%",
          once: true, // run only once
          onEnter: () => {
            gsap.to(counter, {
              val: stats[index].value,
              duration: 1.6,
              ease: "power3.out",
              onUpdate: () => {
                el.textContent =
                  Math.floor(counter.val) + stats[index].suffix;
              },
            });
          },
        });
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="bg-white py-16  border-slate-200"
    >
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-10 md:gap-16 text-center">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{
                duration: 0.6,
                delay: index * 0.1,
                ease: "easeOut",
              }}
              className="relative"
            >
              {/* Divider */}
              {index !== 0 && (
                <span className="hidden md:block absolute -left-8 top-1/2 -translate-y-1/2 w-px h-16 bg-slate-300" />
              )}

              {/* Number */}
              <div
                ref={(el) => (numbersRef.current[index] = el)}
                className="text-4xl sm:text-5xl md:text-6xl font-semibold text-slate-900"
              >
                0{stat.suffix}
              </div>

              {/* Label */}
              <p className="mt-3 md:mt-4 text-slate-500 text-xs sm:text-sm tracking-wide">
                {stat.label}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
