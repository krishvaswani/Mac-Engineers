import { useState } from "react";
import {
  doc,
  setDoc,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "../Firebase";

export default function CollectionForm({ data, onClose }) {
  const [name, setName] = useState(data?.name || "");
  const [slug, setSlug] = useState(data?.slug || "");
  const [description, setDescription] = useState(
    data?.description || ""
  );
  const [saving, setSaving] = useState(false);

  const generateSlug = (value) =>
    value
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-");

  const saveCollection = async () => {
    if (!name) return alert("Collection name is required");

    setSaving(true);
    const finalSlug = slug || generateSlug(name);

    await setDoc(doc(db, "collections", finalSlug), {
      name,
      slug: finalSlug,
      description,
      createdAt: serverTimestamp(),
    });

    setSaving(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-md rounded-2xl p-6">
        <h2 className="text-xl font-semibold mb-4">
          {data ? "Edit Collection" : "Add Collection"}
        </h2>

        <div className="space-y-4">
          <input
            className="border p-2 w-full rounded"
            placeholder="Collection Name"
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              setSlug(generateSlug(e.target.value));
            }}
          />

          <input
            className="border p-2 w-full rounded"
            placeholder="Slug"
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
          />

          <textarea
            className="border p-2 w-full rounded"
            placeholder="Description"
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />

          <div className="flex justify-end gap-3 pt-4">
            <button
              onClick={onClose}
              className="px-4 py-2 border rounded"
            >
              Cancel
            </button>

            <button
              onClick={saveCollection}
              disabled={saving}
              className="px-4 py-2 bg-black text-white rounded"
            >
              {saving ? "Saving..." : "Save"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
