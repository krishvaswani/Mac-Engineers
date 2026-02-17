import { useMemo, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { addProject } from "../utils/projects";
import { uploadFile } from "../utils/uploadFile";
import {
  Plus,
  ArrowLeft,
  UploadCloud,
  Image as ImageIcon,
  X,
  Crown,
  Trash2,
} from "lucide-react";

export default function AddProject() {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [form, setForm] = useState({
    title: "",
    location: "",
    area: "",
    status: "active",
  });

  const [images, setImages] = useState([]); // File[]
  const [mainIdx, setMainIdx] = useState(0); // ✅ main image selection (files)
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [dragOver, setDragOver] = useState(false);

  const onChange = (e) =>
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }));

  const keyOf = (f) => `${f.name}-${f.size}-${f.lastModified}`;

  const addFiles = (fileList) => {
    const incoming = Array.from(fileList || []).filter((f) =>
      f.type.startsWith("image/")
    );

    setImages((prev) => {
      const map = new Map(prev.map((f) => [keyOf(f), f]));
      for (const f of incoming) map.set(keyOf(f), f);
      const merged = Array.from(map.values());
      return merged;
    });

    // if first time add, main = first
    setMainIdx((prev) => (images.length === 0 ? 0 : prev));
  };

  const onFiles = (e) => addFiles(e.target.files);

  const onDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragOver(false);
    addFiles(e.dataTransfer.files);
  };

  const onDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragOver(true);
  };

  const onDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragOver(false);
  };

  const openPicker = () => fileInputRef.current?.click();

  const removeImage = (idx) => {
    setImages((prev) => prev.filter((_, i) => i !== idx));
    setMainIdx((prev) => {
      if (idx === prev) return 0;
      if (idx < prev) return prev - 1;
      return prev;
    });
  };

  const clearAll = () => {
    setImages([]);
    setMainIdx(0);
  };

  const previews = useMemo(() => {
    return images.map((file) => ({
      file,
      url: URL.createObjectURL(file),
    }));
  }, [images]);

  useMemo(() => {
    return () => previews.forEach((p) => URL.revokeObjectURL(p.url));
  }, [previews]);

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // upload images
      const uploaded = [];
      for (const file of images) {
        const safeName = file.name.replace(/\s+/g, "-");
        const path = `projects/${Date.now()}-${Math.random()
          .toString(36)
          .slice(2)}-${safeName}`;
        const url = await uploadFile(file, path);
        uploaded.push(url);
      }

      // ✅ main image first in array
      const mainUrl = uploaded[mainIdx] || uploaded[0] || "";
      const ordered = mainUrl
        ? [mainUrl, ...uploaded.filter((u) => u !== mainUrl)]
        : uploaded;

      await addProject({
        ...form,
        images: ordered,
        mainImage: mainUrl, // ✅ save main image too
      });

      navigate("/admin/projects");
    } catch (err) {
      console.error("Add project error:", err);
      setError(err?.message || "Error adding project");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* HEADER */}
      <div className="bg-white/60 backdrop-blur-xl rounded-3xl p-6 ring-1 ring-black/5 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-gray-900">
            Add Project
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            Premium project creation with gallery + main image selection
          </p>
        </div>

        <div className="flex gap-3">
          <Link
            to="/admin/projects"
            className="
              flex items-center gap-2
              px-5 py-3 rounded-xl
              bg-white/80 backdrop-blur
              ring-1 ring-black/10
              hover:bg-black/5 transition
            "
          >
            <ArrowLeft size={16} />
            Back
          </Link>

          <button
            form="add-project-form"
            disabled={loading}
            className="
              flex items-center gap-2
              bg-linear-to-r from-blue-600 to-blue-700
              text-white px-6 py-3 rounded-xl
              shadow-md hover:shadow-lg transition
              disabled:opacity-60
            "
          >
            <Plus size={16} />
            {loading ? "Saving..." : "Save Project"}
          </button>
        </div>
      </div>

      {/* FORM CARD */}
      <div className="bg-white/70 backdrop-blur-xl rounded-3xl shadow-sm ring-1 ring-black/5 p-6">
        {error && (
          <div className="mb-5 p-4 rounded-2xl bg-red-50 text-red-700 ring-1 ring-red-200">
            {error}
          </div>
        )}

        <form
          id="add-project-form"
          onSubmit={onSubmit}
          className="grid grid-cols-1 md:grid-cols-2 gap-5"
        >
          {/* Title */}
          <div className="md:col-span-2">
            <label className="text-sm font-medium text-gray-700">
              Project Title
            </label>
            <input
              className="mt-2 w-full p-3 rounded-xl bg-white/80 ring-1 ring-black/10 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Luxury Steel Frame Villa"
              name="title"
              value={form.title}
              onChange={onChange}
              required
            />
          </div>

          {/* Location */}
          <div>
            <label className="text-sm font-medium text-gray-700">
              Location
            </label>
            <input
              className="mt-2 w-full p-3 rounded-xl bg-white/80 ring-1 ring-black/10 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Dehradun, Uttarakhand"
              name="location"
              value={form.location}
              onChange={onChange}
              required
            />
          </div>

          {/* Area */}
          <div>
            <label className="text-sm font-medium text-gray-700">
              Plot Area
            </label>
            <input
              className="mt-2 w-full p-3 rounded-xl bg-white/80 ring-1 ring-black/10 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="1400 SQFT"
              name="area"
              value={form.area}
              onChange={onChange}
              required
            />
          </div>

          {/* Status */}
          <div>
            <label className="text-sm font-medium text-gray-700">
              Status
            </label>
            <select
              className="mt-2 w-full p-3 rounded-xl bg-white/80 ring-1 ring-black/10 focus:outline-none focus:ring-2 focus:ring-blue-500"
              name="status"
              value={form.status}
              onChange={onChange}
            >
              <option value="active">Active</option>
              <option value="draft">Draft</option>
            </select>
          </div>

          {/* UPLOADER */}
          <div className="md:col-span-2">
            <div className="flex items-end justify-between gap-3 flex-wrap">
              <div>
                <label className="text-sm font-medium text-gray-700">
                  Project Images
                </label>
                <p className="text-xs text-gray-500 mt-1">
                  Drag & drop or browse. Click a thumbnail to set it as{" "}
                  <span className="font-medium">Main Image</span>.
                </p>
              </div>

              <div className="flex gap-2">
                {images.length > 0 && (
                  <button
                    type="button"
                    onClick={clearAll}
                    className="px-4 py-2 rounded-xl bg-white ring-1 ring-black/10 hover:bg-black/5 transition text-sm inline-flex items-center gap-2"
                  >
                    <Trash2 size={16} />
                    Clear
                  </button>
                )}

                <button
                  type="button"
                  onClick={openPicker}
                  className="px-4 py-2 rounded-xl bg-blue-600 text-white hover:bg-blue-700 transition text-sm inline-flex items-center gap-2"
                >
                  <UploadCloud size={16} />
                  Choose files
                </button>
              </div>
            </div>

            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept="image/*"
              className="hidden"
              onChange={onFiles}
            />

            <div
              onClick={openPicker}
              onDrop={onDrop}
              onDragOver={onDragOver}
              onDragLeave={onDragLeave}
              className={`
                mt-3 cursor-pointer rounded-3xl border-2 border-dashed
                p-6 md:p-8 bg-white/70 ring-1 ring-black/5 transition
                ${dragOver ? "border-blue-500 bg-blue-50/60" : "border-black/10 hover:border-black/20"}
              `}
            >
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-2xl bg-linear-to-br from-blue-100 to-blue-200 flex items-center justify-center text-blue-700">
                  <ImageIcon size={20} />
                </div>

                <div className="flex-1">
                  <p className="font-medium text-gray-900">
                    {dragOver ? "Drop images to add" : "Drop images here"}
                  </p>
                  <p className="text-xs text-gray-500">
                    Supports PNG / JPG / WEBP • Multiple selection
                  </p>
                </div>

                <div className="text-sm text-gray-600">
                  <span className="font-semibold text-gray-900">{images.length}</span>{" "}
                  selected
                </div>
              </div>
            </div>

            {/* MAIN PREVIEW + GRID */}
            {previews.length > 0 && (
              <div className="mt-5 space-y-4">
                {/* Main preview big */}
                <div className="rounded-3xl overflow-hidden ring-1 ring-black/10 bg-white">
                  <div className="relative">
                    <img
                      src={previews[mainIdx]?.url}
                      alt="main"
                      className="w-full h-64 md:h-80 object-cover"
                    />
                    <div className="absolute top-3 left-3 inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/60 text-white text-xs">
                      <Crown size={14} />
                      Main Image
                    </div>
                    <div className="absolute bottom-3 right-3 px-3 py-1.5 rounded-full bg-white/80 text-gray-800 text-xs ring-1 ring-black/10">
                      Click thumbnails to change main
                    </div>
                  </div>
                </div>

                {/* Thumbnails */}
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
                  {previews.map((p, idx) => {
                    const isMain = idx === mainIdx;
                    return (
                      <button
                        type="button"
                        key={keyOf(p.file)}
                        onClick={() => setMainIdx(idx)}
                        className={`
                          relative overflow-hidden rounded-2xl ring-1 bg-white text-left
                          transition
                          ${isMain ? "ring-blue-500" : "ring-black/10 hover:ring-black/20"}
                        `}
                        title={isMain ? "Main image" : "Set as main"}
                      >
                        <img
                          src={p.url}
                          alt="thumb"
                          className="h-28 w-full object-cover"
                          loading="lazy"
                        />

                        {isMain && (
                          <div className="absolute top-2 left-2 inline-flex items-center gap-1 px-2 py-1 rounded-full bg-blue-600 text-white text-[11px]">
                            <Crown size={12} />
                            Main
                          </div>
                        )}

                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            removeImage(idx);
                          }}
                          className="
                            absolute top-2 right-2
                            bg-black/70 text-white p-2 rounded-xl
                            hover:bg-black transition
                          "
                          title="Remove"
                        >
                          <X size={14} />
                        </button>

                        <div className="p-2 text-[11px] text-gray-600 truncate">
                          {p.file.name}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Submit fallback (mobile) */}
          <div className="md:col-span-2">
            <button
              disabled={loading}
              className="
                w-full mt-2 flex items-center justify-center gap-2
                bg-linear-to-r from-blue-600 to-blue-700
                text-white px-6 py-3 rounded-xl
                shadow-md hover:shadow-lg transition disabled:opacity-60
              "
            >
              <Plus size={16} />
              {loading ? "Saving..." : "Save Project"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
