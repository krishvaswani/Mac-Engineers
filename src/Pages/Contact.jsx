import { useState } from "react";
import BannerHero from "../Components/BannerHero";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { Mail, Phone, ChevronDown,MapPin } from "lucide-react";
import { saveContactMessage } from "../utils/saveContactMessage";
import toast from "react-hot-toast";

export default function Contact() {
  const shouldReduceMotion = useReducedMotion();

  const fade = {
    hidden: { opacity: 0, y: 16 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.35, ease: "easeOut" },
    },
  };

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    message: "",
  });

  const [loading, setLoading] = useState(false);
  const [openFaq, setOpenFaq] = useState(null);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.firstName || !form.lastName || !form.email || !form.message) {
      toast.error("Please fill all required fields");
      return;
    }

    setLoading(true);

    try {
      await saveContactMessage(form);
      toast.success("Message sent successfully 🚀");
      setForm({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        message: "",
      });
    } catch {
      toast.error("Something went wrong. Please try again.");
    }

    setLoading(false);
  };

  return (
    <>
      <BannerHero />

      {/* ================= MAIN ================= */}
      <section className="bg-gradient-to-br from-yellow-50 to-white py-20 px-4">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-10">

          {/* IMAGE (40%) */}
          <motion.div
            initial={!shouldReduceMotion ? "hidden" : false}
            animate={!shouldReduceMotion ? "visible" : false}
            variants={fade}
            className="lg:w-[40%] hidden lg:block"
          >
            <div className="h-full rounded-3xl overflow-hidden border border-neutral-200 shadow-xl">
              <img
                src="https://images.unsplash.com/photo-1521737604893-d14cc237f11d"
                alt="Contact"
                className="w-full h-full object-cover"
              />
            </div>
          </motion.div>

          {/* FORM (60%) */}
          <motion.form
            onSubmit={handleSubmit}
            initial={!shouldReduceMotion ? "hidden" : false}
            animate={!shouldReduceMotion ? "visible" : false}
            variants={fade}
            className="lg:w-[60%] bg-white border border-neutral-200 shadow-2xl rounded-3xl p-8"
          >
            {/* CONTACT INFO */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
              <InfoCard icon={<Mail />} title="Primary Email" value="admin@xtract.com" />
              <InfoCard
                icon={<MapPin />}
                title="Location"
                value="Mumbai, Maharashtra, India"
              />
              <InfoCard icon={<Phone />} title="Sales Phone" value="+1 (969) 819-8061" />
              <InfoCard icon={<Phone />} title="Support Phone" value="+1 (888) 234-1122" />
            </div>

            {/* INPUTS (NO MOTION HERE) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input label="First Name" name="firstName" value={form.firstName} onChange={handleChange} />
              <Input label="Last Name" name="lastName" value={form.lastName} onChange={handleChange} />
              <Input label="Email" name="email" value={form.email} onChange={handleChange} />
              <Input label="Phone" name="phone" value={form.phone} onChange={handleChange} />
            </div>

            <div className="mt-6">
              <label className="text-sm font-medium text-neutral-700">
                Message
              </label>
              <textarea
                name="message"
                value={form.message}
                onChange={handleChange}
                rows="4"
                className="w-full mt-2 p-4 rounded-xl border border-neutral-300 focus:ring-2 focus:ring-yellow-400 outline-none"
              />
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              disabled={loading}
              className="w-full mt-8 bg-yellow-400 hover:bg-yellow-500 py-3 cursor-pointer rounded-xl font-semibold"
            >
              {loading ? "Submitting..." : "Submit Form"}
            </motion.button>
          </motion.form>
        </div>
      </section>

      {/* ================= FAQ ================= */}
      <section className="bg-white py-24 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">
            Frequently Asked Questions
          </h2>

          {FAQS.map((f, i) => (
            <motion.div
              key={i}
              layout
              className="border border-neutral-200 rounded-2xl mb-4 overflow-hidden"
            >
              <button
                onClick={() => setOpenFaq(openFaq === i ? null : i)}
                className="w-full flex justify-between items-center p-5 font-medium"
              >
                {f.q}
                <ChevronDown
                  className={`transition-transform ${openFaq === i ? "rotate-180" : ""
                    }`}
                />
              </button>

              <AnimatePresence initial={false}>
                {openFaq === i && (
                  <motion.div
                    layout
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="px-5 pb-5 text-neutral-600"
                  >
                    {f.a}
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ================= MAP (NO ANIMATION) ================= */}
      <section className="w-full h-[450px] border-t border-neutral-200">
        <iframe
          title="Google Map"
          className="w-full h-full"
          loading="lazy"
          src="https://www.google.com/maps?q=india&output=embed"
        />
      </section>
    </>
  );
}

/* ---------------- COMPONENTS ---------------- */

function InfoCard({ icon, title, value }) {
  return (
    <div className="flex items-center gap-4 border border-neutral-200 rounded-2xl p-4 bg-white shadow-sm cursor-pointer">
      <div className="bg-yellow-100 text-yellow-600 p-3 rounded-xl">
        {icon}
      </div>
      <div>
        <p className="text-xs text-neutral-500">{title}</p>
        <p className="font-medium text-neutral-800">{value}</p>
      </div>
    </div>
  );
}

function Input({ label, name, value, onChange }) {
  return (
    <div>
      <label className="text-sm font-medium text-neutral-700">
        {label}
      </label>
      <input
        name={name}
        value={value}
        onChange={onChange}
        required
        className="w-full mt-2 p-3 rounded-xl border border-neutral-300 focus:ring-2 focus:ring-yellow-400 outline-none"
      />
    </div>
  );
}

const FAQS = [
  {
    q: "How soon will you contact me?",
    a: "Our team usually responds within 24 business hours.",
  },
  {
    q: "Do you provide customized solutions?",
    a: "Yes, all our solutions are tailored based on your requirements.",
  },
  {
    q: "Is my information secure?",
    a: "Absolutely. Your data is encrypted and never shared.",
  },
];
