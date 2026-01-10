import ProductCard from "./ProductCard";
import { motion } from "framer-motion";
import { useRef, useEffect, useState } from "react";

// ✅ IMPORT IMAGES
import bricksImg from "../Assets/bricks.png";
import maskImg from "../Assets/Mask.png";
import drillImg from "../Assets/Drill.png";

// PRODUCTS DATA
const products = [
  {
    title: "Burnt brick",
    price: 165,
    image: bricksImg,
    rating: 5,
  },
  {
    title: "Reusable respirator",
    price: 89,
    oldPrice: 99,
    discount: "-10%",
    image: maskImg,
    rating: 4,
  },
  {
    title: "Cord drill",
    price: 49,
    image: drillImg,
    rating: 5,
  },
  {
    title: "Cord drill Pro",
    price: 79,
    image: drillImg,
    rating: 4,
  },
  {
    title: "Cord drill Pro",
    price: 79,
    image: drillImg,
    rating: 4,
  },
];

// ✅ Simple, safe scroll animation
const sectionVariants = {
  hidden: { opacity: 0, y: 30 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: "easeOut",
    },
  },
};

export default function ProductSlider() {
  const sliderRef = useRef(null);
  const trackRef = useRef(null);
  const [dragWidth, setDragWidth] = useState(0);

  useEffect(() => {
    const calculateWidth = () => {
      if (!sliderRef.current || !trackRef.current) return;

      setDragWidth(
        trackRef.current.scrollWidth - sliderRef.current.offsetWidth
      );
    };

    calculateWidth();
    window.addEventListener("resize", calculateWidth);

    return () => window.removeEventListener("resize", calculateWidth);
  }, []);

  return (
    <motion.section
      className="bg-white py-16 overflow-hidden"
      variants={sectionVariants}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-80px" }}
    >
      <div className="max-w-7xl mx-auto px-6">

        {/* VIEWPORT */}
        <div ref={sliderRef} className="overflow-hidden">
          
          {/* DRAG TRACK */}
          <motion.div
            ref={trackRef}
            drag="x"
            dragConstraints={{ left: -dragWidth, right: 0 }}
            dragElastic={0.12}
            whileTap={{ cursor: "grabbing" }}
            style={{
              touchAction: "pan-y",
              cursor: "grab",
            }}
            className="flex gap-8"
          >
            {products.map((product, i) => (
              <motion.div
                key={i}
                className="min-w-70 sm:min-w-[320px] lg:min-w-90"
                whileHover={{ y: -6 }}
                transition={{
                  type: "spring",
                  stiffness: 300,
                  damping: 25,
                }}
              >
                <ProductCard {...product} />
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </motion.section>
  );
}
