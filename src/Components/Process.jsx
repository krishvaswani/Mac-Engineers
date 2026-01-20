import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  WrenchScrewdriverIcon,
  ClipboardDocumentCheckIcon,
  BoltIcon,
  CreditCardIcon,
} from "@heroicons/react/24/outline";

gsap.registerPlugin(ScrollTrigger);

const steps = [
  {
    title: "Requirement analysis",
    desc:
      "We understand your facility, airflow needs, load calculations, and compliance requirements before proposing a solution.",
    icon: ClipboardDocumentCheckIcon,
  },
  {
    title: "System design & planning",
    desc:
      "Our engineers design efficient HVAC and air distribution systems focused on performance and energy optimization.",
    icon: WrenchScrewdriverIcon,
  },
  {
    title: "Installation & commissioning",
    desc:
      "End-to-end installation with testing, validation, and commissioning to ensure reliable long-term operation.",
    icon: BoltIcon,
  },
  {
    title: "Support & maintenance",
    desc:
      "Preventive maintenance, monitoring, and dedicated support to keep systems operating at peak efficiency.",
    icon: CreditCardIcon,
  },
];

export default function ProcessSection() {
  const sectionRef = useRef(null);
  const itemsRef = useRef([]);

  useEffect(() => {
    // 🧠 global performance tweak
    ScrollTrigger.config({
      ignoreMobileResize: true,
    });

    const ctx = gsap.context(() => {
      // Initial state (GPU friendly)
      gsap.set(itemsRef.current, {
        y: 50,
        autoAlpha: 0,
        willChange: "transform, opacity",
      });

      gsap.to(itemsRef.current, {
        y: 0,
        autoAlpha: 1,
        ease: "power3.out",
        duration: 1,
        stagger: 0.3,
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: "+=850",
          scrub: 1,            // ✅ smooth interpolation
          pin: true,
          anticipatePin: 1,
          pinSpacing: true,
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="bg-white py-32 overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-24">

        {/* LEFT CONTENT */}
        <div className="self-start">
          <h2 className="text-4xl md:text-5xl font-semibold text-slate-900 leading-tight">
            Simplified HVAC <br /> project execution
          </h2>

          <p className="mt-6 text-slate-600 max-w-md leading-relaxed">
            Our streamlined process ensures faster delivery, higher efficiency,
            and long-term reliability — from planning to commissioning.
          </p>
        </div>

        {/* RIGHT CONTENT */}
        <div className="relative">
          {/* Fixed-height vertical line (NO reflow) */}
          <div className="absolute left-5 top-0 h-full w-px bg-slate-200 pointer-events-none" />

          <div className="space-y-20">
            {steps.map((step, index) => (
              <div
                key={index}
                ref={(el) => (itemsRef.current[index] = el)}
                className="flex gap-8 items-start"
              >
                {/* Icon */}
                <div className="relative z-10 w-10 h-10 flex items-center justify-center rounded-xl bg-slate-100">
                  <step.icon className="w-5 h-5 text-slate-700" />
                </div>

                {/* Text */}
                <div>
                  <h4 className="text-lg font-semibold text-slate-900">
                    {step.title}
                  </h4>
                  <p className="mt-2 text-slate-600 leading-relaxed max-w-md">
                    {step.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}
