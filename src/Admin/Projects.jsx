import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { collection, deleteDoc, doc, getDocs } from "firebase/firestore";
import { db } from "../Firebase";
import { Plus, Pencil, Trash2, FolderKanban } from "lucide-react";

export default function Projects() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchProjects = async () => {
    setLoading(true);

    const snap = await getDocs(collection(db, "projects"));
    setItems(
      snap.docs.map((d) => ({
        id: d.id,
        ...d.data(),
      }))
    );

    setLoading(false);
  };

  const deleteProject = async (id) => {
    if (!window.confirm("Delete this project permanently?")) return;
    await deleteDoc(doc(db, "projects", id));
    fetchProjects();
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  return (
    <div className="space-y-8">
      {/* HEADER */}
      <div className="bg-white/60 backdrop-blur-xl rounded-3xl p-6 ring-1 ring-black/5 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-gray-900">
            Projects
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            Manage all projects from here
          </p>
        </div>

        <Link
          to="/admin/projects/add"
          className="
            cursor-pointer
            flex items-center gap-2
            bg-linear-to-r from-blue-600 to-blue-700
            text-white px-6 py-3 rounded-xl
            shadow-md hover:shadow-lg
            transition
          "
        >
          <Plus size={16} />
          Add Project
        </Link>
      </div>

      {/* TABLE CARD */}
      <div className="bg-white/70 backdrop-blur-xl rounded-3xl shadow-sm ring-1 ring-black/5 overflow-x-auto">
        {loading ? (
          <div className="p-12 text-center text-blue-600 font-medium">
            Loading projects…
          </div>
        ) : items.length === 0 ? (
          <div className="p-12 text-center text-gray-500">
            No projects found.
          </div>
        ) : (
          <table className="w-full min-w-200 text-sm">
            <thead className="bg-black/5 text-gray-600">
              <tr>
                <th className="px-5 py-4 text-left">Project</th>
                <th className="px-5 py-4 text-left">Location</th>
                <th className="px-5 py-4 text-left">Area</th>
                <th className="px-5 py-4 text-left">Status</th>
                <th className="px-5 py-4 text-left">Images</th>
                <th className="px-5 py-4 text-right">Actions</th>
              </tr>
            </thead>

            <tbody>
              {items.map((p) => (
                <tr key={p.id} className="hover:bg-black/5 transition">
                  {/* PROJECT */}
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-4">
                      <div className="h-10 w-10 rounded-xl bg-linear-to-br from-blue-100 to-blue-200 flex items-center justify-center text-blue-700">
                        <FolderKanban size={18} />
                      </div>

                      <div>
                        <Link
                          to={`/admin/projects/edit/${p.id}`}
                          className="cursor-pointer font-medium text-gray-900 hover:underline"
                        >
                          {p.title || "Untitled Project"}
                        </Link>
                        <p className="text-xs text-gray-500">ID: {p.id}</p>
                      </div>
                    </div>
                  </td>

                  {/* LOCATION */}
                  <td className="px-5 py-4 text-gray-700">
                    {p.location || "-"}
                  </td>

                  {/* AREA */}
                  <td className="px-5 py-4 text-gray-700">
                    {p.area || "-"}
                  </td>

                  {/* STATUS */}
                  <td className="px-5 py-4">
                    <span
                      className={`
                        px-3 py-1 text-xs rounded-full ring-1
                        ${
                          p.status === "active"
                            ? "bg-green-50 text-green-700 ring-green-200"
                            : "bg-gray-50 text-gray-700 ring-gray-200"
                        }
                      `}
                    >
                      {p.status || "draft"}
                    </span>
                  </td>

                  {/* IMAGES */}
                  <td className="px-5 py-4 text-gray-700">
                    {Array.isArray(p.images) ? p.images.length : 0}
                  </td>

                  {/* ACTIONS */}
                  <td className="px-5 py-4 text-right">
                    <div className="inline-flex gap-3">
                      <Link
                        to={`/admin/projects/edit/${p.id}`}
                        className="cursor-pointer p-2.5 rounded-lg hover:bg-black/10 transition"
                        title="Edit"
                      >
                        <Pencil size={16} />
                      </Link>

                      <button
                        onClick={() => deleteProject(p.id)}
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
        )}
      </div>
    </div>
  );
}
