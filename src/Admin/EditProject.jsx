import { useEffect, useMemo, useRef, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { getProjectById, updateProject } from "../utils/projects";
import { uploadFile } from "../utils/uploadFile";
import {
  ArrowLeft,
  Save,
  UploadCloud,
  Image as ImageIcon,
  X,
  Crown,
  Trash2,
} from "lucide-react";

export default function EditProject() {
  const { id } = useParams();
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [form, setForm] = useState(null);

  // existing images are URLs (string[])
  const [existingImages, setExistingImages] = useState([]);
  // new images are File[]
  const [newImages, setNewImages] = useState([]);

  // main image selection:
  // source: "existing" | "new"
  const [mainPick, setMainPick] = useState({ source: "existing", index: 0 });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [dragOver, setDragOver] = useState(false);

  // ---------- LOAD ----------
  useEffect(() => {
    (async () => {
      try {
        const data = await getProjectById(id);
        if (!data) {
          setError("Project not found.");
          return;
        }

        setForm(data);

        const imgs = Array.isArray(data.images) ? data.images : [];
        setExistingImages(imgs);

        // default main:
        // if mainImage exists, set it
        if (data.mainImage) {
          const idx = imgs.findIndex((u) => u === data.mainImage);
          if (idx >= 0) setMainPick({ source: "existing", index: idx });
          else setMainPick({ source: "existing", index: 0 });
        } else {
          setMainPick({ source: "existing", index: 0 });
        }
      } catch (e) {
        console.error(e);
        setError("Failed to load project.");
      }
    })();
  }, [id]);

  // ---------- FORM ----------
  const onChange = (e) =>
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }));

  // ---------- IMAGE HELPERS ----------
  const keyOf = (f) => `${f.name}-${f.size}-${f.lastModified}`;

  const addFiles = (fileList) => {
    const incoming = Array.from(fileList || []).filter((f) =>
      f.type.startsWith("image/")
    );

    // de-dup files
    setNewImages((prev) => {
      const map = new Map(prev.map((f) => [keyOf(f), f]));
      for (const f of incoming) map.set(keyOf(f), f);
      return Array.from(map.values());
    });

    // if no existing images and no main picked, default to first new
    if (existingImages.length === 0) {
      setMainPick((prev) => prev || { source: "new", index: 0 });
    }
  };

  const onFiles = (e) => addFiles(e.target.files);

  const openPicker = () => fileInputRef.current?.click();

  const removeExistingImage = (idx) => {
    setExistingImages((prev) => prev.filter((_, i) => i !== idx));

    setMainPick((prev) => {
      if (prev.source !== "existing") return prev;

      if (idx === prev.index) {
        // main removed -> fallback to existing[0] else new[0]
        const remaining = existingImages.length - 1;
        if (remaining > 0) return { source: "existing", index: 0 };
        if (newImages.length > 0) return { source: "new", index: 0 };
        return { source: "existing", index: 0 };
      }

      // if removed before current main index, shift left
      if (idx < prev.index) return { source: "existing", index: prev.index - 1 };
      return prev;
    });
  };

  const removeNewImage = (idx) => {
    setNewImages((prev) => prev.filter((_, i) => i !== idx));

    setMainPick((prev) => {
      if (prev.source !== "new") return prev;

      if (idx === prev.index) {
        const remaining = newImages.length - 1;
        if (remaining > 0) return { source: "new", index: 0 };
        if (existingImages.length > 0) return { source: "existing", index: 0 };
        return { source: "existing", index: 0 };
      }

      if (idx < prev.index) return { source: "new", index: prev.index - 1 };
      return prev;
    });
  };

  const clearNew = () => {
    setNewImages([]);
    if (existingImages.length > 0) setMainPick({ source: "existing", index: 0 });
  };

  // previews for new files
  const newPreviews = useMemo(() => {
    return newImages.map((file) => ({
      file,
      url: URL.createObjectURL(file),
    }));
  }, [newImages]);

  useMemo(() => {
    return () => newPreviews.forEach((p) => URL.revokeObjectURL(p.url));
  }, [newPreviews]);

  // ---------- DND ----------
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

  // ---------- MAIN IMAGE RESOLVE ----------
  const resolveMainUrl = (finalExistingUrls, finalNewUrls) => {
    if (mainPick.source === "existing") {
      return finalExistingUrls[mainPick.index] || finalExistingUrls[0] || finalNewUrls[0] || "";
    }
    return finalNewUrls[mainPick.index] || finalExistingUrls[0] || finalNewUrls[0] || "";
  };

  // ---------- SUBMIT ----------
  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // upload new images
      const uploadedNewUrls = [];
      for (const file of newImages) {
        const safeName = file.name.replace(/\s+/g, "-");
        const path = `projects/${Date.now()}-${Math.random()
          .toString(36)
          .slice(2)}-${safeName}`;

        const url = await uploadFile(file, path);
        uploadedNewUrls.push(url);
      }

      const finalExisting = Array.isArray(existingImages) ? existingImages : [];
      const finalNew = uploadedNewUrls;

      const mainUrl = resolveMainUrl(finalExisting, finalNew);

      // ✅ put main first in images[]
      const all = [...finalExisting, ...finalNew].filter(Boolean);
      const ordered = mainUrl ? [mainUrl, ...all.filter((u) => u !== mainUrl)] : all;

      await updateProject(id, {
        title: form.title,
        location: form.location,
        area: form.area,
        status: form.status,
        images: ordered,
        mainImage: mainUrl, // ✅ store main image
      });

      navigate("/admin/projects");
    } catch (err) {
      console.error("Edit project error:", err);
      setError(err?.message || "Error updating project");
    } finally {
      setLoading(false);
    }
  };

  // ---------- STATES ----------
  if (!form && !error) {
    return (
      <div className="py-24 text-center">
        <div className="inline-flex items-center gap-3 text-blue-600 font-medium">
          <span className="h-4 w-4 rounded-full border-2 border-blue-600 border-t-transparent animate-spin" />
          Loading project…
        </div>
      </div>
    );
  }

  if (error && !form) {
    return (
      <div className="p-6">
        <div className="p-4 rounded-2xl bg-red-50 text-red-700 ring-1 ring-red-200">
          {error}
        </div>
        <div className="mt-4">
          <Link
            to="/admin/projects"
            className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-white ring-1 ring-black/10 hover:bg-black/5 transition"
          >
            <ArrowLeft size={16} />
            Back to Projects
          </Link>
        </div>
      </div>
    );
  }

  // main preview image (existing or new)
  const mainPreview =
    mainPick.source === "existing"
      ? existingImages[mainPick.index]
      : newPreviews[mainPick.index]?.url;

  return (
    <div className="space-y-8">
      {/* HEADER */}
      <div className="bg-white/60 backdrop-blur-xl rounded-3xl p-6 ring-1 ring-black/5 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-gray-900">
            Edit Project
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            Update details, images and select main image
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
            form="edit-project-form"
            disabled={loading}
            className="
              flex items-center gap-2
              bg-linear-to-r from-blue-600 to-blue-700
              text-white px-6 py-3 rounded-xl
              shadow-md hover:shadow-lg transition disabled:opacity-60
            "
          >
            <Save size={16} />
            {loading ? "Updating..." : "Save Changes"}
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
          id="edit-project-form"
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
              name="title"
              value={form.title || ""}
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
              name="location"
              value={form.location || ""}
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
              name="area"
              value={form.area || ""}
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
              value={form.status || "active"}
              onChange={onChange}
            >
              <option value="active">Active</option>
              <option value="draft">Draft</option>
            </select>
          </div>

          {/* MAIN IMAGE PREVIEW */}
          <div className="md:col-span-2">
            <label className="text-sm font-medium text-gray-700">
              Main Image Preview
            </label>
            <div className="mt-2 rounded-3xl overflow-hidden ring-1 ring-black/10 bg-white">
              <div className="relative">
                {mainPreview ? (
                  <img
                    src={mainPreview}
                    alt="main"
                    className="w-full h-64 md:h-80 object-cover"
                  />
                ) : (
                  <div className="h-64 md:h-80 flex items-center justify-center text-gray-500">
                    No image selected
                  </div>
                )}
                <div className="absolute top-3 left-3 inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/60 text-white text-xs">
                  <Crown size={14} />
                  Main Image
                </div>
                <div className="absolute bottom-3 right-3 px-3 py-1.5 rounded-full bg-white/80 text-gray-800 text-xs ring-1 ring-black/10">
                  Click any thumbnail to set main
                </div>
              </div>
            </div>
          </div>

          {/* EXISTING IMAGES */}
          <div className="md:col-span-2">
            <div className="flex items-end justify-between gap-3 flex-wrap">
              <div>
                <label className="text-sm font-medium text-gray-700">
                  Existing Images ({existingImages.length})
                </label>
                <p className="text-xs text-gray-500 mt-1">
                  Click a thumbnail to set main. Remove only removes from project (not Storage).
                </p>
              </div>
            </div>

            <div className="mt-2 border rounded-2xl p-5 bg-white/70 ring-1 ring-black/10">
              {existingImages.length ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
                  {existingImages.map((url, idx) => {
                    const isMain =
                      mainPick.source === "existing" && mainPick.index === idx;
                    return (
                      <button
                        type="button"
                        key={`${url}-${idx}`}
                        onClick={() => setMainPick({ source: "existing", index: idx })}
                        className={`
                          relative overflow-hidden rounded-2xl ring-1 bg-white text-left transition
                          ${isMain ? "ring-blue-500" : "ring-black/10 hover:ring-black/20"}
                        `}
                        title={isMain ? "Main image" : "Set as main"}
                      >
                        <img src={url} alt="existing" className="h-28 w-full object-cover" />
                        {isMain && (
                          <div className="absolute top-2 left-2 inline-flex items-center gap-1 px-2 py-1 rounded-full bg-blue-600 text-white text-[11px]">
                            <Crown size={12} /> Main
                          </div>
                        )}
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            removeExistingImage(idx);
                          }}
                          className="absolute top-2 right-2 bg-black/70 text-white p-2 rounded-xl hover:bg-black transition"
                          title="Remove"
                        >
                          <X size={14} />
                        </button>
                      </button>
                    );
                  })}
                </div>
              ) : (
                <div className="text-sm text-gray-500 flex items-center gap-2">
                  <ImageIcon size={16} />
                  No existing images.
                </div>
              )}
            </div>
          </div>

          {/* NEW IMAGE UPLOADER */}
          <div className="md:col-span-2">
            <div className="flex items-end justify-between gap-3 flex-wrap">
              <div>
                <label className="text-sm font-medium text-gray-700">
                  Add New Images ({newImages.length})
                </label>
                <p className="text-xs text-gray-500 mt-1">
                  Drag & drop or browse. New images can also be set as main.
                </p>
              </div>

              {newImages.length > 0 && (
                <button
                  type="button"
                  onClick={clearNew}
                  className="px-4 py-2 rounded-xl bg-white ring-1 ring-black/10 hover:bg-black/5 transition text-sm inline-flex items-center gap-2"
                >
                  <Trash2 size={16} />
                  Clear new
                </button>
              )}
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
              onDrop={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setDragOver(false);
                addFiles(e.dataTransfer.files);
              }}
              onDragOver={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setDragOver(true);
              }}
              onDragLeave={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setDragOver(false);
              }}
              className={`
                mt-3 cursor-pointer rounded-3xl border-2 border-dashed
                p-6 md:p-8 bg-white/70 ring-1 ring-black/5 transition
                ${dragOver ? "border-blue-500 bg-blue-50/60" : "border-black/10 hover:border-black/20"}
              `}
            >
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-2xl bg-linear-to-br from-blue-100 to-blue-200 flex items-center justify-center text-blue-700">
                  <UploadCloud size={20} />
                </div>

                <div className="flex-1">
                  <p className="font-medium text-gray-900">
                    {dragOver ? "Drop images to add" : "Drop images here"}
                  </p>
                  <p className="text-xs text-gray-500">
                    PNG / JPG / WEBP • Multiple selection supported
                  </p>
                </div>

                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    openPicker();
                  }}
                  className="px-4 py-2 rounded-xl bg-blue-600 text-white hover:bg-blue-700 transition text-sm inline-flex items-center gap-2"
                >
                  <UploadCloud size={16} />
                  Choose
                </button>
              </div>
            </div>

            {/* New previews */}
            {newPreviews.length > 0 && (
              <div className="mt-5 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
                {newPreviews.map((p, idx) => {
                  const isMain = mainPick.source === "new" && mainPick.index === idx;
                  return (
                    <button
                      type="button"
                      key={keyOf(p.file)}
                      onClick={() => setMainPick({ source: "new", index: idx })}
                      className={`
                        relative overflow-hidden rounded-2xl ring-1 bg-white text-left transition
                        ${isMain ? "ring-blue-500" : "ring-black/10 hover:ring-black/20"}
                      `}
                      title={isMain ? "Main image" : "Set as main"}
                    >
                      <img src={p.url} alt="new" className="h-28 w-full object-cover" />
                      {isMain && (
                        <div className="absolute top-2 left-2 inline-flex items-center gap-1 px-2 py-1 rounded-full bg-blue-600 text-white text-[11px]">
                          <Crown size={12} /> Main
                        </div>
                      )}
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          removeNewImage(idx);
                        }}
                        className="absolute top-2 right-2 bg-black/70 text-white p-2 rounded-xl hover:bg-black transition"
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
              <Save size={16} />
              {loading ? "Updating..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
