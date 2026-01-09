import { useEffect, useState } from "react";
import {
  collection,
  addDoc,
  getDocs,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "../Firebase";
import { useNavigate } from "react-router-dom";
import { X, Plus } from "lucide-react";

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

  const addSpec = () =>
    setSpecs([...specs, { key: "", value: "" }]);

  const removeSpec = (index) =>
    setSpecs(specs.filter((_, i) => i !== index));

  const saveProduct = async () => {
    if (!form.name || !form.collection) {
      alert("Product name & collection required");
      return;
    }

    const specsObject = {};
    specs.forEach((s) => {
      if (s.key && s.value)
        specsObject[s.key] = s.value;
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
    <div className="max-w-4xl mx-auto bg-gradient-to-br from-gray-50 to-white p-6 rounded-3xl">
      <div className="bg-white/80 backdrop-blur rounded-2xl shadow-sm ring-1 ring-black/5 p-6 space-y-8">
        {/* HEADER */}
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">
            Add Product
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            Create a new product for your store
          </p>
        </div>

        {/* BASIC INFO */}
        <Section title="Basic Information">
          <Input
            placeholder="Product Name"
            onChange={(e) =>
              setForm({ ...form, name: e.target.value })
            }
          />
          <Input
            placeholder="SKU"
            onChange={(e) =>
              setForm({ ...form, sku: e.target.value })
            }
          />
          <Textarea
            placeholder="Short Description"
            rows={3}
            onChange={(e) =>
              setForm({
                ...form,
                description: e.target.value,
              })
            }
          />
        </Section>

        {/* COLLECTION & PRICE */}
        <Section title="Pricing & Collection">
          <div className="grid md:grid-cols-2 gap-4">
            <Select
              onChange={(e) =>
                setForm({
                  ...form,
                  collection: e.target.value,
                })
              }
            >
              <option value="">Select Collection</option>
              {collections.map((c) => (
                <option key={c.slug} value={c.slug}>
                  {c.name}
                </option>
              ))}
            </Select>

            <div className="flex gap-3">
              <Input
                type="number"
                placeholder="Price"
                onChange={(e) =>
                  setForm({
                    ...form,
                    price: e.target.value,
                  })
                }
              />
              <Input
                type="number"
                placeholder="Old Price"
                onChange={(e) =>
                  setForm({
                    ...form,
                    oldPrice: e.target.value,
                  })
                }
              />
            </div>
          </div>
        </Section>

        {/* USAGE */}
        <Section title="Usage Information">
          <Select
            onChange={(e) =>
              setForm({
                ...form,
                usageType: e.target.value,
              })
            }
          >
            <option value="">Usage Type</option>
            {USAGE_OPTIONS.map((o) => (
              <option key={o}>{o}</option>
            ))}
          </Select>

          <Textarea
            placeholder="Usage Guidelines"
            onChange={(e) =>
              setForm({
                ...form,
                usageGuidelines: e.target.value,
              })
            }
          />
        </Section>

        {/* ADDITIONAL */}
        <Section title="Additional Information">
          <Select
            onChange={(e) =>
              setForm({
                ...form,
                additionalType: e.target.value,
              })
            }
          >
            <option value="">
              Additional Info Type
            </option>
            {ADDITIONAL_OPTIONS.map((o) => (
              <option key={o}>{o}</option>
            ))}
          </Select>

          <Textarea
            placeholder="Additional Information"
            onChange={(e) =>
              setForm({
                ...form,
                additionalInfo: e.target.value,
              })
            }
          />
        </Section>

        {/* VISIBILITY */}
        <label className="flex items-center gap-3 text-sm">
          <input
            type="checkbox"
            checked={form.isActive}
            onChange={(e) =>
              setForm({
                ...form,
                isActive: e.target.checked,
              })
            }
            className="accent-black"
          />
          Show product on website
        </label>

        {/* SPECS */}
        <Section title="Specifications">
          {specs.map((s, i) => (
            <div
              key={i}
              className="flex gap-2 items-center mb-2"
            >
              <Input
                placeholder="Key"
                value={s.key}
                onChange={(e) =>
                  updateSpec(i, "key", e.target.value)
                }
              />
              <Input
                placeholder="Value"
                value={s.value}
                onChange={(e) =>
                  updateSpec(i, "value", e.target.value)
                }
              />

              <button
                onClick={() => removeSpec(i)}
                className="p-2 rounded-lg hover:bg-red-50 text-red-600 transition"
              >
                <X size={16} />
              </button>
            </div>
          ))}

          <button
            onClick={addSpec}
            className="flex items-center gap-2 text-sm text-blue-600 hover:underline"
          >
            <Plus size={14} />
            Add Specification
          </button>
        </Section>

        {/* SAVE */}
        <div className="pt-4">
          <button
            onClick={saveProduct}
            className="bg-black text-white px-6 py-2.5 rounded-xl shadow-sm hover:opacity-90 transition"
          >
            Save Product
          </button>
        </div>
      </div>
    </div>
  );
}

/* ---------------- UI HELPERS ---------------- */

function Section({ title, children }) {
  return (
    <section className="space-y-4">
      <h3 className="font-semibold text-sm text-gray-700">
        {title}
      </h3>
      {children}
    </section>
  );
}

function Input(props) {
  return (
    <input
      {...props}
      className="w-full rounded-xl bg-white ring-1 ring-black/10 px-3 py-2 focus:ring-2 focus:ring-black/30 outline-none transition"
    />
  );
}

function Textarea(props) {
  return (
    <textarea
      {...props}
      className="w-full rounded-xl bg-white ring-1 ring-black/10 px-3 py-2 focus:ring-2 focus:ring-black/30 outline-none transition"
    />
  );
}

function Select(props) {
  return (
    <select
      {...props}
      className="w-full rounded-xl bg-white ring-1 ring-black/10 px-3 py-2 focus:ring-2 focus:ring-black/30 outline-none transition"
    />
  );
}
