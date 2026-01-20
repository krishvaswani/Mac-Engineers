import { motion } from "framer-motion";
import { useRef, useEffect, useState } from "react";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../Firebase";
import { Star } from "lucide-react";
import { useNavigate } from "react-router-dom";

const FALLBACK_IMAGE = "/placeholder.png";

export default function ProductSlider() {
  const sliderRef = useRef(null);
  const trackRef = useRef(null);
  const [dragWidth, setDragWidth] = useState(0);
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();

  // 🔥 Fetch products
  useEffect(() => {
    const fetchProducts = async () => {
      const q = query(
        collection(db, "products"),
        where("isActive", "==", true)
      );

      const snap = await getDocs(q);
      const data = snap.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setProducts(data.sort(() => 0.5 - Math.random()).slice(0, 8));
    };

    fetchProducts();
  }, []);

  // 🔧 Drag width calculation
  useEffect(() => {
    const calcWidth = () => {
      if (!sliderRef.current || !trackRef.current) return;
      setDragWidth(
        trackRef.current.scrollWidth - sliderRef.current.offsetWidth
      );
    };

    calcWidth();
    window.addEventListener("resize", calcWidth);
    window.addEventListener("scroll", calcWidth);

    return () => {
      window.removeEventListener("resize", calcWidth);
      window.removeEventListener("scroll", calcWidth);
    };
  }, [products]);

  return (
    <section className="bg-white py-10 relative z-10">
      <div className="max-w-7xl mx-auto px-6">
        <div ref={sliderRef} className="overflow-hidden">
          <motion.div
            ref={trackRef}
            drag="x"
            dragConstraints={{ left: -dragWidth, right: 0 }}
            dragElastic={0.08}
            whileTap={{ cursor: "grabbing" }}
            className="flex gap-8 cursor-grab py-6"
            style={{ touchAction: "pan-y" }}
          >
            {products.map((product) => (
              <div key={product.id} className="min-w-[320px]">
                <ProductCard product={product} />
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}

/* ===========================
   PRODUCT CARD
=========================== */

function ProductCard({ product }) {
  const navigate = useNavigate();

  const {
    id,
    name,
    price,
    images,
    inStock,
    description,
    rating = 5,
  } = product;

  const imageSrc =
    images?.[0]?.startsWith("http") ? images[0] : FALLBACK_IMAGE;

  const goToProduct = () => {
    navigate(`/product/${id}`);
  };

  return (
    <div
      onClick={goToProduct}
      className="h-130 bg-white rounded-3xl border border-black/10 shadow-sm hover:shadow-xl transition overflow-hidden flex flex-col cursor-pointer"
    >
      <div className="h-60 bg-white-100 flex items-center justify-center ">
        <img
          src={imageSrc}
          alt={name}
          className="max-h-full max-w-full object-contain pointer-events-none"
          draggable={false}
          onError={(e) => (e.currentTarget.src = FALLBACK_IMAGE)}
        />
      </div>

      <div className="flex flex-col flex-1 px-6 pt-4">
        <h3 className="font-semibold text-lg line-clamp-2 min-h-12">
          {name}
        </h3>

        <p className="text-sm text-gray-500 line-clamp-2 min-h-10 mt-1">
          {description}
        </p>

        <div className="flex gap-1 mt-3">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              size={14}
              className={
                i < rating
                  ? "text-yellow-400 fill-yellow-400"
                  : "text-gray-300"
              }
            />
          ))}
        </div>

        <div className="mt-auto pb-6">
          <div className="flex justify-between items-center pt-4">
            <span className="text-xl font-semibold">₹{price}</span>
            <span
              className={`text-xs px-3 py-1 rounded-full ${
                inStock
                  ? "bg-green-50 text-green-700 border border-green-200"
                  : "bg-red-50 text-red-600 border border-red-200"
              }`}
            >
              {inStock ? "In Stock" : "Out of Stock"}
            </span>
          </div>

          {/* Button kept for UX, but prevents double navigation */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              goToProduct();
            }}
            className="mt-4 w-full bg-black text-white py-3 rounded-full text-sm hover:bg-gray-800 transition"
          >
            View Product →
          </button>
        </div>
      </div>
    </div>
  );
}
