import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../Firebase";

import { motion, AnimatePresence } from "framer-motion";
import BannerHero from "../Components/BannerHero";
import EnquiryModal from "../Components/EnquiryModal";

import {
  Phone,
  Share2,
  ChevronDown,
  CheckCircle,
} from "lucide-react";

export default function ProductPage() {
  const { id } = useParams();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  const [activeImage, setActiveImage] = useState("");
  const [openSection, setOpenSection] = useState("usage");
  const [showEnquiry, setShowEnquiry] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      const ref = doc(db, "products", id);
      const snap = await getDoc(ref);

      if (!snap.exists()) {
        setLoading(false);
        return;
      }

      const data = snap.data();
      setProduct(data);
      setActiveImage(data?.images?.primary || "");
      setLoading(false);
    };

    fetchProduct();
  }, [id]);

  if (loading) {
    return (
      <div className="py-40 text-center text-gray-500">
        Loading product…
      </div>
    );
  }

  if (!product) {
    return (
      <div className="py-40 text-center text-gray-500">
        Product not found
      </div>
    );
  }

  const images = product.images
    ? [
        { label: "PRIMARY", src: product.images.primary },
        { label: "SCHEMATIC", src: product.images.schematic },
        { label: "PROFILE", src: product.images.profile },
      ].filter((i) => i.src)
    : [];

  return (
    <>
      <BannerHero />

      <div className="bg-linear-to-b from-white to-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
          {/* BREADCRUMB */}
          <p className="text-sm text-gray-400 mb-10 tracking-wide">
            {product.collection}
            <span className="text-black font-medium">
              {" "}› {product.name}
            </span>
          </p>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* LEFT – IMAGES */}
            <div className="space-y-6">
              <div className="
                relative
                bg-white/80 backdrop-blur
                rounded-3xl p-8
                border border-black/5
                shadow-sm
              ">
                <AnimatePresence mode="wait">
                  <motion.img
                    key={activeImage}
                    src={activeImage}
                    alt={product.name}
                    initial={{ opacity: 0, scale: 0.96 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.96 }}
                    transition={{ duration: 0.25 }}
                    className="w-full max-h-105 object-contain"
                  />
                </AnimatePresence>
              </div>

              {/* THUMBNAILS */}
              {images.length > 0 && (
                <div className="grid grid-cols-3 gap-4">
                  {images.map((img) => (
                    <button
                      key={img.label}
                      onClick={() => setActiveImage(img.src)}
                      className={`
                        bg-white/70 backdrop-blur
                        rounded-2xl p-3
                        border border-black/5
                        transition
                        hover:shadow-md
                        ${activeImage === img.src ? "ring-1 ring-black/10" : ""}
                      `}
                    >
                      <img
                        src={img.src}
                        alt={img.label}
                        className="h-24 mx-auto object-contain"
                      />
                      <p className="text-xs mt-2 text-center text-gray-500">
                        {img.label}
                      </p>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* RIGHT – INFO */}
            <div className="space-y-8">
              {/* SKU + SHARE */}
              <div className="flex justify-between items-center">
                <span className="
                  text-xs px-3 py-1 rounded-full
                  bg-white/80 backdrop-blur
                  border border-black/5
                  text-gray-500
                ">
                  SKU: {product.sku || "-"}
                </span>

                <button className="flex items-center gap-2 text-sm text-gray-500 hover:text-black">
                  <Share2 size={16} /> Share
                </button>
              </div>

              {/* TITLE */}
              <h1 className="text-3xl font-semibold leading-snug">
                {product.name}
              </h1>

              {/* PRICE */}
              <div className="flex items-center gap-4">
                <span className="text-3xl font-semibold text-black">
                  ₹{product.price}
                </span>
                {product.oldPrice && (
                  <span className="line-through text-gray-400">
                    ₹{product.oldPrice}
                  </span>
                )}
              </div>

              {/* STOCK */}
              <div className="
                flex items-center gap-4
                px-5 py-4
                rounded-2xl
                bg-white/80 backdrop-blur
                border border-black/5
                shadow-sm
              ">
                <div className="w-10 h-10 flex items-center justify-center rounded-xl bg-green-50">
                  <CheckCircle size={20} className="text-green-600" />
                </div>
                <div>
                  <p className="font-medium">
                    {product.inStock ? "In Stock" : "Out of Stock"}
                  </p>
                  <p className="text-xs text-gray-500">
                    {product.inStock ? "Ships Today" : "Unavailable"}
                  </p>
                </div>
              </div>

              {/* DESCRIPTION */}
              <p className="text-gray-600 leading-relaxed">
                {product.description}
              </p>

              {/* CTA */}
              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={() => setShowEnquiry(true)}
                  className="
                    flex-1 bg-black text-white
                    py-3 rounded-full
                    transition hover:bg-black/90
                  "
                >
                  Enquire Now
                </button>

                <button className="
                  flex-1 flex items-center justify-center gap-2
                  py-3 rounded-full
                  bg-white/80 backdrop-blur
                  border border-black/5
                  hover:shadow-md
                ">
                  <Phone size={18} /> Call
                </button>
              </div>

              {/* SPECIFICATIONS */}
              {product.specs && (
                <div className="
                  bg-white/80 backdrop-blur
                  rounded-3xl
                  border border-black/5
                  overflow-hidden
                ">
                  <h3 className="px-6 py-4 font-medium">
                    Specifications
                  </h3>

                  <table className="w-full text-sm">
                    <tbody>
                      {Object.entries(product.specs).map(([key, val]) => (
                        <tr
                          key={key}
                          className="border-t border-black/5"
                        >
                          <td className="px-6 py-3 text-gray-500">
                            {key}
                          </td>
                          <td className="px-6 py-3 font-medium">
                            {val}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {/* ACCORDIONS */}
              {[{
                id: "usage",
                title: "Usage Guidelines",
                content: product.usageGuidelines,
              },
              {
                id: "info",
                title: "Additional Information",
                content: product.additionalInfo,
              }]
                .filter(i => i.content)
                .map(item => (
                  <div
                    key={item.id}
                    className="
                      bg-white/70 backdrop-blur
                      rounded-3xl
                      border border-black/5
                    "
                  >
                    <button
                      onClick={() =>
                        setOpenSection(
                          openSection === item.id ? "" : item.id
                        )
                      }
                      className="w-full flex justify-between px-6 py-4"
                    >
                      {item.title}
                      <ChevronDown
                        className={`transition ${
                          openSection === item.id ? "rotate-180" : ""
                        }`}
                      />
                    </button>

                    <AnimatePresence>
                      {openSection === item.id && (
                        <motion.p
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          className="px-6 pb-4 text-sm text-gray-600"
                        >
                          {item.content}
                        </motion.p>
                      )}
                    </AnimatePresence>
                  </div>
                ))}
            </div>
          </div>
        </div>
      </div>

      <EnquiryModal
  open={showEnquiry}
  onClose={() => setShowEnquiry(false)}
  productId={id}
  productName={product.name}
/>
    </>
  );
}
