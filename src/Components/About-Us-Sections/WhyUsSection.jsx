import { motion } from "framer-motion";
import { ArrowUpRight, User } from "lucide-react";
import { Link } from "react-router-dom";

export default function WhyUsSection() {
  return (
    <section className="bg-white py-10 md:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">

        <div className="grid grid-cols-1 lg:grid-cols-2 
          gap-10 md:gap-16 lg:gap-28 items-center">

          {/* ================= LEFT ================= */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="text-center lg:text-left"
          >
            {/* TAG */}
            <span className="inline-block mb-5 px-4 py-1.5 text-xs tracking-wide 
              border border-neutral-300 rounded-full text-neutral-600">
              WHY US
            </span>

            {/* HEADING */}
            <h2 className="text-[26px] sm:text-[30px] md:text-[40px] lg:text-[48px]
              font-normal leading-snug text-[#1f3d34]">
              Built on Quality{" "}
              <span className="text-[#faba19] font-medium">
                Focused on
              </span>{" "}
              You
            </h2>

            {/* MOBILE DIVIDER */}
            <div className="block md:hidden w-16 h-[3px] bg-[#faba19] 
              mx-auto mt-6 mb-6 rounded-full"></div>

            {/* CTA – DESKTOP ONLY */}
            <div className="mt-12 hidden md:flex items-center 
              justify-center lg:justify-start gap-4 group">

              <Link to="/contact">
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

                  <span className="relative z-10">
                    Free Consultation
                  </span>
                </motion.button>
              </Link>

              {/* ICON – DESKTOP ONLY */}
              <motion.div
                className="relative overflow-hidden w-11 h-11 rounded-full 
                bg-[#fabd14] flex items-center justify-center cursor-pointer"
                whileHover={{ x: 4, y: -4, rotate: 8 }}
                transition={{ duration: 0.25, ease: "easeOut" }}
              >
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
            className="max-w-xl mx-auto lg:mx-0 text-center lg:text-left"
          >
            {/* ICON – DESKTOP ONLY */}
            <div className="hidden md:flex w-14 h-14 mb-6 rounded-full 
              bg-[#faba19] items-center justify-center mx-auto lg:mx-0">
              <User className="text-[#1f3d34]" />
            </div>

            {/* TEXT */}
            <p className="text-base sm:text-lg text-neutral-600 leading-relaxed
              text-justify">
              Established in 2018, Mac Engineers is a New Delhi–based manufacturer 
              and trader specializing in duct dampers, industrial water chillers, 
              SS kitchen exhaust hoods, and wet scrubbers. We are committed to 
              delivering high-quality, cost-effective solutions that meet real 
              operational needs.
            </p>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
