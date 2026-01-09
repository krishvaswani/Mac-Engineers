import { useEffect, useState } from "react";
import {
  collection,
  getDocs,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { db } from "../Firebase";
import { Link } from "react-router-dom";
import {
  Plus,
  Pencil,
  Trash2,
  Package,
} from "lucide-react";

export default function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchProducts = async () => {
    setLoading(true);
    const snap = await getDocs(collection(db, "products"));
    setProducts(
      snap.docs.map((d) => ({
        id: d.id,
        ...d.data(),
      }))
    );
    setLoading(false);
  };

  const deleteProduct = async (id) => {
    if (!window.confirm("Delete this product permanently?")) return;
    await deleteDoc(doc(db, "products", id));
    fetchProducts();
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <div className="space-y-6 bg-linear-to-br from-gray-50 to-white p-6 rounded-3xl">
      {/* HEADER */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">
            Products
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            Manage all products in your store
          </p>
        </div>

        <Link
          to="/admin/products/add"
          className="flex items-center gap-2 bg-black text-white px-5 py-2.5 rounded-xl shadow-sm hover:opacity-90 transition"
        >
          <Plus size={16} />
          Add Product
        </Link>
      </div>

      {/* TABLE CARD */}
      <div className="bg-white/80 backdrop-blur rounded-2xl shadow-sm ring-1 ring-black/5 overflow-x-auto">
        {loading ? (
          <div className="p-10 text-center text-gray-500">
            Loading products…
          </div>
        ) : products.length === 0 ? (
          <div className="p-10 text-center text-gray-500">
            No products found.
          </div>
        ) : (
          <table className="w-full min-w-225 text-sm">
            <thead className="bg-black/5 text-gray-600">
              <tr>
                <th className="px-4 py-3 text-left">Product</th>
                <th className="px-4 py-3 text-left">SKU</th>
                <th className="px-4 py-3 text-left">Collection</th>
                <th className="px-4 py-3 text-left">Price</th>
                <th className="px-4 py-3 text-left">Stock</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>

            <tbody>
              {products.map((p) => (
                <tr
                  key={p.id}
                  className="hover:bg-black/5 transition"
                >
                  {/* PRODUCT */}
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="h-9 w-9 rounded-full bg-black/5 flex items-center justify-center text-gray-600">
                        <Package size={16} />
                      </div>

                      <div>
                        <Link
                          to={`/admin/products/edit/${p.id}`}
                          className="font-medium hover:underline"
                        >
                          {p.name}
                        </Link>
                        <p className="text-xs text-gray-500">
                          ID: {p.id}
                        </p>
                      </div>
                    </div>
                  </td>

                  {/* SKU */}
                  <td className="px-4 py-3 text-gray-500">
                    {p.sku || "-"}
                  </td>

                  {/* COLLECTION */}
                  <td className="px-4 py-3">
                    {p.collection || "-"}
                  </td>

                  {/* PRICE */}
                  <td className="px-4 py-3 font-medium">
                    ₹{p.price}
                  </td>

                  {/* STOCK */}
                  <td className="px-4 py-3">
                    <span
                      className={`px-3 py-1 text-xs rounded-full ring-1 ${
                        p.inStock
                          ? "bg-green-50 text-green-700 ring-green-200"
                          : "bg-red-50 text-red-600 ring-red-200"
                      }`}
                    >
                      {p.inStock
                        ? "In Stock"
                        : "Out of Stock"}
                    </span>
                  </td>

                  {/* ACTIONS */}
                  <td className="px-4 py-3 text-right">
                    <div className="inline-flex gap-3">
                      <Link
                        to={`/admin/products/edit/${p.id}`}
                        className="p-2 rounded-lg hover:bg-black/10 transition"
                        title="Edit"
                      >
                        <Pencil size={16} />
                      </Link>

                      <button
                        onClick={() => deleteProduct(p.id)}
                        className="p-2 rounded-lg hover:bg-red-50 text-red-600 transition"
                        title="Delete"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
