import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { useState } from "react";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../Firebase";
import toast from "react-hot-toast";

export default function EnquiryModal({
  open,
  onClose,
  productId,
  productName,
}) {
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });

  if (!open) return null;

  const submitEnquiry = async (e) => {
    e.preventDefault();

    if (!form.name || !form.phone) {
      toast.error("Name and phone are required");
      return;
    }

    setLoading(true);

    try {
      await addDoc(collection(db, "enquiries"), {
        name: form.name,
        email: form.email,
        phone: form.phone,
        message: form.message,
        productId,
        productName,
        createdAt: serverTimestamp(),
      });

      // reset form
      setForm({
        name: "",
        email: "",
        phone: "",
        message: "",
      });

      toast.success("Enquiry submitted successfully");
      onClose();
    } catch (error) {
      console.error("Enquiry error:", error);
      toast.error("Failed to submit enquiry. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {/* BACKDROP */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40"
      />

      {/* MODAL */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        transition={{ duration: 0.25 }}
        className="fixed inset-0 z-50 flex items-center justify-center px-4"
      >
        <div
          onClick={(e) => e.stopPropagation()}
          className="w-full max-w-md bg-white rounded-2xl shadow-xl p-6 relative"
        >
          {/* CLOSE */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-black"
          >
            <X size={18} />
          </button>

          <h3 className="text-xl font-semibold mb-1">
            Product Enquiry
          </h3>
          <p className="text-sm text-gray-500 mb-6">
            Fill the form and we’ll get back to you shortly.
          </p>

          <form onSubmit={submitEnquiry} className="space-y-4">
            <input
              className="input"
              placeholder="Your Name"
              value={form.name}
              onChange={(e) =>
                setForm({ ...form, name: e.target.value })
              }
            />

            <input
              type="email"
              className="input"
              placeholder="Email Address"
              value={form.email}
              onChange={(e) =>
                setForm({ ...form, email: e.target.value })
              }
            />

            <input
              className="input"
              placeholder="Phone Number"
              value={form.phone}
              onChange={(e) =>
                setForm({ ...form, phone: e.target.value })
              }
            />

            <textarea
              rows="3"
              className="input"
              placeholder="Your Message"
              value={form.message}
              onChange={(e) =>
                setForm({ ...form, message: e.target.value })
              }
            />

            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                disabled={loading}
                className="flex-1 py-2 rounded-lg border disabled:opacity-60"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={loading}
                className="flex-1 py-2 rounded-lg bg-black text-white disabled:opacity-60"
              >
                {loading ? "Submitting..." : "Submit"}
              </button>
            </div>
          </form>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
