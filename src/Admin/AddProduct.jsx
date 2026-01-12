import { useEffect, useRef, useState } from "react";
import {
  collection,
  addDoc,
  getDocs,
  serverTimestamp,
} from "firebase/firestore";
import {
  ref,
  uploadBytes,
  getDownloadURL,
} from "firebase/storage";
import { db, storage } from "../Firebase";
import { useNavigate } from "react-router-dom";
import {
  X,
  Plus,
  ImagePlus,
  FileText,
  GripVertical,
  ChevronDown,
} from "lucide-react";
import toast from "react-hot-toast";

/* ================= CONSTANTS ================= */

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

/* ================= COMPONENT ================= */

export default function AddProduct() {
  const navigate = useNavigate();

  const [collections, setCollections] = useState([]);
  const [specs, setSpecs] = useState([{ key: "", value: "" }]);
  const [images, setImages] = useState([]);
  const [pdfFile, setPdfFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const [openUsage, setOpenUsage] = useState(true);
  const [openAdditional, setOpenAdditional] = useState(false);

  const dragIndex = useRef(null);

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

  /* ================= FETCH COLLECTIONS ================= */

  useEffect(() => {
    const fetchCollections = async () => {
      const snap = await getDocs(collection(db, "collections"));
      setCollections(snap.docs.map((d) => d.data()));
    };
    fetchCollections();
  }, []);

  /* ================= SPECS ================= */

  const updateSpec = (i, field, value) => {
    const copy = [...specs];
    copy[i][field] = value;
    setSpecs(copy);
  };

  const addSpec = () =>
    setSpecs([...specs, { key: "", value: "" }]);

  const removeSpec = (index) =>
    setSpecs(specs.filter((_, i) => i !== index));

  /* ================= UPLOAD HELPERS ================= */

  const uploadImage = async (file) => {
    const imageRef = ref(
      storage,
      `products/images/${Date.now()}-${file.name}`
    );
    await uploadBytes(imageRef, file);
    return await getDownloadURL(imageRef);
  };

  const uploadPdf = async (file) => {
    const pdfRef = ref(
      storage,
      `products/pdfs/${Date.now()}-${file.name}`
    );
    await uploadBytes(pdfRef, file);
    return await getDownloadURL(pdfRef);
  };

  /* ================= SAVE PRODUCT ================= */

  const saveProduct = async () => {
    if (!form.name || !form.collection || images.length === 0) {
      toast.error("Name, collection and images are required");
      return;
    }

    try {
      setLoading(true);
      toast.loading("Saving product...", { id: "save" });

      const imageUrls = await Promise.all(
        images.map((img) => uploadImage(img))
      );

      let pdfUrl = "";
      if (pdfFile) pdfUrl = await uploadPdf(pdfFile);

      const specsObject = {};
      specs.forEach((s) => {
        if (s.key && s.value) specsObject[s.key] = s.value;
      });

      await addDoc(collection(db, "products"), {
        ...form,
        price: Number(form.price),
        oldPrice: Number(form.oldPrice),
        specs: specsObject,
        images: imageUrls,
        pdfUrl,
        createdAt: serverTimestamp(),
      });

      toast.success("Product added successfully", { id: "save" });
      navigate("/admin/products");
    } catch (error) {
      console.error(error);
      toast.error(error.message || "Failed to save product", {
        id: "save",
      });
    } finally {
      setLoading(false);
    }
  };

  /* ================= UI ================= */

  return (
    <div className="min-h-screen bg-gray-50 px-8 py-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* HEADER */}
        <div className="bg-white/60 backdrop-blur-xl rounded-3xl p-6 ring-1 ring-black/5 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">
              Add Product
            </h1>
            <p className="text-gray-500 mt-1">
              Create and publish a new product
            </p>
          </div>

          <button
            onClick={saveProduct}
            disabled={loading}
            className="
              cursor-pointer
              bg-linear-to-r from-blue-600 to-blue-700
              text-white px-8 py-3 rounded-xl
              shadow-md hover:shadow-lg
              transition disabled:opacity-60
            "
          >
            {loading ? "Saving..." : "Save Product"}
          </button>
        </div>

        <div className="grid grid-cols-12 gap-8">
          {/* LEFT */}
          <div className="col-span-8 space-y-8">
            <Card title="Basic Information">
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
                rows={4}
                placeholder="Description"
                onChange={(e) =>
                  setForm({
                    ...form,
                    description: e.target.value,
                  })
                }
              />
            </Card>

            <Card title="Images (Drag to reorder)">
              <GalleryUpload
                images={images}
                setImages={setImages}
                dragIndex={dragIndex}
              />
            </Card>

            <Card title="Specifications">
              {specs.map((s, i) => (
                <div key={i} className="flex gap-3">
                  <Input
                    value={s.key}
                    placeholder="Key"
                    onChange={(e) =>
                      updateSpec(i, "key", e.target.value)
                    }
                  />
                  <Input
                    value={s.value}
                    placeholder="Value"
                    onChange={(e) =>
                      updateSpec(i, "value", e.target.value)
                    }
                  />
                  <button
                    onClick={() => removeSpec(i)}
                    className="cursor-pointer text-red-600"
                  >
                    <X size={16} />
                  </button>
                </div>
              ))}
              <button
                onClick={addSpec}
                className="cursor-pointer text-blue-600 text-sm flex items-center gap-1"
              >
                <Plus size={14} /> Add Specification
              </button>
            </Card>

            {/* USAGE GUIDELINES */}
            <Accordion
              title="Usage Guidelines"
              open={openUsage}
              setOpen={setOpenUsage}
            >
              <Select
                value={form.usageType}
                onChange={(e) =>
                  setForm({ ...form, usageType: e.target.value })
                }
              >
                <option value="">Select Usage Type</option>
                {USAGE_OPTIONS.map((u) => (
                  <option key={u} value={u}>
                    {u}
                  </option>
                ))}
              </Select>

              <Textarea
                rows={4}
                placeholder="Enter usage guidelines"
                value={form.usageGuidelines}
                onChange={(e) =>
                  setForm({
                    ...form,
                    usageGuidelines: e.target.value,
                  })
                }
              />
            </Accordion>

            {/* ADDITIONAL INFORMATION */}
            <Accordion
              title="Additional Information"
              open={openAdditional}
              setOpen={setOpenAdditional}
            >
              <Select
                value={form.additionalType}
                onChange={(e) =>
                  setForm({
                    ...form,
                    additionalType: e.target.value,
                  })
                }
              >
                <option value="">Select Information Type</option>
                {ADDITIONAL_OPTIONS.map((a) => (
                  <option key={a} value={a}>
                    {a}
                  </option>
                ))}
              </Select>

              <Textarea
                rows={4}
                placeholder="Enter additional information"
                value={form.additionalInfo}
                onChange={(e) =>
                  setForm({
                    ...form,
                    additionalInfo: e.target.value,
                  })
                }
              />
            </Accordion>
          </div>

          {/* RIGHT */}
          <div className="col-span-4 space-y-8">
            <Card title="Pricing">
              <Input
                type="number"
                placeholder="Price"
                onChange={(e) =>
                  setForm({ ...form, price: e.target.value })
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
            </Card>

            <Card title="Collection">
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
            </Card>

            <Card title="Product PDF">
              <PdfUpload
                pdfFile={pdfFile}
                setPdfFile={setPdfFile}
              />
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ================= ACCORDION ================= */

function Accordion({ title, open, setOpen, children }) {
  return (
    <div className="bg-white rounded-2xl ring-1 ring-black/5 p-4">
      <button
        onClick={() => setOpen(!open)}
        className="cursor-pointer w-full flex items-center justify-between font-medium"
      >
        {title}
        <ChevronDown
          size={18}
          className={`transition-transform ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>

      {open && <div className="pt-4 space-y-4">{children}</div>}
    </div>
  );
}

/* ================= OTHER COMPONENTS ================= */

function PdfUpload({ pdfFile, setPdfFile }) {
  return (
    <div className="space-y-3">
      {!pdfFile ? (
        <label className="cursor-pointer border-2 border-dashed rounded-xl p-6 flex flex-col items-center hover:border-blue-400 transition">
          <FileText className="text-gray-400 mb-2" />
          <p className="text-sm text-gray-500">
            Select a PDF file
          </p>
          <input
            type="file"
            hidden
            onChange={(e) => {
              const file = e.target.files[0];
              if (!file) return;
              if (file.type !== "application/pdf") {
                toast.error("Only PDF files are allowed");
                e.target.value = "";
                return;
              }
              setPdfFile(file);
              e.target.value = "";
            }}
          />
        </label>
      ) : (
        <div className="flex items-center justify-between border rounded-xl px-4 py-3">
          <span className="text-sm truncate">{pdfFile.name}</span>
          <button
            onClick={() => setPdfFile(null)}
            className="cursor-pointer text-red-600"
          >
            <X size={16} />
          </button>
        </div>
      )}
    </div>
  );
}

function GalleryUpload({ images, setImages, dragIndex }) {
  const onDrop = (index) => {
    const dragged = images[dragIndex.current];
    const updated = [...images];
    updated.splice(dragIndex.current, 1);
    updated.splice(index, 0, dragged);
    setImages(updated);
  };

  return (
    <div className="space-y-4">
      <label className="cursor-pointer border-2 border-dashed rounded-xl p-6 flex flex-col items-center hover:border-blue-400 transition">
        <ImagePlus className="text-gray-400" />
        <p className="text-sm text-gray-500">
          Upload images (drag to reorder)
        </p>
        <input
          type="file"
          multiple
          accept="image/*"
          hidden
          onChange={(e) => {
            setImages([...images, ...e.target.files]);
            e.target.value = "";
          }}
        />
      </label>

      <div className="grid grid-cols-4 gap-4">
        {images.map((img, i) => (
          <div
            key={i}
            draggable
            onDragStart={() => (dragIndex.current = i)}
            onDragOver={(e) => e.preventDefault()}
            onDrop={() => onDrop(i)}
            className="relative group cursor-move"
          >
            <img
              src={URL.createObjectURL(img)}
              className={`h-28 w-full object-cover rounded-xl ${
                i === 0 ? "ring-2 ring-blue-600" : ""
              }`}
            />
            <button
              onClick={() =>
                setImages(images.filter((_, idx) => idx !== i))
              }
              className="cursor-pointer absolute top-2 right-2 bg-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition"
            >
              <X size={14} />
            </button>
            <GripVertical
              size={16}
              className="absolute bottom-2 right-2 text-white opacity-80"
            />
          </div>
        ))}
      </div>
    </div>
  );
}

function Card({ title, children }) {
  return (
    <div className="bg-white/70 backdrop-blur-xl rounded-3xl p-6 ring-1 ring-black/5 space-y-4">
      {title && (
        <h3 className="font-medium text-gray-900">
          {title}
        </h3>
      )}
      {children}
    </div>
  );
}

function Input(props) {
  return (
    <input
      {...props}
      className="w-full border rounded-xl px-4 py-2 focus:ring-2 focus:ring-blue-500/40 outline-none"
    />
  );
}

function Textarea(props) {
  return (
    <textarea
      {...props}
      className="w-full border rounded-xl px-4 py-2 focus:ring-2 focus:ring-blue-500/40 outline-none"
    />
  );
}

function Select(props) {
  return (
    <select
      {...props}
      className="w-full border rounded-xl px-4 py-2 focus:ring-2 focus:ring-blue-500/40 outline-none"
    />
  );
}
