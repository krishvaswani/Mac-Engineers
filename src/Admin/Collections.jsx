import { useEffect, useState } from "react";
import {
  collection,
  getDocs,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { db } from "../Firebase";
import CollectionForm from "./CollectionForm";
import {
  Plus,
  Pencil,
  Trash2,
  Layers,
  Hash,
} from "lucide-react";

export default function Collections() {
  const [collectionsData, setCollectionsData] = useState([]);
  const [openForm, setOpenForm] = useState(false);
  const [editData, setEditData] = useState(null);

  const fetchCollections = async () => {
    const snap = await getDocs(collection(db, "collections"));
    setCollectionsData(
      snap.docs.map((d) => ({
        id: d.id, // ✅ FULL COLLECTION ID
        ...d.data(),
      }))
    );
  };

  const deleteCollection = async (id) => {
    if (!window.confirm("Delete this collection permanently?")) return;
    await deleteDoc(doc(db, "collections", id));
    fetchCollections();
  };

  useEffect(() => {
    fetchCollections();
  }, []);

  return (
    <div className="space-y-6 bg-gradient-to-br from-gray-50 to-white p-6 rounded-3xl">
      {/* HEADER */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">
            Collections
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            Manage product collections
          </p>
        </div>

        <button
          onClick={() => {
            setEditData(null);
            setOpenForm(true);
          }}
          className="flex items-center gap-2 bg-black text-white px-5 py-2.5 rounded-xl shadow-sm hover:opacity-90 transition"
        >
          <Plus size={16} />
          Add Collection
        </button>
      </div>

      {/* TABLE CARD */}
      <div className="bg-white/80 backdrop-blur rounded-2xl shadow-sm ring-1 ring-black/5 overflow-x-auto">
       <div className="bg-white/80 backdrop-blur rounded-2xl shadow-sm ring-1 ring-black/5 overflow-x-auto">
  <table className="w-full min-w-225 text-sm table-fixed">
    <thead className="bg-black/5 text-gray-600">
      <tr>
        <th className="px-4 py-3 text-left w-[260px]">
          ID
        </th>
        <th className="px-4 py-3 text-left w-[200px]">
          Name
        </th>
        <th className="px-4 py-3 text-left w-[180px]">
          Slug
        </th>
        <th className="px-4 py-3 text-left">
          Description
        </th>
        <th className="px-4 py-3 text-right w-[120px]">
          Actions
        </th>
      </tr>
    </thead>

    <tbody>
      {collectionsData.map((c) => (
        <tr
          key={c.id}
          className="hover:bg-black/5 transition"
        >
          {/* FULL ID */}
          <td className="px-4 py-3 text-xs text-gray-500 break-all font-mono">
            {c.id}
          </td>

          {/* NAME */}
          <td className="px-4 py-3 font-medium">
            {c.name}
          </td>

          {/* SLUG */}
          <td className="px-4 py-3 text-gray-500">
            /{c.slug}
          </td>

          {/* DESCRIPTION */}
          <td className="px-4 py-3 text-gray-500 break-words">
            {c.description || "-"}
          </td>

          {/* ACTIONS */}
          <td className="px-4 py-3 text-right">
            <div className="inline-flex gap-3">
              <button
                onClick={() => {
                  setEditData(c);
                  setOpenForm(true);
                }}
                className="p-2 rounded-lg hover:bg-black/10 transition"
                title="Edit"
              >
                ✏️
              </button>

              <button
                onClick={() => deleteCollection(c.id)}
                className="p-2 rounded-lg hover:bg-red-50 text-red-600 transition"
                title="Delete"
              >
                🗑️
              </button>
            </div>
          </td>
        </tr>
      ))}
    </tbody>
  </table>
</div>

      </div>

      {/* MODAL */}
      {openForm && (
        <CollectionForm
          data={editData}
          onClose={() => {
            setOpenForm(false);
            fetchCollections();
          }}
        />
      )}
    </div>
  );
}
