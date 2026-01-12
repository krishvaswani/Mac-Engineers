import { useEffect, useMemo, useState } from "react";
import {
  collection,
  onSnapshot,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { db } from "../Firebase";
import {
  Search,
  Download,
  Trash2,
  X,
} from "lucide-react";

export default function ContactMessages() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("newest");
  const [timeRange, setTimeRange] = useState("all"); // 👈 NEW
  const [active, setActive] = useState(null);

  useEffect(() => {
    const unsub = onSnapshot(
      collection(db, "contactMessages"),
      (snap) => {
        setMessages(
          snap.docs.map((d) => ({ id: d.id, ...d.data() }))
        );
        setLoading(false);
      }
    );
    return () => unsub();
  }, []);

  /* 🔹 TIME RANGE HELPER */
  const getFromDateByRange = (range) => {
    if (range === "all") return null;

    const now = new Date();
    const map = {
      "1m": 1,
      "3m": 3,
      "6m": 6,
      "12m": 12,
    };

    const months = map[range];
    const from = new Date(now);
    from.setMonth(now.getMonth() - months);
    return from;
  };

  /* 🔹 FILTER + SORT */
  const filtered = useMemo(() => {
    let data = [...messages];

    // 🔍 SEARCH
    if (search) {
      const term = search.toLowerCase();
      data = data.filter(
        (m) =>
          m.firstName?.toLowerCase().includes(term) ||
          m.lastName?.toLowerCase().includes(term) ||
          m.email?.toLowerCase().includes(term)
      );
    }

    // ⏱ TIME RANGE
    const fromDate = getFromDateByRange(timeRange);
    if (fromDate) {
      data = data.filter(
        (m) => m.createdAt?.toDate() >= fromDate
      );
    }

    // 🔃 SORT
    data.sort((a, b) => {
      const aTime = a.createdAt?.seconds || 0;
      const bTime = b.createdAt?.seconds || 0;
      return sort === "newest"
        ? bTime - aTime
        : aTime - bTime;
    });

    return data;
  }, [messages, search, sort, timeRange]);

  const deleteMessage = async (id) => {
    if (!window.confirm("Delete this contact message?")) return;
    await deleteDoc(doc(db, "contactMessages", id));
  };

  /* 🔹 CSV DOWNLOAD (RESPECTS FILTERS) */
  const downloadCSV = () => {
    if (!filtered.length) return;

    const headers = [
      "Name",
      "Email",
      "Phone",
      "Message",
      "Date",
    ];

    const rows = filtered.map((m) => [
      `${m.firstName} ${m.lastName}`,
      m.email,
      m.phone || "",
      m.message,
      m.createdAt?.toDate?.().toLocaleString() || "",
    ]);

    const csv =
      "data:text/csv;charset=utf-8," +
      [headers, ...rows]
        .map((r) =>
          r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(",")
        )
        .join("\n");

    const link = document.createElement("a");
    link.href = encodeURI(csv);
    link.download = `contact-messages-${timeRange}.csv`;
    link.click();
  };

  if (loading) {
    return (
      <div className="py-20 text-center text-blue-600 font-medium">
        Loading contact messages…
      </div>
    );
  }

  return (
    <>
      <div className="space-y-8">
        {/* HEADER */}
        <div className="bg-white/60 backdrop-blur-xl rounded-3xl p-6 ring-1 ring-black/5 flex items-center justify-between">
          <h1 className="text-2xl font-semibold">
            Contact Messages
          </h1>

          <button
            onClick={downloadCSV}
            className="
              cursor-pointer
              flex items-center gap-2
              bg-linear-to-r from-blue-600 to-blue-700
              text-white px-6 py-3 rounded-xl
              shadow-md hover:shadow-lg transition
            "
          >
            <Download size={16} />
            Download CSV
          </button>
        </div>

        {/* FILTER BAR */}
        <div className="bg-white/70 backdrop-blur-xl rounded-3xl p-4 ring-1 ring-black/5 flex flex-wrap gap-4">
          {/* SEARCH */}
          <div className="relative">
            <Search
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />
            <input
              placeholder="Search contact messages"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="
                cursor-pointer
                pl-9 pr-3 py-2 rounded-xl
                ring-1 ring-black/10
                focus:ring-2 focus:ring-blue-500/40
                outline-none w-64
              "
            />
          </div>

          {/* SORT */}
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="cursor-pointer px-3 py-2 rounded-xl ring-1 ring-black/10"
          >
            <option value="newest">Newest first</option>
            <option value="oldest">Oldest first</option>
          </select>

          {/* ⏱ TIME RANGE */}
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="cursor-pointer px-3 py-2 rounded-xl ring-1 ring-black/10"
          >
            <option value="all">All Time</option>
            <option value="1m">Last 1 Month</option>
            <option value="3m">Last 3 Months</option>
            <option value="6m">Last 6 Months</option>
            <option value="12m">Last 12 Months</option>
          </select>
        </div>

        {/* TABLE */}
        <div className="bg-white/70 backdrop-blur-xl rounded-3xl ring-1 ring-black/5 overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-black/5 text-gray-600">
              <tr>
                <th className="px-5 py-4 text-left">Name</th>
                <th className="px-5 py-4 text-left">Email</th>
                <th className="px-5 py-4 text-left">Phone</th>
                <th className="px-5 py-4 text-left">Message</th>
                <th className="px-5 py-4 text-left">Date</th>
                <th className="px-5 py-4 text-center">Action</th>
              </tr>
            </thead>

            <tbody>
              {filtered.map((m) => (
                <tr
                  key={m.id}
                  className="hover:bg-black/5 transition"
                >
                  <td className="px-5 py-4 font-medium">
                    {m.firstName} {m.lastName}
                  </td>
                  <td className="px-5 py-4">{m.email}</td>
                  <td className="px-5 py-4">{m.phone || "-"}</td>

                  <td
                    className="px-5 py-4 max-w-sm cursor-pointer"
                    onClick={() => setActive(m)}
                  >
                    <span className="truncate block text-gray-700 hover:underline">
                      {m.message}
                    </span>
                  </td>

                  <td className="px-5 py-4 text-xs text-gray-500">
                    {m.createdAt?.toDate?.().toLocaleDateString()}
                  </td>

                  <td className="px-5 py-4 text-center">
                    <button
                      onClick={() => deleteMessage(m.id)}
                      className="cursor-pointer text-gray-500 hover:text-red-600 transition"
                    >
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL */}
      {active && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-3xl shadow-xl max-w-lg w-full p-6 relative">
            <button
              onClick={() => setActive(null)}
              className="cursor-pointer absolute right-4 top-4 text-gray-400 hover:text-black transition"
            >
              <X size={18} />
            </button>

            <h3 className="text-lg font-semibold mb-1">
              {active.firstName} {active.lastName}
            </h3>
            <p className="text-sm text-gray-500 mb-4">
              {active.email} • {active.phone}
            </p>

            <div className="bg-gray-50 rounded-xl p-4 whitespace-pre-wrap text-gray-700">
              {active.message}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
