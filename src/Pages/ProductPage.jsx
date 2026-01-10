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
  Download,
  ChevronLeft,
  ChevronRight,
  FileText,
} from "lucide-react";

export default function ProductPage() {
  const { id } = useParams();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  const [activeIndex, setActiveIndex] = useState(0);
  const [openSection, setOpenSection] = useState("usage");
  const [showEnquiry, setShowEnquiry] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      const snap = await getDoc(doc(db, "products", id));
      if (snap.exists()) setProduct(snap.data());
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

  const images = product.images || [];

  const nextImage = () =>
    setActiveIndex((i) => (i + 1) % images.length);

  const prevImage = () =>
    setActiveIndex((i) => (i - 1 + images.length) % images.length);

  return (
    <>
      <BannerHero />

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="bg-linear-to-b from-white to-gray-50"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">

          {/* BREADCRUMB */}
          <p className="text-sm text-gray-400 mb-10">
            {product.collection}
            <span className="text-black font-medium">
              {" "}› {product.name}
            </span>
          </p>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-14">

            {/* IMAGE VIEWER */}
            <div className="space-y-6">

              <div className="
                relative
                bg-white
                rounded-3xl
                border border-black/5
                overflow-hidden
              ">
                <AnimatePresence mode="wait">
                  <motion.img
                    key={activeIndex}
                    src={images[activeIndex]}
                    initial={{ opacity: 0, scale: 0.97 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.97 }}
                    transition={{ duration: 0.25 }}
                    className="w-full h-[520px] object-contain"
                  />
                </AnimatePresence>

                {images.length > 1 && (
                  <>
                    <button
                      onClick={prevImage}
                      className="absolute left-4 top-1/2 -translate-y-1/2 bg-white rounded-full p-2 border border-black/5 cursor-pointer"
                    >
                      <ChevronLeft />
                    </button>
                    <button
                      onClick={nextImage}
                      className="absolute right-4 top-1/2 -translate-y-1/2 bg-white rounded-full p-2 border border-black/5 cursor-pointer"
                    >
                      <ChevronRight />
                    </button>
                  </>
                )}
              </div>

              <div className="flex gap-3 overflow-x-auto">
                {images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveIndex(i)}
                    className={`
                      rounded-2xl
                      p-2
                      border border-black/5
                      cursor-pointer
                      ${activeIndex === i ? "ring-1 ring-black/10" : ""}
                    `}
                  >
                    <img
                      src={img}
                      className="h-20 w-20 object-contain"
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* PRODUCT INFO */}
            <div className="space-y-8">

              {/* SKU + SHARE
              <div className="flex justify-between items-center">
                <span className="text-xs px-3 py-1 rounded-full bg-gray-100 text-gray-500">
                  SKU: {product.sku || "-"}
                </span>
                <button className="flex items-center gap-2 text-sm text-gray-500 cursor-pointer">
                  <Share2 size={16} /> Share
                </button>
              </div> */}

              {/* TITLE */}
              <h1 className="text-3xl font-semibold text-gray-900">
                {product.name}
              </h1>

              {/* PRICE + STOCK */}
              <div className="flex items-center gap-4 flex-wrap">
                <span className="text-3xl font-semibold">
                  ₹{product.price}
                </span>

                {product.oldPrice && (
                  <span className="line-through text-gray-400">
                    ₹{product.oldPrice}
                  </span>
                )}

                {product.inStock && (
                  <div className="
                    flex items-center gap-3
                    bg-green-50
                    border border-green-200
                    rounded-xl
                    px-4 py-2
                  ">
                    <CheckCircle
                      size={18}
                      className="text-green-600"
                    />
                    <div className="leading-tight">
                      <p className="text-sm font-medium text-green-700">
                        In Stock
                      </p>
                      <p className="text-xs text-green-600">
                        Ships Today
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* DESCRIPTION */}
              <div className="
                bg-white
                rounded-3xl
                border border-black/5
                px-6 py-5
              ">
                <p className="text-gray-600 leading-relaxed">
                  {product.description}
                </p>
              </div>

              {/* PDF */}
              {product.pdfUrl && (
                <a
                  href={product.pdfUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="
                    flex items-center justify-between
                    bg-white
                    border border-black/5
                    rounded-3xl
                    px-6 py-4
                    cursor-pointer
                    hover:bg-gray-50
                  "
                >
                  <div className="flex items-center gap-4">
                    <div className="bg-red-50 p-2 rounded-xl">
                      <FileText className="text-red-600" />
                    </div>
                    <div>
                      <p className="font-medium">
                        Technical_Spec_Sheet.pdf
                      </p>
                      <p className="text-xs text-gray-500">
                        Datasheet · PDF
                      </p>
                    </div>
                  </div>
                  <Download className="text-gray-500" />
                </a>
              )}

              {/* CTA */}
              <div className="flex gap-4">
                <button
                  onClick={() => setShowEnquiry(true)}
                  className="flex-1 bg-black text-white py-3 rounded-full cursor-pointer"
                >
                  Enquire Now
                </button>
                <button className="flex-1 flex items-center justify-center gap-2 py-3 rounded-full border border-black/10 cursor-pointer">
                  <Phone size={18} /> Call
                </button>
              </div>

              {/* SPECIFICATIONS */}
              {product.specs && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white rounded-3xl border border-black/5 overflow-hidden"
                >
                  <div className="px-6 py-5 border-b border-black/5">
                    <h3 className="font-semibold">
                      Specifications
                    </h3>
                  </div>

                  <div className="divide-y divide-black/5">
                    {Object.entries(product.specs).map(([k, v]) => (
                      <div
                        key={k}
                        className="px-6 py-4 flex justify-between hover:bg-gray-50"
                      >
                        <span className="text-sm text-gray-500">
                          {k}
                        </span>
                        <span className="text-sm font-medium">
                          {v}
                        </span>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* DROPDOWNS */}
              {[
                {
                  id: "usage",
                  title: "Usage Guidelines",
                  content: product.usageGuidelines,
                },
                {
                  id: "info",
                  title: "Additional Information",
                  content: product.additionalInfo,
                },
              ]
                .filter(i => i.content)
                .map(item => (
                  <div
                    key={item.id}
                    className="bg-white rounded-3xl border border-black/5 overflow-hidden"
                  >
                    <button
                      onClick={() =>
                        setOpenSection(
                          openSection === item.id ? "" : item.id
                        )
                      }
                      className="w-full flex justify-between px-6 py-5 font-medium cursor-pointer"
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
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.25 }}
                          className="px-6 pb-5 text-sm text-gray-600"
                        >
                          {item.content}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ))}
            </div>
          </div>
        </div>
      </motion.div>

      <EnquiryModal
        open={showEnquiry}
        onClose={() => setShowEnquiry(false)}
        productId={id}
        productName={product.name}
      />
    </>
  );
}
