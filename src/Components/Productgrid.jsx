import { useEffect, useRef, useState } from "react";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../Firebase";
import { Star } from "lucide-react";
import { useNavigate } from "react-router-dom";

const FALLBACK_IMAGE = "/placeholder.png";

/* ===========================
   PRODUCT SLIDER
=========================== */

export default function ProductSlider() {
  const sliderRef = useRef(null);
  const [products, setProducts] = useState([]);

  /* ================= FETCH PRODUCTS ================= */
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

  /* ================= DRAG TO SCROLL ================= */
  useEffect(() => {
    const slider = sliderRef.current;
    if (!slider) return;

    let isDown = false;
    let startX;
    let scrollLeft;

    const onDown = (e) => {
      isDown = true;
      slider.classList.add("cursor-grabbing");
      startX = e.pageX || e.touches?.[0].pageX;
      scrollLeft = slider.scrollLeft;
    };

    const onMove = (e) => {
      if (!isDown) return;
      e.preventDefault();
      const x = e.pageX || e.touches?.[0].pageX;
      const walk = (x - startX) * 1.2;
      slider.scrollLeft = scrollLeft - walk;
    };

    const onUp = () => {
      isDown = false;
      slider.classList.remove("cursor-grabbing");
    };

    slider.addEventListener("mousedown", onDown);
    slider.addEventListener("mousemove", onMove);
    slider.addEventListener("mouseup", onUp);
    slider.addEventListener("mouseleave", onUp);

    slider.addEventListener("touchstart", onDown);
    slider.addEventListener("touchmove", onMove);
    slider.addEventListener("touchend", onUp);

    return () => {
      slider.removeEventListener("mousedown", onDown);
      slider.removeEventListener("mousemove", onMove);
      slider.removeEventListener("mouseup", onUp);
      slider.removeEventListener("mouseleave", onUp);

      slider.removeEventListener("touchstart", onDown);
      slider.removeEventListener("touchmove", onMove);
      slider.removeEventListener("touchend", onUp);
    };
  }, []);

  return (
    <section className="bg-white py-10">
      <div className="max-w-7xl mx-auto px-6">
        <div
          ref={sliderRef}
          className="
            flex gap-8
    overflow-x-auto
    scroll-smooth
    snap-x snap-mandatory
    cursor-grab
    select-none
    pb-4
            no-scrollbar
          "
        >
          {products.map((product) => (
            <div
              key={product.id}
              className="snap-start flex-shrink-0 w-[320px]"
            >
              <ProductCard product={product} />
            </div>
          ))}
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

  return (
    <div
      onClick={() => navigate(`/product/${id}`)}
      className="
        h-[520px]
        bg-white
        rounded-3xl
        border border-black/10
        shadow-sm
        hover:shadow-xl
        transition
        flex flex-col
        cursor-pointer
      "
    >
      <div className="h-60 flex items-center justify-center">
        <img
          src={imageSrc}
          alt={name}
          draggable={false}
          onError={(e) => (e.currentTarget.src = FALLBACK_IMAGE)}
          className="max-h-full max-w-full object-contain pointer-events-none"
        />
      </div>

      <div className="flex flex-col flex-1 px-6 pt-4">
        <h3 className="font-semibold text-lg line-clamp-2 min-h-[48px]">
          {name}
        </h3>

        <p className="text-sm text-gray-500 line-clamp-2 min-h-[40px] mt-1">
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
              className={`text-xs px-3 py-1 rounded-full ${inStock
                  ? "bg-green-50 text-green-700 border border-green-200"
                  : "bg-red-50 text-red-600 border border-red-200"
                }`}
            >
              {inStock ? "In Stock" : "Out of Stock"}
            </span>
          </div>

          <button className="mt-4 w-full bg-black text-white py-3 rounded-full text-sm hover:bg-gray-800 transition">
            View Product →
          </button>
        </div>
      </div>
    </div>
  );
}
