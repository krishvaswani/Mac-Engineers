import { useEffect, useRef, useState } from "react";
import {
  doc,
  getDoc,
  updateDoc,
  collection,
  getDocs,
} from "firebase/firestore";
import {
  ref,
  uploadBytes,
  getDownloadURL,
} from "firebase/storage";
import { db, storage } from "../Firebase";
import { useNavigate, useParams } from "react-router-dom";
import {
  X,
  Plus,
  ImagePlus,
  FileText,
  GripVertical,
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

export default function EditProduct() {
  const { id } = useParams();
  const navigate = useNavigate();
  const dragIndex = useRef(null);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [collections, setCollections] = useState([]);
  const [specs, setSpecs] = useState([]);
  const [images, setImages] = useState([]); // string | File
  const [pdfFile, setPdfFile] = useState(null); // File
  const [existingPdf, setExistingPdf] = useState("");

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

  /* ================= LOAD DATA ================= */

  useEffect(() => {
    const loadData = async () => {
      try {
        const productSnap = await getDoc(
          doc(db, "products", id)
        );

        if (!productSnap.exists()) {
          navigate("/admin/products");
          return;
        }

        const data = productSnap.data();

        setForm({
          name: data.name || "",
          sku: data.sku || "",
          price: data.price || "",
          oldPrice: data.oldPrice || "",
          description: data.description || "",
          collection: data.collection || "",
          inStock: data.inStock ?? true,
          isActive: data.isActive ?? true,
          usageType: data.usageType || "",
          usageGuidelines: data.usageGuidelines || "",
          additionalType: data.additionalType || "",
          additionalInfo: data.additionalInfo || "",
        });

        setImages(data.images || []);
        setExistingPdf(data.pdfUrl || "");

        if (data.specs) {
          setSpecs(
            Object.entries(data.specs).map(
              ([key, value]) => ({ key, value })
            )
          );
        } else {
          setSpecs([{ key: "", value: "" }]);
        }

        const colSnap = await getDocs(
          collection(db, "collections")
        );
        setCollections(
          colSnap.docs.map((d) => d.data())
        );

        setLoading(false);
      } catch (err) {
        console.error(err);
        toast.error("Failed to load product");
      }
    };

    loadData();
  }, [id, navigate]);

  /* ================= HELPERS ================= */

  const updateSpec = (i, field, value) => {
    const copy = [...specs];
    copy[i][field] = value;
    setSpecs(copy);
  };

  const addSpec = () =>
    setSpecs([...specs, { key: "", value: "" }]);

  const removeSpec = (index) =>
    setSpecs(specs.filter((_, i) => i !== index));

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

  /* ================= UPDATE PRODUCT ================= */

  const updateProduct = async () => {
    if (!form.name || !form.collection) {
      toast.error("Product name & collection required");
      return;
    }

    try {
      setSaving(true);
      toast.loading("Updating product...", { id: "update" });

      const finalImages = [];

      for (const img of images) {
        if (typeof img === "string") {
          finalImages.push(img);
        } else {
          finalImages.push(await uploadImage(img));
        }
      }

      let pdfUrl = existingPdf;
      if (pdfFile) {
        pdfUrl = await uploadPdf(pdfFile);
      }

      const specsObject = {};
      specs.forEach((s) => {
        if (s.key && s.value)
          specsObject[s.key] = s.value;
      });

      await updateDoc(doc(db, "products", id), {
        ...form,
        price: Number(form.price),
        oldPrice: Number(form.oldPrice),
        specs: specsObject,
        images: finalImages,
        pdfUrl,
      });

      toast.success("Product updated successfully", {
        id: "update",
      });

      navigate("/admin/products");
    } catch (err) {
      console.error(err);
      toast.error(
        err.message || "Failed to update product",
        { id: "update" }
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-500">
        Loading product…
      </div>
    );
  }

  /* ================= UI ================= */

  return (
    <div className="min-h-screen bg-gray-50 px-10 py-8">
      <div className="max-w-7xl mx-auto bg-white rounded-3xl shadow ring-1 ring-black/5 p-8 space-y-10">

        {/* HEADER */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-semibold">
              Edit Product
            </h1>
            <p className="text-gray-500">
              Update product details
            </p>
          </div>

          <button
            onClick={updateProduct}
            disabled={saving}
            className="bg-black text-white px-8 py-3 rounded-xl"
          >
            {saving ? "Updating..." : "Update Product"}
          </button>
        </div>

        <div className="grid grid-cols-12 gap-8">
          {/* LEFT */}
          <div className="col-span-8 space-y-8">
            <Card title="Basic Information">
              <Input value={form.name} placeholder="Product Name" onChange={(e) => setForm({ ...form, name: e.target.value })} />
              <Input value={form.sku} placeholder="SKU" onChange={(e) => setForm({ ...form, sku: e.target.value })} />
              <Textarea value={form.description} rows={4} placeholder="Description" onChange={(e) => setForm({ ...form, description: e.target.value })} />
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
                <div key={i} className="flex gap-2">
                  <Input value={s.key} placeholder="Key" onChange={(e) => updateSpec(i, "key", e.target.value)} />
                  <Input value={s.value} placeholder="Value" onChange={(e) => updateSpec(i, "value", e.target.value)} />
                  <button onClick={() => removeSpec(i)} className="text-red-600">
                    <X size={16} />
                  </button>
                </div>
              ))}
              <button onClick={addSpec} className="text-blue-600 text-sm flex items-center gap-1">
                <Plus size={14} /> Add Specification
              </button>
            </Card>
          </div>

          {/* RIGHT */}
          <div className="col-span-4 space-y-8">
            <Card title="Pricing">
              <Input type="number" value={form.price} placeholder="Price" onChange={(e) => setForm({ ...form, price: e.target.value })} />
              <Input type="number" value={form.oldPrice} placeholder="Old Price" onChange={(e) => setForm({ ...form, oldPrice: e.target.value })} />
            </Card>

            <Card title="Collection">
              <Select value={form.collection} onChange={(e) => setForm({ ...form, collection: e.target.value })}>
                <option value="">Select Collection</option>
                {collections.map((c) => (
                  <option key={c.slug} value={c.slug}>{c.name}</option>
                ))}
              </Select>
            </Card>

            <Card title="Product PDF">
              <PdfUpload
                pdfFile={pdfFile}
                existingPdf={existingPdf}
                setPdfFile={setPdfFile}
                setExistingPdf={setExistingPdf}
              />
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ================= COMPONENTS ================= */

function PdfUpload({
  pdfFile,
  existingPdf,
  setPdfFile,
  setExistingPdf,
}) {
  return (
    <div className="space-y-3">
      {existingPdf && !pdfFile && (
        <div className="flex items-center justify-between border rounded-xl px-4 py-3 text-sm">
          <a
            href={existingPdf}
            target="_blank"
            rel="noreferrer"
            className="text-blue-600 truncate"
          >
            View existing PDF
          </a>
          <button
            onClick={() => setExistingPdf("")}
            className="text-red-600"
          >
            Remove
          </button>
        </div>
      )}

      {!pdfFile && (
        <label className="border-2 border-dashed rounded-xl p-6 flex flex-col items-center cursor-pointer">
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
                toast.error("Only PDF files allowed");
                e.target.value = "";
                return;
              }
              setPdfFile(file);
              e.target.value = "";
            }}
          />
        </label>
      )}

      {pdfFile && (
        <div className="flex items-center justify-between border rounded-xl px-4 py-3 text-sm">
          {pdfFile.name}
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
    <div className="space-y-4">
      <label className="border-2 border-dashed rounded-xl p-6 flex flex-col items-center cursor-pointer">
        <ImagePlus className="text-gray-400" />
        <p className="text-sm text-gray-500">
          Upload images
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
            className="relative cursor-move group"
          >
            <img
              src={
                typeof img === "string"
                  ? img
                  : URL.createObjectURL(img)
              }
              className={`h-28 w-full object-cover rounded-xl ${
                i === 0 ? "ring-2 ring-black" : ""
              }`}
            />

            {i === 0 && (
              <span className="absolute top-2 left-2 bg-black text-white text-xs px-2 py-0.5 rounded">
                Main
              </span>
            )}

            <button
              onClick={() =>
                setImages(
                  images.filter((_, idx) => idx !== i)
                )
              }
              className="absolute top-2 right-2 bg-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition"
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

/* ================= UI HELPERS ================= */

function Card({ title, children }) {
  return (
    <div className="bg-gray-50 rounded-2xl p-6 space-y-4">
      <h3 className="font-medium">{title}</h3>
      {children}
    </div>
  );
}

function Input(props) {
  return (
    <input
      {...props}
      className="w-full border rounded-lg px-3 py-2"
    />
  );
}

function Textarea(props) {
  return (
    <textarea
      {...props}
      className="w-full border rounded-lg px-3 py-2"
    />
  );
}

function Select(props) {
  return (
    <select
      {...props}
      className="w-full border rounded-lg px-3 py-2"
    />
  );
}
