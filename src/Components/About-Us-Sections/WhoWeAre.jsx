import { motion, useMotionValue, useTransform, animate } from "framer-motion";
import { useEffect } from "react";

export default function WhoWeAre() {
  return (
    <section className="bg-[#faf9f6] py-24">
      <div className="max-w-7xl mx-auto px-4">

        {/* TAG */}
        <span
          className="inline-block mb-6 px-4 py-1.5 text-xs tracking-wide
          border border-neutral-300 rounded-full text-neutral-600"
        >
          WHO WE ARE
        </span>

        {/* HEADING */}
        <h2
          className="text-[40px] md:text-[48px] lg:text-[56px]
          font-normal  leading-15 text-[#1f3d34] max-w-4xl"
        >
          A Trusted Partner <br />
          Committed to Your{" "}
          <span className="text-[#fbba19]">Financial Success</span>
        </h2>

        {/* IMAGE */}
        <div className="mt-14 rounded-[28px] overflow-hidden">
          <img
            src="https://images.unsplash.com/photo-1521737604893-d14cc237f11d"
            alt="Team discussion"
            className="w-full h-65 sm:h-90 md:h-105 lg:h-130
            object-cover"
          />
        </div>

        {/* STATS */}
        <div
          className="mt-8 grid grid-cols-2 md:grid-cols-4"
        >
          <Stat
            value={28.9}
            decimals={1}
            prefix="$"
            suffix="M"
            label="Assets Under Management"
            
          />
          <Stat
            value={6}
            prefix="$"
            suffix="bn"
            label="Saved for Clients Annually"
          />
          <Stat
            value={90}
            suffix="%"
            label="Repeat Clients or Referrals"
          />
          <Stat
            value={120}
            suffix="+"
            label="Professionals"
          />
        </div>

      </div>
    </section>
  );
}

/* ---------------- STAT WITH REAL COUNT-UP ---------------- */

function Stat({
  value,
  prefix = "",
  suffix = "",
  label,
  decimals = 0,
  noBorder = false,
}) {
  const motionValue = useMotionValue(0);
  const rounded = useTransform(motionValue, (latest) =>
    latest.toFixed(decimals)
  );

  useEffect(() => {
    const controls = animate(motionValue, value, {
      duration: 4,
      ease: "easeOut",
    });

    return controls.stop;
  }, [motionValue, value]);

  return (
    <div
      className={`py-4 px-6 ${
        !noBorder ? "md:border-l border-neutral-200" : ""
      }`}
    >
      {/* NUMBER */}
      <div
        className="inline-flex items-center gap-1 px-4 py-2
        rounded-xl bg-white shadow-sm"
      >
        {prefix && (
          <span className="text-[#fbba19] text-2xl font-semibold">
            {prefix}
          </span>
        )}

        <motion.span
          className="text-3xl font-semibold text-black"
        >
          {rounded}
        </motion.span>

        {suffix && (
          <span className="text-[#fbba19] text-3xl font-semibold">
            {suffix}
          </span>
        )}
      </div>

      {/* LABEL */}
      <p
        className="mt-3 text-[11px] uppercase 
        text-neutral-500 "
      >
        {label}
      </p>
    </div>
  );
}
