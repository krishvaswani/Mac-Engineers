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
        id: d.id,
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
    <div className="space-y-8">
      {/* HEADER */}
      <div className="bg-white/60 backdrop-blur-xl rounded-3xl p-6 ring-1 ring-black/5 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-gray-900">
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
          className="
            cursor-pointer
            flex items-center gap-2
            bg-gradient-to-r from-blue-600 to-blue-700
            text-white px-6 py-3 rounded-xl
            shadow-md hover:shadow-lg
            transition
          "
        >
          <Plus size={16} />
          Add Collection
        </button>
      </div>

      {/* TABLE CARD */}
      <div className="bg-white/70 backdrop-blur-xl rounded-3xl shadow-sm ring-1 ring-black/5 overflow-x-auto">
        <table className="w-full min-w-[900px] text-sm table-fixed">
          <thead className="bg-black/5 text-gray-600">
            <tr>
              <th className="px-5 py-4 text-left w-[280px]">
                <div className="flex items-center gap-2">
                  <Hash size={14} />
                  ID
                </div>
              </th>
              <th className="px-5 py-4 text-left w-[180px]">
                <div className="flex items-center gap-2">
                  <Layers size={14} />
                  Name
                </div>
              </th>
              <th className="px-5 py-4 text-left w-[160px]">
                Slug
              </th>
              <th className="px-5 py-4 text-left">
                Description
              </th>
              <th className="px-5 py-4 text-right w-[120px]">
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
                <td className="px-5 py-4 text-xs text-gray-500 break-all font-mono">
                  {c.id}
                </td>

                {/* NAME */}
                <td className="px-5 py-4 font-medium text-gray-900">
                  {c.name}
                </td>

                {/* SLUG */}
                <td className="px-5 py-4 text-gray-500">
                  /{c.slug}
                </td>

                {/* DESCRIPTION */}
                <td className="px-5 py-4 text-gray-500 break-words">
                  {c.description || "-"}
                </td>

                {/* ACTIONS */}
                <td className="px-5 py-4 text-right">
                  <div className="inline-flex gap-3">
                    <button
                      onClick={() => {
                        setEditData(c);
                        setOpenForm(true);
                      }}
                      className="cursor-pointer p-2.5 rounded-lg hover:bg-black/10 transition"
                      title="Edit"
                    >
                      <Pencil size={16} />
                    </button>

                    <button
                      onClick={() => deleteCollection(c.id)}
                      className="cursor-pointer p-2.5 rounded-lg hover:bg-red-50 text-red-600 transition"
                      title="Delete"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
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
