import { useEffect, useState } from "react";
import { collection, addDoc, getDocs, serverTimestamp } from "firebase/firestore";
import { db } from "../Firebase";
import { useNavigate } from "react-router-dom";
import { X } from "lucide-react";

const USAGE_OPTIONS = [
  "Residential",
  "Commercial",
  "Industrial",
  "HVAC",
  "Oil & Gas",
];

const ADDITIONAL_OPTIONS = [
  "Warranty Information",
  "Installation Notes",
  "Maintenance Details",
  "Safety Instructions",
];

export default function AddProduct() {
  const navigate = useNavigate();
  const [collections, setCollections] = useState([]);
  const [specs, setSpecs] = useState([{ key: "", value: "" }]);

  const [form, setForm] = useState({
    name: "",
    sku: "",
    price: "",
    oldPrice: "",
    description: "",
    collection: "",
    inStock: true,
    isActive: true,
    usageType: "",
    usageGuidelines: "",
    additionalType: "",
    additionalInfo: "",
  });

  useEffect(() => {
    const fetchCollections = async () => {
      const snap = await getDocs(collection(db, "collections"));
      setCollections(snap.docs.map((d) => d.data()));
    };
    fetchCollections();
  }, []);

  const updateSpec = (i, field, value) => {
    const copy = [...specs];
    copy[i][field] = value;
    setSpecs(copy);
  };

  const addSpec = () => setSpecs([...specs, { key: "", value: "" }]);

  const removeSpec = (index) =>
    setSpecs(specs.filter((_, i) => i !== index));

  const saveProduct = async () => {
    if (!form.name || !form.collection) {
      alert("Product name & collection required");
      return;
    }

    const specsObject = {};
    specs.forEach((s) => {
      if (s.key && s.value) specsObject[s.key] = s.value;
    });

    await addDoc(collection(db, "products"), {
      ...form,
      price: Number(form.price),
      oldPrice: Number(form.oldPrice),
      specs: specsObject,
      createdAt: serverTimestamp(),
    });

    navigate("/admin/products");
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white border rounded-2xl p-6 space-y-6">
        <h1 className="text-2xl font-semibold">Add Product</h1>

        {/* BASIC INFO */}
        <section className="space-y-3">
          <input className="border p-2 w-full rounded" placeholder="Product Name"
            onChange={(e) => setForm({ ...form, name: e.target.value })} />

          <input className="border p-2 w-full rounded" placeholder="SKU"
            onChange={(e) => setForm({ ...form, sku: e.target.value })} />

          <textarea className="border p-2 w-full rounded" rows={3}
            placeholder="Short Description"
            onChange={(e) => setForm({ ...form, description: e.target.value })} />
        </section>

        {/* COLLECTION & PRICE */}
        <section className="grid md:grid-cols-2 gap-4">
          <select className="border p-2 rounded"
            onChange={(e) => setForm({ ...form, collection: e.target.value })}>
            <option value="">Select Collection</option>
            {collections.map((c) => (
              <option key={c.slug} value={c.slug}>{c.name}</option>
            ))}
          </select>

          <div className="flex gap-3">
            <input type="number" className="border p-2 w-full rounded"
              placeholder="Price"
              onChange={(e) => setForm({ ...form, price: e.target.value })} />
            <input type="number" className="border p-2 w-full rounded"
              placeholder="Old Price"
              onChange={(e) => setForm({ ...form, oldPrice: e.target.value })} />
          </div>
        </section>

        {/* USAGE */}
        <section className="space-y-3">
          <select className="border p-2 w-full rounded"
            onChange={(e) => setForm({ ...form, usageType: e.target.value })}>
            <option value="">Usage Type</option>
            {USAGE_OPTIONS.map(o => <option key={o}>{o}</option>)}
          </select>

          <textarea className="border p-2 w-full rounded"
            placeholder="Usage Guidelines"
            onChange={(e) => setForm({ ...form, usageGuidelines: e.target.value })} />
        </section>

        {/* ADDITIONAL INFO */}
        <section className="space-y-3">
          <select className="border p-2 w-full rounded"
            onChange={(e) => setForm({ ...form, additionalType: e.target.value })}>
            <option value="">Additional Info Type</option>
            {ADDITIONAL_OPTIONS.map(o => <option key={o}>{o}</option>)}
          </select>

          <textarea className="border p-2 w-full rounded"
            placeholder="Additional Information"
            onChange={(e) => setForm({ ...form, additionalInfo: e.target.value })} />
        </section>

        {/* VISIBILITY */}
        <label className="flex items-center gap-2">
          <input type="checkbox" checked={form.isActive}
            onChange={(e) => setForm({ ...form, isActive: e.target.checked })} />
          Show product on website
        </label>

        {/* SPECS */}
        <section>
          <h3 className="font-semibold mb-3">Specifications</h3>

          {specs.map((s, i) => (
            <div key={i} className="flex gap-2 mb-2">
              <input className="border p-2 w-full rounded" placeholder="Key"
                value={s.key}
                onChange={(e) => updateSpec(i, "key", e.target.value)} />
              <input className="border p-2 w-full rounded" placeholder="Value"
                value={s.value}
                onChange={(e) => updateSpec(i, "value", e.target.value)} />

              <button onClick={() => removeSpec(i)}
                className="text-red-500 px-2">
                <X size={16} />
              </button>
            </div>
          ))}

          <button onClick={addSpec} className="text-blue-600 text-sm">
            + Add Specification
          </button>
        </section>

        <button onClick={saveProduct}
          className="bg-black text-white px-6 py-2 rounded-lg">
          Save Product
        </button>
      </div>
    </div>
  );
}
