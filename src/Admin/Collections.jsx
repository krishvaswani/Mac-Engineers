import { useEffect, useState } from "react";
import {
  collection,
  getDocs,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { db } from "../Firebase";
import CollectionForm from "./CollectionForm";

export default function Collections() {
  const [collectionsData, setCollectionsData] = useState([]);
  const [openForm, setOpenForm] = useState(false);
  const [editData, setEditData] = useState(null);

  const fetchCollections = async () => {
    const snap = await getDocs(collection(db, "collections"));
    setCollectionsData(
      snap.docs.map((d) => ({
        id: d.id,        // 🔥 COLLECTION ID
        ...d.data(),
      }))
    );
  };

  const deleteCollection = async (id) => {
    if (!window.confirm("Delete this collection?")) return;
    await deleteDoc(doc(db, "collections", id));
    fetchCollections();
  };

  useEffect(() => {
    fetchCollections();
  }, []);

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold">Collections</h1>

        <button
          onClick={() => {
            setEditData(null);
            setOpenForm(true);
          }}
          className="bg-black text-white px-5 py-2 rounded-lg"
        >
          + Add Collection
        </button>
      </div>

      {/* TABLE */}
      <div className="bg-white border rounded-xl overflow-x-auto">
        <table className="w-full min-w-225 text-sm">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="px-4 py-3 text-left">ID</th>
              <th className="px-4 py-3 text-left">Name</th>
              <th className="px-4 py-3 text-left">Slug</th>
              <th className="px-4 py-3 text-left">Description</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>

          <tbody>
            {collectionsData.map((c) => (
              <tr key={c.id} className="border-b last:border-none">
                {/* ID */}
                <td className="px-4 py-3 text-xs text-gray-500 break-all">
  {c.id}
</td>

                <td className="px-4 py-3 font-medium">
                  {c.name}
                </td>

                <td className="px-4 py-3 text-gray-500">
                  /{c.slug}
                </td>

                <td className="px-4 py-3 text-gray-500">
                  {c.description || "-"}
                </td>

                <td className="px-4 py-3 text-right space-x-3">
                  <button
                    onClick={() => {
                      setEditData(c);
                      setOpenForm(true);
                    }}
                    className="text-blue-600"
                  >
                    Edit
                  </button>

                  <button
                    onClick={() => deleteCollection(c.id)}
                    className="text-red-500"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

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
