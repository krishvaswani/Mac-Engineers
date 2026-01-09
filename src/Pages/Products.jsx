import { useEffect, useState } from "react";
import { collection, getDocs, query, where } from "firebase/firestore";
import BannerHero from '../Components/BannerHero'
import { db } from "../Firebase";
import { Link } from "react-router-dom";

export default function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

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

  if (loading) {
    return (
      <div className="py-40 text-center text-gray-500">
        Loading products…
      </div>
    );
  }

  return (
    <>
    <BannerHero/>
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

      {/* GRID */}
      {products.length === 0 ? (
        <p className="text-gray-500">
          No products available.
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((p) => (
            <Link
              key={p.id}
              to={`/product/${p.id}`}
              className="bg-white border rounded-xl p-4 hover:shadow-md transition"
            >
              {/* IMAGE PLACEHOLDER */}
              <div className="h-48 bg-gray-100 rounded mb-4 flex items-center justify-center text-gray-400">
                Product Image
              </div>

              <h3 className="font-semibold mb-1">
                {p.name}
              </h3>

              <p className="text-sm text-gray-500 mb-3">
                {p.description}
              </p>

              <div className="flex justify-between items-center">
                <span className="font-semibold text-blue-600">
                  ₹{p.price}
                </span>

                {p.inStock ? (
                  <span className="text-xs px-2 py-1 bg-green-100 text-green-700 rounded">
                    In Stock
                  </span>
                ) : (
                  <span className="text-xs px-2 py-1 bg-red-100 text-red-600 rounded">
                    Out of Stock
                  </span>
                )}
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
    </>
  );
}
