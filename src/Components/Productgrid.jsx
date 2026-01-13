import { useRef, useEffect, useState } from "react";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../Firebase";
import { Star } from "lucide-react";
import { useNavigate } from "react-router-dom";

const FALLBACK_IMAGE = "/placeholder.png";

export default function ProductSlider() {
  const sliderRef = useRef(null);
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();

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

  /* ================= DESKTOP DRAG SCROLL ================= */
  useEffect(() => {
    const slider = sliderRef.current;
    if (!slider) return;

    let isDown = false;
    let startX;
    let scrollLeft;

    const mouseDown = (e) => {
      isDown = true;
      slider.classList.add("cursor-grabbing");
      startX = e.pageX - slider.offsetLeft;
      scrollLeft = slider.scrollLeft;
    };

    const mouseLeave = () => {
      isDown = false;
      slider.classList.remove("cursor-grabbing");
    };

    const mouseUp = () => {
      isDown = false;
      slider.classList.remove("cursor-grabbing");
    };

    const mouseMove = (e) => {
      if (!isDown) return;
      e.preventDefault();
      const x = e.pageX - slider.offsetLeft;
      const walk = (x - startX) * 1.5;
      slider.scrollLeft = scrollLeft - walk;
    };

    slider.addEventListener("mousedown", mouseDown);
    slider.addEventListener("mouseleave", mouseLeave);
    slider.addEventListener("mouseup", mouseUp);
    slider.addEventListener("mousemove", mouseMove);

    return () => {
      slider.removeEventListener("mousedown", mouseDown);
      slider.removeEventListener("mouseleave", mouseLeave);
      slider.removeEventListener("mouseup", mouseUp);
      slider.removeEventListener("mousemove", mouseMove);
    };
  }, []);

  return (
    <section className="bg-white py-20 relative z-10">
      <div className="max-w-7xl mx-auto px-6">
        <div
          ref={sliderRef}
          className="
            flex gap-8 overflow-x-auto py-6
            cursor-grab select-none
            scrollbar-hide
          "
        >
          {products.map((product) => (
            <div key={product.id} className="min-w-[320px]">
              <ProductCard product={product} navigate={navigate} />
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

function ProductCard({ product, navigate }) {
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
    <div className="h-130 bg-white rounded-3xl border border-black/10 shadow-sm hover:shadow-xl transition overflow-hidden flex flex-col">
      
      {/* IMAGE */}
      <div className="h-60 bg-gray-100 flex items-center justify-center p-6">
        <img
          src={imageSrc}
          alt={name}
          className="max-h-full max-w-full object-contain"
          draggable={false}
          onError={(e) => (e.currentTarget.src = FALLBACK_IMAGE)}
        />
      </div>

      {/* CONTENT */}
      <div className="flex flex-col flex-1 px-6 pt-4">
        <h3 className="font-semibold text-lg line-clamp-2 min-h-12">
          {name}
        </h3>

        <p className="text-sm text-gray-500 line-clamp-2 min-h-10 mt-1">
          {description}
        </p>

        {/* RATING */}
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

        {/* PRICE + STOCK */}
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

          <button
            onClick={() => navigate(`/product/${id}`)}
            className="mt-4 w-full bg-black text-white py-3 rounded-full text-sm hover:bg-gray-800 transition"
          >
            View Product →
          </button>
        </div>
      </div>
    </div>
  );
}
