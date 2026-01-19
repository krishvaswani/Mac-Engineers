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

/* ================= SPEC PARSER ================= */

const parseSpecsFromText = (text) => {
  return text
    .split("\n")
    .map((line) => {
      line = line.trim();
      if (!line) return null;

      line = line.replace(/\|/g, "").trim();

      const parts =
        line.includes("\t")
          ? line.split("\t")
          : line.includes(":")
          ? line.split(":")
          : line.split(/\s{2,}/);

      if (parts.length < 2) return null;

      return {
        key: parts[0].trim(),
        value: parts.slice(1).join(" ").trim(),
      };
    })
    .filter(Boolean);
};

/* ================= COMPONENT ================= */

export default function AddProduct() {
  const navigate = useNavigate();
  const dragIndex = useRef(null);

  const [collections, setCollections] = useState([]);
  const [specs, setSpecs] = useState([{ key: "", value: "" }]);
  const [specPaste, setSpecPaste] = useState("");
  const [images, setImages] = useState([]);
  const [pdfFile, setPdfFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const [openUsage, setOpenUsage] = useState(true);
  const [openAdditional, setOpenAdditional] = useState(false);

  const [form, setForm] = useState({
    name: "",
    sku: "",
    price: "",
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

  /* ================= SPEC HELPERS ================= */

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

      const pdfUrl = pdfFile ? await uploadPdf(pdfFile) : "";

      const specsObject = {};
      specs.forEach((s) => {
        if (s.key && s.value) specsObject[s.key] = s.value;
      });

      await addDoc(collection(db, "products"), {
        ...form,
        price: Number(form.price),
        specs: specsObject,
        images: imageUrls,
        pdfUrl,
        createdAt: serverTimestamp(),
      });

      toast.success("Product added successfully", { id: "save" });
      navigate("/admin/products");
    } catch (error) {
      toast.error(error.message || "Failed to save product", {
        id: "save",
      });
    } finally {
      setLoading(false);
    }
  };

  /* ================= UI ================= */

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 px-8 py-10">
      <div className="max-w-7xl mx-auto space-y-10">
        {/* HEADER */}
        <div className="bg-white/70 backdrop-blur-xl rounded-3xl p-6 ring-1 ring-black/5 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">
              Add Product
            </h1>
            <p className="text-gray-500">
              Create and publish a premium product
            </p>
          </div>
          <button
            onClick={saveProduct}
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-700 transition text-white px-8 py-3 rounded-xl shadow-md disabled:opacity-60"
          >
            {loading ? "Saving..." : "Save Product"}
          </button>
        </div>

        <div className="grid grid-cols-12 gap-10">
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
                placeholder="Product description"
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
              <Textarea
                rows={4}
                placeholder="Paste specs from Excel / Table / Text"
                value={specPaste}
                onChange={(e) => setSpecPaste(e.target.value)}
              />

              <button
                onClick={() => {
                  const parsed = parseSpecsFromText(specPaste);
                  if (!parsed.length)
                    return toast.error("Invalid specs format");
                  setSpecs(parsed);
                  setSpecPaste("");
                  toast.success("Specifications added");
                }}
                className="bg-blue-600 text-white px-4 py-2 rounded-xl w-fit"
              >
                Convert to Specs
              </button>

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
                    className="text-red-600"
                  >
                    <X size={16} />
                  </button>
                </div>
              ))}

              <button
                onClick={addSpec}
                className="text-blue-600 flex items-center gap-1"
              >
                <Plus size={14} /> Add Specification
              </button>
            </Card>

            {/* USAGE */}
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
                <option value="">Select usage type</option>
                {USAGE_OPTIONS.map((u) => (
                  <option key={u}>{u}</option>
                ))}
              </Select>

              <Textarea
                rows={4}
                placeholder="Usage instructions"
                value={form.usageGuidelines}
                onChange={(e) =>
                  setForm({
                    ...form,
                    usageGuidelines: e.target.value,
                  })
                }
              />
            </Accordion>

            {/* ADDITIONAL */}
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
                <option value="">Select type</option>
                {ADDITIONAL_OPTIONS.map((a) => (
                  <option key={a}>{a}</option>
                ))}
              </Select>

              <Textarea
                rows={4}
                placeholder="Additional details"
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
                <option value="">Select collection</option>
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

/* ================= UI COMPONENTS ================= */

function Accordion({ title, open, setOpen, children }) {
  return (
    <div className="bg-white rounded-2xl ring-1 ring-black/5 p-4">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex justify-between font-medium"
      >
        {title}
        <ChevronDown
          size={18}
          className={`transition ${open ? "rotate-180" : ""}`}
        />
      </button>
      {open && <div className="pt-4 space-y-4">{children}</div>}
    </div>
  );
}

function PdfUpload({ pdfFile, setPdfFile }) {
  return (
    <div>
      {!pdfFile ? (
        <label className="cursor-pointer border-2 border-dashed rounded-xl p-6 flex flex-col items-center">
          <FileText className="text-gray-400 mb-2" />
          <span className="text-sm text-gray-500">Upload PDF</span>
          <input
            type="file"
            hidden
            onChange={(e) => setPdfFile(e.target.files[0])}
          />
        </label>
      ) : (
        <div className="flex justify-between border rounded-xl px-4 py-3">
          <span className="text-sm truncate">{pdfFile.name}</span>
          <button
            onClick={() => setPdfFile(null)}
            className="text-red-600"
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
    <>
      <label className="border-2 border-dashed rounded-xl p-6 flex flex-col items-center cursor-pointer">
        <ImagePlus className="text-gray-400" />
        <span className="text-sm text-gray-500">
          Upload images
        </span>
        <input
          type="file"
          multiple
          hidden
          accept="image/*"
          onChange={(e) =>
            setImages([...images, ...e.target.files])
          }
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
            className="relative cursor-move"
          >
            <img
              src={URL.createObjectURL(img)}
              className="h-28 w-full object-cover rounded-xl"
            />
            <button
              onClick={() =>
                setImages(images.filter((_, idx) => idx !== i))
              }
              className="absolute top-2 right-2 bg-white p-1 rounded-full"
            >
              <X size={14} />
            </button>
            <GripVertical
              size={16}
              className="absolute bottom-2 right-2 text-white"
            />
          </div>
        ))}
      </div>
    </>
  );
}

function Card({ title, children }) {
  return (
    <div className="bg-white/70 backdrop-blur-xl rounded-3xl p-6 ring-1 ring-black/5 space-y-4">
      <h3 className="font-medium text-gray-900">{title}</h3>
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
