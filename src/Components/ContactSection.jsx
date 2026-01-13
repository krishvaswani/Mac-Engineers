import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function ContactSection() {
  const sectionRef = useRef(null);
  const formRef = useRef(null);

  useEffect(() => {
    gsap.fromTo(
      formRef.current,
      { y: 120, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 1.2,
        ease: "power3.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 70%",
        },
      }
    );
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative bg-linear-to-br from-slate-50 to-white py-20 overflow-hidden rounded-3xl m-5"
    >
      {/* Subtle grain background */}
      <div className="absolute inset-0 bg-[radial-gradient(#00000008_1px,transparent_1px)] bg-size-[4px_4px]" />

      <div className="relative z-10 max-w-7xl mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          
          {/* LEFT CONTENT */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            viewport={{ once: true }}
            className="text-slate-900"
          >
            <p className="text-sm uppercase tracking-widest text-slate-500 mb-4">
              Get in touch
            </p>

            <h2 className="text-4xl md:text-5xl font-semibold leading-tight">
              Tell us about your project
              <br />
              whether it’s a website,
              <br />
              SEO, or marketing.
            </h2>

            <div className="mt-10 space-y-6 text-slate-600 text-sm">
              <div>
                <p className="uppercase text-xs mb-1 text-slate-500">
                  Talk to us
                </p>
                <p>+91 98765 43210</p>
              </div>

              <div>
                <p className="uppercase text-xs mb-1 text-slate-500">
                  Post address
                </p>
                <p>
                  2nd Floor,Plot No. 62a,Om Vihar
                  <br/>Phase- IV,Uttam Nagar,New Delhi-110059
                </p>
              </div>
            </div>
          </motion.div>

          {/* FORM CARD */}
          <motion.div
            ref={formRef}
            initial={{ opacity: 0 }}
            className="bg-white rounded-3xl border border-slate-200 shadow-xs p-8 md:p-10"
          >
            <h3 className="text-xl font-semibold mb-6 text-slate-900">
              Have a project in mind?
            </h3>

            <form className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Name */}
              <input
                type="text"
                placeholder="Your full name"
                className="input bg-slate-50 border border-slate-200 focus:border-slate-400"
                required
              />

              {/* Email */}
              <input
                type="email"
                placeholder="Your email address"
                className="input bg-slate-50 border border-slate-200 focus:border-slate-400"
                required
              />

              {/* Phone Number */}
              <input
                type="tel"
                placeholder="Phone number"
                className="input bg-slate-50 border border-slate-200 focus:border-slate-400"
                required
              />

              {/* City */}
              <input
                type="text"
                placeholder="City"
                className="input bg-slate-50 border border-slate-200 focus:border-slate-400"
              />

              {/* Message */}
              <textarea
                placeholder="Tell us about your project, idea, or requirements..."
                rows="4"
                className="input bg-slate-50 border border-slate-200 md:col-span-2 resize-none"
                required
              />

              {/* Submit Button */}
              <button
                type="submit"
                className="md:col-span-2 mt-4 inline-flex items-center gap-3 bg-slate-900 text-white px-6 py-3 rounded-full hover:scale-105 transition duration-300"
              >
                <span className="w-8 h-8 rounded-full bg-white text-slate-900 flex items-center justify-center">
                  →
                </span>
                Let’s Talk
              </button>
            </form>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
