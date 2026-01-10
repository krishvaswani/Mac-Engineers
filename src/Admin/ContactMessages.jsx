import { useEffect, useMemo, useState } from "react";
import {
  collection,
  onSnapshot,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { db } from "../Firebase";
import { Search, Download, Trash2, X } from "lucide-react";

export default function ContactMessages() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("newest");
  const [active, setActive] = useState(null);

  useEffect(() => {
    const unsub = onSnapshot(collection(db, "contactMessages"), (snap) => {
      setMessages(
        snap.docs.map((d) => ({ id: d.id, ...d.data() }))
      );
      setLoading(false);
    });
    return () => unsub();
  }, []);

  const filtered = useMemo(() => {
    let data = [...messages];

    if (search) {
      data = data.filter(
        (m) =>
          m.firstName?.toLowerCase().includes(search.toLowerCase()) ||
          m.lastName?.toLowerCase().includes(search.toLowerCase()) ||
          m.email?.toLowerCase().includes(search.toLowerCase())
      );
    }

    data.sort((a, b) => {
      const aTime = a.createdAt?.seconds || 0;
      const bTime = b.createdAt?.seconds || 0;
      return sort === "newest" ? bTime - aTime : aTime - bTime;
    });

    return data;
  }, [messages, search, sort]);

  const deleteMessage = async (id) => {
    if (!window.confirm("Delete this contact message?")) return;
    await deleteDoc(doc(db, "contactMessages", id));
  };

  const downloadCSV = () => {
    const headers = ["Name", "Email", "Phone", "Message", "Date"];
    const rows = filtered.map((m) => [
      `${m.firstName} ${m.lastName}`,
      m.email,
      m.phone || "",
      m.message,
      m.createdAt?.toDate?.().toLocaleString() || "",
    ]);

    const csv =
      [headers, ...rows].map((r) => r.join(",")).join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "contact-messages.csv";
    a.click();
  };

  if (loading) return <div className="p-6">Loading…</div>;

  return (
    <div className="p-6">
      {/* HEADER */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold">Contact Messages</h1>

        <button
          onClick={downloadCSV}
          className="flex items-center gap-2 bg-black text-white px-4 py-2 rounded-full hover:opacity-90"
        >
          <Download size={16} />
          Download CSV
        </button>
      </div>

      {/* FILTER BAR */}
      <div className="bg-white rounded-xl p-4 mb-6 flex flex-col md:flex-row gap-4">
        <div className="flex items-center gap-2 border rounded-lg px-3 py-2 w-full md:w-80">
          <Search size={16} className="text-gray-400" />
          <input
            placeholder="Search contact messages"
            className="outline-none w-full"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <select
          value={sort}
          onChange={(e) => setSort(e.target.value)}
          className="border rounded-lg px-4 py-2"
        >
          <option value="newest">Newest first</option>
          <option value="oldest">Oldest first</option>
        </select>
      </div>

      {/* TABLE */}
      <div className="bg-white rounded-xl overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-100 text-gray-600 text-sm">
            <tr>
              <th className="p-4 text-left">Name</th>
              <th className="p-4 text-left">Email</th>
              <th className="p-4 text-left">Phone</th>
              <th className="p-4 text-left">Message</th>
              <th className="p-4 text-left">Date</th>
              <th className="p-4 text-center">Action</th>
            </tr>
          </thead>

          <tbody>
            {filtered.map((m) => (
              <tr
                key={m.id}
                className="border-t hover:bg-gray-50 transition"
              >
                <td className="p-4 font-medium">
                  {m.firstName} {m.lastName}
                </td>
                <td className="p-4">{m.email}</td>
                <td className="p-4">{m.phone || "-"}</td>

                <td
                  className="p-4 max-w-sm cursor-pointer"
                  onClick={() => setActive(m)}
                >
                  <span className="truncate block text-gray-700 hover:underline">
                    {m.message}
                  </span>
                </td>

                <td className="p-4 text-sm text-gray-500">
                  {m.createdAt?.toDate?.().toLocaleDateString()}
                </td>

                <td className="p-4 text-center">
                  <button
                    onClick={() => deleteMessage(m.id)}
                    className="cursor-pointer text-gray-500 hover:text-black"
                  >
                    <Trash2 size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* MODAL */}
      {active && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-xl max-w-lg w-full p-6 relative">
            <button
              onClick={() => setActive(null)}
              className="absolute right-4 top-4 cursor-pointer"
            >
              <X size={18} />
            </button>

            <h3 className="text-lg font-semibold mb-1">
              {active.firstName} {active.lastName}
            </h3>
            <p className="text-sm text-gray-500 mb-4">
              {active.email} • {active.phone}
            </p>

            <div className="bg-gray-100 rounded-lg p-4 whitespace-pre-wrap">
              {active.message}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
