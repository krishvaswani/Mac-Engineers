import { useEffect, useState } from "react";
import BannerHero from "../Components/BannerHero";
import { useParams, Link } from "react-router-dom";
import {
  collection,
  getDocs,
  query,
  where,
  doc,
  getDoc,
} from "firebase/firestore";
import { db } from "../Firebase";
import { motion } from "framer-motion";

export default function CollectionPage() {
  const { slug } = useParams();

  const [collectionData, setCollectionData] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      // Get collection info
      const colRef = doc(db, "collections", slug);
      const colSnap = await getDoc(colRef);

      if (!colSnap.exists()) {
        setLoading(false);
        return;
      }

      setCollectionData(colSnap.data());

      // Get products
      const q = query(
        collection(db, "products"),
        where("collection", "==", slug),
        where("isActive", "==", true)
      );

      const prodSnap = await getDocs(q);
      setProducts(
        prodSnap.docs.map((d) => ({
          id: d.id,
          ...d.data(),
        }))
      );

      setLoading(false);
    };

    fetchData();
  }, [slug]);

  if (loading) {
    return (
      <div className="py-40 text-center text-gray-500">
        Loading collection…
      </div>
    );
  }

  if (!collectionData) {
    return (
      <div className="py-40 text-center text-gray-500">
        Collection not found
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
              {collectionData.name}
            </h1>
            <p className="text-gray-600 max-w-3xl">
              {collectionData.description}
            </p>
          </div>

          {/* GRID */}
          {products.length === 0 ? (
            <p className="text-gray-500">
              No products available in this collection.
            </p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {products.map((p) => (
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
                    {/* IMAGE (SAME AS PRODUCTS PAGE) */}
                    <div className="bg-white-50 h-72 flex items-center justify-center overflow-hidden">
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

                      <div className="flex justify-between items-center pt-2">
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
            </div>
          )}
        </div>
      </motion.div>
    </>
  );
}
