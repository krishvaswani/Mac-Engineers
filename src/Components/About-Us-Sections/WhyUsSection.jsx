import { motion } from "framer-motion";
import { ArrowUpRight, User } from "lucide-react";

export default function WhyUsSection() {
  return (
    <section className="bg-white py-12">
      <div className="max-w-7xl mx-auto px-4">

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-28 items-center">

          {/* ================= LEFT ================= */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            {/* TAG */}
            <span className="inline-block mb-8 px-4 py-1.5 text-xs tracking-wide border border-neutral-300 rounded-full text-neutral-600">
              WHY US
            </span>

            {/* HEADING */}
            <h2 className="text-[36px] md:text-[44px] lg:text-[48px] font-normal leading-[1.25] text-[#1f3d34]">
              We Always Put{" "}
              <span className="text-[#faba19] font-medium">
                Your Interests
              </span>{" "}
              First
            </h2>

            {/* CTA */}
<div className="mt-14 flex items-center group">
  {/* BUTTON */}
  <motion.button
    className="relative overflow-hidden px-9 py-4 rounded-full 
    bg-[#1f3d34] text-white font-medium"
  >
    {/* SLIDE OVERLAY */}
    <span
      className="absolute inset-0 bg-[#fabd14] 
      -translate-x-full group-hover:translate-x-0 
      transition-transform duration-300 ease-out"
    />

    {/* TEXT */}
    <span className="relative z-10">
      Free Consultation
    </span>
  </motion.button>

  {/* ICON */}
  <motion.div
    className="relative overflow-hidden w-11 h-11 rounded-full 
    bg-[#fabd14] flex items-center justify-center cursor-pointer"
    whileHover={{ x: 4, y: -4, rotate: 8 }}
    transition={{ duration: 0.25, ease: "easeOut" }}
  >
    {/* ICON OVERLAY */}
    <span
      className="absolute inset-0 bg-[#1f3d34] 
      -translate-x-full group-hover:translate-x-0 
      transition-transform duration-300 ease-out"
    />

    <ArrowUpRight className="relative z-10 text-white" />
  </motion.div>
</div>

          </motion.div>

          {/* ================= RIGHT ================= */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: "easeOut", delay: 0.1 }}
            className="max-w-xl"
          >
            {/* ICON */}
            <div className="w-14 h-14 mb-8 rounded-full bg-[#faba19] flex items-center justify-center">
              <User className="text-[#1f3d34]" />
            </div>

            {/* TEXT */}
            <p className="text-lg text-neutral-600 leading-relaxed text-justify">
              Driven by a relentless focus on “why,” we integrate our services
              to uncover, design, and deliver the most impactful outcomes for
              you. Instead of relying on predefined processes, we take a
              hands-on approach collaborating closely with your teams to craft
              practical, end-to-end solutions tailored to your needs.
            </p>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
