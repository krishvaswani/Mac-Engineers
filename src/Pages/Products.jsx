import { useEffect, useMemo, useState } from "react";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../Firebase";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import BannerHero from "../Components/BannerHero";
import { ChevronDown } from "lucide-react";

export default function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [stockFilter, setStockFilter] = useState("all");
  const [sortBy, setSortBy] = useState("latest");
  const [maxPrice, setMaxPrice] = useState("");

  useEffect(() => {
    const fetchProducts = async () => {
      const q = query(
        collection(db, "products"),
        where("isActive", "==", true)
      );

      const snap = await getDocs(q);
      setProducts(
        snap.docs.map((d) => ({
          id: d.id,
          ...d.data(),
        }))
      );

      setLoading(false);
    };

    fetchProducts();
  }, []);

  // Filter + Sort
  const filteredProducts = useMemo(() => {
    let list = [...products];

    if (stockFilter !== "all") {
      list = list.filter(
        (p) => p.inStock === (stockFilter === "in")
      );
    }

    if (maxPrice) {
      list = list.filter(
        (p) => p.price <= Number(maxPrice)
      );
    }

    switch (sortBy) {
      case "price-low":
        list.sort((a, b) => a.price - b.price);
        break;
      case "price-high":
        list.sort((a, b) => b.price - a.price);
        break;
      case "name":
        list.sort((a, b) =>
          a.name.localeCompare(b.name)
        );
        break;
      default:
        break;
    }

    return list;
  }, [products, stockFilter, sortBy, maxPrice]);

  if (loading) {
    return (
      <div className="py-40 text-center text-gray-500">
        Loading products…
      </div>
    );
  }

  return (
    <>
      <BannerHero />

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="bg-linear-to-b from-white to-gray-50"
      >
        <div className="max-w-7xl mx-auto px-4 py-12">

          {/* HEADER */}
          <div className="mb-10">
            <h1 className="text-3xl font-semibold mb-2">
              All Products
            </h1>
            <p className="text-gray-600">
              Browse our complete product range
            </p>
          </div>

          {/* FILTER BAR */}
          <div className="
            bg-white
            rounded-3xl
            border border-black/5
            px-6 py-4
            mb-10
            flex flex-wrap gap-4 items-center
          ">
            {/* Stock */}
            <select
              value={stockFilter}
              onChange={(e) => setStockFilter(e.target.value)}
              className="border border-black/10 rounded-xl px-4 py-2 cursor-pointer"
            >
              <option value="all">All Stock</option>
              <option value="in">In Stock</option>
              <option value="out">Out of Stock</option>
            </select>

            {/* Price */}
            <input
              type="number"
              placeholder="Max price"
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
              className="border border-black/10 rounded-xl px-4 py-2 w-40"
            />

            {/* Sort */}
            <div className="relative">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="border border-black/10 rounded-xl px-4 py-2 pr-10 cursor-pointer"
              >
                <option value="latest">Latest</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="name">Name: A–Z</option>
              </select>
              <ChevronDown
                size={16}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
              />
            </div>
          </div>

          {/* GRID */}
          {filteredProducts.length === 0 ? (
            <p className="text-gray-500">
              No products found.
            </p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredProducts.map((p) => (
                <motion.div
                  key={p.id}
                  whileHover={{ y: -4 }}
                  transition={{ duration: 0.2 }}
                >
                  <Link
                    to={`/product/${p.id}`}
                    className="
                      bg-white
                      border border-black/5
                      rounded-3xl
                      overflow-hidden
                      hover:shadow-md
                      transition
                      cursor-pointer
                      block
                    "
                  >
                    {/* IMAGE */}
                    <div className="bg-gray-50 h-72 flex items-center justify-center overflow-hidden">
                      {p.images?.[0] ? (
                        <img
                          src={p.images[0]}
                          alt={p.name}
                          className="w-full h-full object-contain transition-transform duration-300 hover:scale-105"
                        />
                      ) : (
                        <span className="text-gray-400 text-sm">
                          No Image
                        </span>
                      )}
                    </div>

                    {/* CONTENT */}
                    <div className="p-5 space-y-3">
                      <h3 className="font-semibold text-lg">
                        {p.name}
                      </h3>

                      <p className="text-sm text-gray-500 line-clamp-2">
                        {p.description}
                      </p>

                      {/* PRICE + STOCK */}
                      <div className="flex justify-between items-center pt-2">
                        <div className="flex items-center gap-2">
                          {/* OLD PRICE (HIDDEN IF 0 / EMPTY) */}
                          {/* {p.oldPrice && p.oldPrice > 0 && (
                            <span className="text-sm text-gray-400 line-through">
                              ₹{p.oldPrice}
                            </span>
                          )} */}

                          {/* CURRENT PRICE */}
                          <span className="font-semibold text-black">
                            ₹{p.price}
                          </span>
                        </div>

                        {p.inStock ? (
                          <span className="
                            text-xs px-3 py-1 rounded-full
                            bg-green-50 border border-green-200 text-green-700
                          ">
                            In Stock
                          </span>
                        ) : (
                          <span className="
                            text-xs px-3 py-1 rounded-full
                            bg-red-50 border border-red-200 text-red-600
                          ">
                            Out of Stock
                          </span>
                        )}
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </motion.div>
    </>
  );
}
