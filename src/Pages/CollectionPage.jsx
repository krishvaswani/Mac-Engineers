import { useEffect, useState } from "react";
import BannerHero from "../Components/BannerHero"
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

export default function CollectionPage() {
  const { slug } = useParams();

  const [collectionData, setCollectionData] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      // 🔹 Get collection info
      const colRef = doc(db, "collections", slug);
      const colSnap = await getDoc(colRef);

      if (!colSnap.exists()) {
        setLoading(false);
        return;
      }

      setCollectionData(colSnap.data());

      // 🔹 Get products of this collection
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
        <BannerHero/>
    <div className="max-w-7xl mx-auto px-4 py-12">
    
      {/* HEADER */}
      <div className="mb-10">
        <h1 className="text-3xl font-semibold mb-2">
          {collectionData.name}
        </h1>
        <p className="text-gray-600">
          {collectionData.description}
        </p>
      </div>

      {/* PRODUCTS GRID */}
      {products.length === 0 ? (
        <p className="text-gray-500">
          No products available in this collection.
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((p) => (
            <Link
              key={p.id}
              to={`/product/${p.id}`}
              className="border rounded-xl p-4 hover:shadow-md transition bg-white"
            >
              {/* IMAGE PLACEHOLDER */}
              <div className="h-48 bg-gray-100 rounded mb-4 flex items-center justify-center text-gray-400">
                Product Image
              </div>

              <h3 className="font-semibold mb-1">
                {p.name}
              </h3>

              <p className="text-sm text-gray-500 mb-2">
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
    </div></>
  );
}
