import { useState } from "react";
import {
  doc,
  setDoc,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "../Firebase";
import { X } from "lucide-react";

export default function CollectionForm({ data, onClose }) {
  const [name, setName] = useState(data?.name || "");
  const [slug, setSlug] = useState(data?.slug || "");
  const [description, setDescription] = useState(
    data?.description || ""
  );
  const [isActive, setIsActive] = useState(
    data?.isActive ?? true
  );
  const [saving, setSaving] = useState(false);

  const generateSlug = (value) =>
    value
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-");

  const saveCollection = async () => {
    if (!name) {
      alert("Collection name is required");
      return;
    }

    try {
      setSaving(true);
      const finalSlug = slug || generateSlug(name);

      await setDoc(doc(db, "collections", finalSlug), {
        name,
        slug: finalSlug,
        description,
        isActive, // ✅ LIVE / HIDDEN
        createdAt: data?.createdAt || serverTimestamp(),
        updatedAt: serverTimestamp(),
      });

      onClose();
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="bg-white/80 backdrop-blur-xl w-full max-w-md rounded-3xl p-6 ring-1 ring-black/5 shadow-xl relative">
        
        {/* CLOSE */}
        <button
          onClick={onClose}
          className="cursor-pointer absolute right-4 top-4 text-gray-400 hover:text-black transition"
        >
          <X size={18} />
        </button>

        {/* HEADER */}
        <h2 className="text-xl font-semibold text-gray-900 mb-1">
          {data ? "Edit Collection" : "Add Collection"}
        </h2>
        <p className="text-sm text-gray-500 mb-6">
          {data
            ? "Update collection details"
            : "Create a new product collection"}
        </p>

        {/* FORM */}
        <div className="space-y-4">
          {/* NAME */}
          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 block">
              Collection Name
            </label>
            <input
              className="
                w-full rounded-xl border px-4 py-2
                focus:ring-2 focus:ring-blue-500/40
                outline-none
              "
              placeholder="e.g. Industrial Cleaners"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                setSlug(generateSlug(e.target.value));
              }}
            />
          </div>

          {/* SLUG */}
          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 block">
              Slug
            </label>
            <input
              className="
                w-full rounded-xl border px-4 py-2
                focus:ring-2 focus:ring-blue-500/40
                outline-none
              "
              placeholder="industrial-cleaners"
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
            />
          </div>

          {/* DESCRIPTION */}
          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 block">
              Description
            </label>
            <textarea
              className="
                w-full rounded-xl border px-4 py-2
                focus:ring-2 focus:ring-blue-500/40
                outline-none
              "
              placeholder="Optional description"
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          {/* LIVE / HIDDEN TOGGLE */}
          <div className="flex items-center justify-between rounded-xl border px-4 py-3">
            <div>
              <p className="text-sm font-medium text-gray-800">
                Collection Status
              </p>
              <p className="text-xs text-gray-500">
                {isActive
                  ? "Collection is visible and usable"
                  : "Collection is hidden from store"}
              </p>
            </div>

            <button
              onClick={() => setIsActive(!isActive)}
              className={`
                relative w-11 h-6 rounded-full transition
                ${isActive ? "bg-blue-600" : "bg-gray-300"}
              `}
            >
              <span
                className={`
                  absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition
                  ${isActive ? "translate-x-5" : ""}
                `}
              />
            </button>
          </div>

          {/* ACTIONS */}
          <div className="flex justify-end gap-3 pt-4">
            <button
              onClick={onClose}
              className="
                cursor-pointer
                px-5 py-2 rounded-xl
                border text-gray-700
                hover:bg-gray-50 transition
              "
            >
              Cancel
            </button>

            <button
              onClick={saveCollection}
              disabled={saving}
              className="
                cursor-pointer
                px-6 py-2 rounded-xl
                bg-linear-to-r from-blue-600 to-blue-700
                text-white
                shadow-md hover:shadow-lg
                transition disabled:opacity-60
              "
            >
              {saving ? "Saving..." : "Save"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
