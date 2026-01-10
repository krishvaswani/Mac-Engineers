import { useState } from "react";
import BannerHero from "../Components/BannerHero";
import { motion } from "framer-motion";
import { Mail, Phone } from "lucide-react";
import { saveContactMessage } from "../utils/saveContactMessage";
import toast from "react-hot-toast";

export default function Contact() {
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    message: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // ✅ Basic validation
    if (
      !form.firstName ||
      !form.lastName ||
      !form.email ||
      !form.message
    ) {
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
    } catch (err) {
      console.error("Contact submit error:", err);
      toast.error("Something went wrong. Please try again.");
    }

    setLoading(false);
  };

  return (
    <>
      <BannerHero />

      <div className="min-h-screen bg-gradient-to-br from-yellow-50 to-white flex items-center justify-center px-4">
        <div className="max-w-4xl w-full">
          {/* Contact Info Cards */}
          <motion.div
            initial="hidden"
            animate="visible"
            variants={{
              hidden: {},
              visible: { transition: { staggerChildren: 0.15 } },
            }}
            className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8"
          >
            <InfoCard icon={<Mail />} title="E-mail" value="admin@xtract.com" />
            <InfoCard icon={<Phone />} title="Phone" value="+1 (969) 819-8061" />
          </motion.div>

          {/* Form */}
          <motion.form
            onSubmit={handleSubmit}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="bg-white shadow-xl rounded-2xl p-6 md:p-8"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <Input label="First Name" name="firstName" value={form.firstName} onChange={handleChange} />
              <Input label="Last Name" name="lastName" value={form.lastName} onChange={handleChange} />
              <Input label="Email" name="email" value={form.email} onChange={handleChange} />
              <Input label="Phone" name="phone" value={form.phone} onChange={handleChange} />
            </div>

            <div className="mt-5">
              <label className="text-sm text-gray-700 font-medium">
                Message
              </label>
              <motion.textarea
                whileFocus={{ scale: 1.01 }}
                rows="4"
                name="message"
                value={form.message}
                onChange={handleChange}
                placeholder="Hi, I am Jane and I want help with..."
                className="w-full mt-2 p-3 rounded-xl border border-gray-200
                focus:outline-none focus:ring-2 focus:ring-yellow-400 transition"
              />
            </div>

            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              disabled={loading}
              className="w-full mt-6 bg-yellow-400 hover:bg-yellow-500
              text-black font-semibold py-3 rounded-xl transition"
            >
              {loading ? "Submitting..." : "Submit Form"}
            </motion.button>
          </motion.form>
        </div>
      </div>
    </>
  );
}

/* ---------------- Components ---------------- */

function InfoCard({ icon, title, value }) {
  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 },
      }}
      whileHover={{ scale: 1.03 }}
      className="flex items-center gap-4 bg-white border border-gray-200
      rounded-xl p-5 shadow-sm"
    >
      <div className="bg-yellow-100 text-yellow-600 p-3 rounded-lg">
        {icon}
      </div>
      <div>
        <p className="text-sm text-gray-500">{title}</p>
        <p className="font-medium text-gray-900">{value}</p>
      </div>
    </motion.div>
  );
}

function Input({ label, name, value, onChange }) {
  return (
    <div>
      <label className="text-sm text-gray-700 font-medium">
        {label}
      </label>
      <motion.input
        whileFocus={{ scale: 1.01 }}
        type="text"
        name={name}
        value={value}
        onChange={onChange}
        required
        className="w-full mt-2 p-3 rounded-xl border border-gray-200
        focus:outline-none focus:ring-2 focus:ring-yellow-400 transition"
      />
    </div>
  );
}
