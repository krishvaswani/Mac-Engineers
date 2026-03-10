import { useEffect, useRef, useState } from "react";
import {
  collection,
  getDocs,
  deleteDoc,
  doc,
  writeBatch,
} from "firebase/firestore";
import { db } from "../Firebase";
import { Link } from "react-router-dom";
import {
  Plus,
  Pencil,
  Trash2,
  Package,
  GripVertical,
  Save,
} from "lucide-react";

export default function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [orderChanged, setOrderChanged] = useState(false);

  // Drag state refs (avoid re-renders during drag)
  const dragIndex = useRef(null);
  const dragOverIndex = useRef(null);

  /* ─── Fetch ─── */
  const fetchProducts = async () => {
    setLoading(true);
    const snap = await getDocs(collection(db, "products"));
    const items = snap.docs.map((d) => ({ id: d.id, ...d.data() }));

    // Sort by saved `order` field if present, otherwise keep Firestore order
    items.sort((a, b) => (a.order ?? 0) - (b.order ?? 0));

    setProducts(items);
    setLoading(false);
    setOrderChanged(false);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  /* ─── Delete ─── */
  const deleteProduct = async (id) => {
    if (!window.confirm("Delete this product permanently?")) return;
    await deleteDoc(doc(db, "products", id));
    fetchProducts();
  };

  /* ─── Save order to Firestore ─── */
  const saveOrder = async () => {
    setSaving(true);
    const batch = writeBatch(db);
    products.forEach((p, i) => {
      batch.update(doc(db, "products", p.id), { order: i });
    });
    await batch.commit();
    setSaving(false);
    setOrderChanged(false);
  };

  /* ─── Drag handlers ─── */
  const onDragStart = (index) => {
    dragIndex.current = index;
  };

  const onDragEnter = (index) => {
    if (dragIndex.current === index) return;
    dragOverIndex.current = index;

    setProducts((prev) => {
      const next = [...prev];
      const [moved] = next.splice(dragIndex.current, 1);
      next.splice(index, 0, moved);
      dragIndex.current = index;
      return next;
    });
  };

  const onDragEnd = () => {
    dragIndex.current = null;
    dragOverIndex.current = null;
    setOrderChanged(true);
  };

  /* ─── UI ─── */
  return (
    <div className="space-y-8">
      {/* HEADER */}
      <div className="bg-white/60 backdrop-blur-xl rounded-3xl p-6 ring-1 ring-black/5 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-gray-900">
            Products
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            Manage all products · drag rows to reorder
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Save order button — only visible when order has changed */}
          {orderChanged && (
            <button
              onClick={saveOrder}
              disabled={saving}
              className="
                cursor-pointer flex items-center gap-2
                bg-emerald-500 hover:bg-emerald-600
                text-white px-5 py-3 rounded-xl
                shadow-md hover:shadow-lg transition disabled:opacity-60
              "
            >
              <Save size={16} />
              {saving ? "Saving…" : "Save Order"}
            </button>
          )}

          <Link
            to="/admin/products/add"
            className="
              cursor-pointer flex items-center gap-2
              bg-linear-to-r from-blue-600 to-blue-700
              text-white px-6 py-3 rounded-xl
              shadow-md hover:shadow-lg transition
            "
          >
            <Plus size={16} />
            Add Product
          </Link>
        </div>
      </div>

      {/* TABLE CARD */}
      <div className="bg-white/70 backdrop-blur-xl rounded-3xl shadow-sm ring-1 ring-black/5 overflow-x-auto">
        {loading ? (
          <div className="p-12 text-center text-blue-600 font-medium">
            Loading products…
          </div>
        ) : products.length === 0 ? (
          <div className="p-12 text-center text-gray-500">
            No products found.
          </div>
        ) : (
          <table className="w-full min-w-225 text-sm">
            <thead className="bg-black/5 text-gray-600">
              <tr>
                {/* Drag handle column */}
                <th className="px-3 py-4 w-8" />
                <th className="px-5 py-4 text-left">Product</th>
                <th className="px-5 py-4 text-left">SKU</th>
                <th className="px-5 py-4 text-left">Collection</th>
                <th className="px-5 py-4 text-left">Price</th>
                <th className="px-5 py-4 text-left">Stock</th>
                <th className="px-5 py-4 text-right">Actions</th>
              </tr>
            </thead>

            <tbody>
              {products.map((p, index) => (
                <tr
                  key={p.id}
                  draggable
                  onDragStart={() => onDragStart(index)}
                  onDragEnter={() => onDragEnter(index)}
                  onDragEnd={onDragEnd}
                  onDragOver={(e) => e.preventDefault()}
                  className="hover:bg-black/5 transition cursor-default select-none"
                  style={{
                    opacity: dragIndex.current === index ? 0.5 : 1,
                  }}
                >
                  {/* DRAG HANDLE */}
                  <td className="px-3 py-4">
                    <span
                      className="flex items-center justify-center text-gray-400 hover:text-gray-600 cursor-grab active:cursor-grabbing"
                      title="Drag to reorder"
                    >
                      <GripVertical size={18} />
                    </span>
                  </td>

                  {/* PRODUCT */}
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-4">
                      <div className="h-10 w-10 rounded-xl bg-linear-to-br from-blue-100 to-blue-200 flex items-center justify-center text-blue-700 shrink-0">
                        <Package size={18} />
                      </div>
                      <div>
                        <Link
                          to={`/admin/products/edit/${p.id}`}
                          className="cursor-pointer font-medium text-gray-900 hover:underline"
                        >
                          {p.name}
                        </Link>
                        <p className="text-xs text-gray-500">ID: {p.id}</p>
                      </div>
                    </div>
                  </td>

                  {/* SKU */}
                  <td className="px-5 py-4 text-gray-500">{p.sku || "-"}</td>

                  {/* COLLECTION */}
                  <td className="px-5 py-4">{p.collection || "-"}</td>

                  {/* PRICE */}
                  <td className="px-5 py-4 font-medium text-gray-900">
                    ₹{p.price}
                  </td>

                  {/* STOCK */}
                  <td className="px-5 py-4">
                    <span
                      className={`
                        px-3 py-1 text-xs rounded-full ring-1
                        ${
                          p.inStock
                            ? "bg-green-50 text-green-700 ring-green-200"
                            : "bg-red-50 text-red-600 ring-red-200"
                        }
                      `}
                    >
                      {p.inStock ? "In Stock" : "Out of Stock"}
                    </span>
                  </td>

                  {/* ACTIONS */}
                  <td className="px-5 py-4 text-right">
                    <div className="inline-flex gap-3">
                      <Link
                        to={`/admin/products/edit/${p.id}`}
                        className="cursor-pointer p-2.5 rounded-lg hover:bg-black/10 transition"
                        title="Edit"
                      >
                        <Pencil size={16} />
                      </Link>

                      <button
                        onClick={() => deleteProduct(p.id)}
                        className="cursor-pointer p-2.5 rounded-lg hover:bg-red-50 text-red-600 transition"
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