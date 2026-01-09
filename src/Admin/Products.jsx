import { useEffect, useState } from "react";
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";
import { db } from "../Firebase";
import { Link } from "react-router-dom";

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
    if (!window.confirm("Delete this product?")) return;
    await deleteDoc(doc(db, "products", id));
    fetchProducts();
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Products</h1>

        <Link
          to="/admin/products/add"
          className="bg-black text-white px-5 py-2 rounded-lg"
        >
          + Add Product
        </Link>
      </div>

      {/* TABLE */}
      <div className="bg-white border rounded-xl overflow-x-auto">
        {loading ? (
          <p className="p-6 text-gray-500">Loading products…</p>
        ) : products.length === 0 ? (
          <p className="p-6 text-gray-500">No products found.</p>
        ) : (
          <table className="w-full min-w-225 text-sm">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-4 py-3 text-left">ID</th>
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
                <tr key={p.id} className="border-b last:border-none">
                  {/* PRODUCT ID */}
                  <td className="px-4 py-3 text-xs text-gray-500">
                    {p.id}
                  </td>

                  {/* PRODUCT TITLE */}
                  <td className="px-4 py-3 font-medium">
                    <Link
                      to={`/admin/products/edit/${p.id}`}
                      className="text-blue-600 hover:underline"
                    >
                      {p.name}
                    </Link>
                  </td>

                  <td className="px-4 py-3 text-gray-500">
                    {p.sku || "-"}
                  </td>

                  <td className="px-4 py-3">
                    {p.collection || "-"}
                  </td>

                  <td className="px-4 py-3">
                    ₹{p.price}
                  </td>

                  <td className="px-4 py-3">
                    <span
                      className={`px-2 py-1 text-xs rounded-full ${
                        p.inStock
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-600"
                      }`}
                    >
                      {p.inStock ? "In Stock" : "Out of Stock"}
                    </span>
                  </td>

                  <td className="px-4 py-3 text-right space-x-3">
                    <Link
                      to={`/admin/products/edit/${p.id}`}
                      className="text-blue-600"
                    >
                      Edit
                    </Link>

                    <button
                      onClick={() => deleteProduct(p.id)}
                      className="text-red-500"
                    >
                      Delete
                    </button>
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
