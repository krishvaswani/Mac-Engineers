import { motion } from "framer-motion";
import {
  ShieldCheck,
  PieChart,
  Layers,
  Star,
} from "lucide-react";

/* ---------------- ANIMATION ---------------- */

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" },
  },
};

export default function ValuesSection() {
  return (
    <section className="bg-white py-8">
      <div className="max-w-7xl mx-auto px-4">

        {/* ================= TOP GRID ================= */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-start mb-20">

          {/* LEFT */}
          <div>
            <span className="inline-block mb-6 px-4 py-1.5 text-xs tracking-wide border border-neutral-300 rounded-full text-neutral-600">
              OUR CORE VALUES
            </span>

            <h2 className="text-[40px] md:text-[48px] lg:text-[56px] font-normal leading-tight text-[#1f3d34]">
              We Operate with <br />
              Unwavering{" "}
              <span className="text-[#faba19] font-medium">
                Honesty
              </span><br/>
              & Integrity
            </h2>
          </div>

          {/* RIGHT */}
          <p className="text-lg text-neutral-600 leading-relaxed max-w-xl lg:self-end text-justify">
            We believe in delivering engineered solutions with complete transparency, technical accuracy, and uncompromised quality. From design to execution, every project is handled with a commitment to site-specific requirements, safety standards, and long-term performance, ensuring reliable outcomes and lasting client relationships.
          </p>
        </div>

        {/* ================= CARDS ================= */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          transition={{ staggerChildren: 0.12 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
        >
          <ValueCard
            // highlight
            icon={<ShieldCheck size={22} />}
            title="Quality First"
            text="We adhere to strict quality standards in manufacturing and execution to ensure durable, efficient, and reliable engineering solutions."
          />

          <ValueCard
            icon={<PieChart size={22} />}
            title="Technical Expertise"
            text="Backed by deep industry knowledge, we deliver technically sound solutions tailored to site-specific requirements and applications."
          />

          <ValueCard
            icon={<Layers size={22} />}
            title="Customized Solutions"
            text="Every project is approached with careful planning and customization to meet unique site conditions, operational needs, and performance goals."
          />

          <ValueCard
            icon={<Star size={22} />}
            title="Reliability & Trust"
            text="We operate with transparency, timely execution, and ethical practices to build long-term partnerships with our clients."
          />
        </motion.div>

      </div>
    </section>
  );
}

/* ---------------- VALUE CARD ---------------- */

function ValueCard({ icon, title, text, highlight = false }) {
  return (
    <motion.div
      variants={fadeUp}
      whileHover={{ y: -8 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className={`group relative rounded-[28px] border gap-5 px-4 pt-8 pb-6 transition-colors ${
        highlight
          ? "bg-[#faba19] border-[#faba19]"
          : "bg-white border-neutral-200 hover:bg-[#faba19]"
      }`}
    >
      {/* ICON */}
      <div
        className={`w-14 h-14 flex items-center justify-center rounded-full mb-20 transition-colors ${
          highlight
            ? "bg-[#1f3d34] text-[#faba19]"
            : "bg-[#faba19] text-[#1f3d34] group-hover:bg-[#1f3d34] group-hover:text-[#faba19]"
        }`}
      >
        {icon}
      </div>

      {/* CONTENT BOX */}
      <div className="rounded-2xl px-4 py-6 bg-[#faf9f6]">
        <h3 className="text-lg font-medium text-[#1f3d34] mb-3">
          {title}
        </h3>

        <p className="text-neutral-600 leading-relaxed">
          {text}
        </p>
      </div>
    </motion.div>
  );
}
