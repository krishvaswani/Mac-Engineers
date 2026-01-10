import { motion } from "framer-motion";
import { useRef, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  collection,
  getDocs,
  query,
  where,
  limit,
} from "firebase/firestore";
import { db } from "../Firebase";

// Section animation
const sectionVariants = {
  hidden: { opacity: 0, y: 30 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" },
  },
};

export default function ProductSlider() {
  const sliderRef = useRef(null);
  const trackRef = useRef(null);

  const [products, setProducts] = useState([]);
  const [dragWidth, setDragWidth] = useState(0);

  // 🔹 Fetch products
  useEffect(() => {
    const fetchProducts = async () => {
      const q = query(
        collection(db, "products"),
        where("isActive", "==", true),
        limit(8)
      );

      const snap = await getDocs(q);
      setProducts(
        snap.docs.map((d) => ({
          id: d.id,
          ...d.data(),
        }))
      );
    };

    fetchProducts();
  }, []);

  // 🔹 Calculate drag width correctly
  useEffect(() => {
    if (!sliderRef.current || !trackRef.current) return;

    const calculateWidth = () => {
      const container = sliderRef.current;
      const track = trackRef.current;

      const totalWidth = track.scrollWidth;
      const visibleWidth = container.offsetWidth;

      const maxDrag = totalWidth - visibleWidth;
      setDragWidth(maxDrag > 0 ? maxDrag : 0);
    };

    // Initial
    calculateWidth();

    // Recalculate on resize
    const resizeObserver = new ResizeObserver(calculateWidth);
    resizeObserver.observe(trackRef.current);
    resizeObserver.observe(sliderRef.current);

    return () => resizeObserver.disconnect();
  }, [products]);

  if (products.length === 0) return null;

  return (
    <motion.section
      className="bg-white py-16 overflow-hidden"
      variants={sectionVariants}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-80px" }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6">

        {/* HEADER */}
        <div className="mb-10">
          <h2 className="text-2xl sm:text-3xl font-semibold mb-2">
            Featured Products
          </h2>
          <p className="text-gray-500">
            Hand-picked products from our collection
          </p>
        </div>

        {/* VIEWPORT */}
        <div
          ref={sliderRef}
          className="overflow-hidden"
        >
          {/* TRACK */}
          <motion.div
            ref={trackRef}
            drag="x"
            dragConstraints={{ left: -dragWidth, right: 0 }}
            dragElastic={0.08}
            dragMomentum={true}
            whileTap={{ cursor: "grabbing" }}
            className="flex gap-6 cursor-grab"
            style={{ touchAction: "pan-y" }}
          >
            {products.map((p) => (
              <motion.div
                key={p.id}
                whileHover={{ y: -6 }}
                transition={{ duration: 0.25 }}
                className="
                  min-w-[260px]
                  sm:min-w-[300px]
                  lg:min-w-[340px]
                "
              >
                <Link
                  to={`/product/${p.id}`}
                  className="
                    block
                    bg-white
                    rounded-3xl
                    border border-black/5
                    overflow-hidden
                    hover:shadow-md
                    transition
                    cursor-pointer
                  "
                >
                  {/* IMAGE */}
                  <div className="bg-gray-50 h-64 sm:h-72 flex items-center justify-center overflow-hidden">
                    {p.images?.[0] ? (
                      <img
                        src={p.images[0]}
                        alt={p.name}
                        onLoad={() => {
                          // Recalculate when images load
                          if (sliderRef.current && trackRef.current) {
                            const total =
                              trackRef.current.scrollWidth -
                              sliderRef.current.offsetWidth;
                            setDragWidth(total > 0 ? total : 0);
                          }
                        }}
                        className="
                          w-full h-full object-contain
                          transition-transform duration-300
                          hover:scale-105
                        "
                      />
                    ) : (
                      <span className="text-gray-400 text-sm">
                        No Image
                      </span>
                    )}
                  </div>

                  {/* CONTENT */}
                  <div className="p-5 space-y-3">
                    <h3 className="font-semibold text-lg leading-snug">
                      {p.name}
                    </h3>

                    <p className="text-sm text-gray-500 line-clamp-2">
                      {p.description}
                    </p>

                    <div className="flex items-center justify-between pt-2">
                      <span className="font-semibold text-black">
                        ₹{p.price}
                      </span>

                      {p.inStock ? (
                        <span className="
                          text-xs
                          px-3 py-1
                          rounded-full
                          bg-green-50
                          border border-green-200
                          text-green-700
                        ">
                          In Stock
                        </span>
                      ) : (
                        <span className="
                          text-xs
                          px-3 py-1
                          rounded-full
                          bg-red-50
                          border border-red-200
                          text-red-600
                        ">
                          Out of Stock
                        </span>
                      )}
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </motion.section>
  );
}
