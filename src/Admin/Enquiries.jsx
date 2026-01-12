import { useEffect, useMemo, useState } from "react";
import {
  collection,
  getDocs,
  orderBy,
  query,
} from "firebase/firestore";
import { db } from "../Firebase";
import {
  Search,
  Download,
  X,
} from "lucide-react";

const PAGE_SIZE = 20;

export default function Enquiries() {
  const [enquiries, setEnquiries] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [sort, setSort] = useState("new");

  const [timeRange, setTimeRange] = useState("all"); // 👈 NEW
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    const fetchEnquiries = async () => {
      const q = query(
        collection(db, "enquiries"),
        orderBy("createdAt", "desc")
      );
      const snap = await getDocs(q);
      setEnquiries(
        snap.docs.map((d) => ({ id: d.id, ...d.data() }))
      );
      setLoading(false);
    };
    fetchEnquiries();
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
    let data = [...enquiries];

    // 🔍 Search
    if (search) {
      const term = search.toLowerCase();
      data = data.filter(
        (e) =>
          e.name?.toLowerCase().includes(term) ||
          e.phone?.includes(term) ||
          e.productName?.toLowerCase().includes(term)
      );
    }

    // ⏱ Time range filter
    const fromDate = getFromDateByRange(timeRange);
    if (fromDate) {
      data = data.filter(
        (e) => e.createdAt?.toDate() >= fromDate
      );
    }

    // 🔃 Sort order
    data.sort((a, b) => {
      const d1 = a.createdAt?.toDate();
      const d2 = b.createdAt?.toDate();
      return sort === "new" ? d2 - d1 : d1 - d2;
    });

    return data;
  }, [search, enquiries, sort, timeRange]);

  const paginated = filtered.slice(
    (page - 1) * PAGE_SIZE,
    page * PAGE_SIZE
  );

  /* 🔹 CSV DOWNLOAD (AUTO RESPECTS FILTERS) */
  const downloadCSV = () => {
    if (!filtered.length) return;

    const headers = [
      "Name",
      "Phone",
      "Email",
      "Product",
      "Message",
      "Date",
    ];

    const rows = filtered.map((e) => [
      e.name,
      e.phone,
      e.email || "",
      e.productName || "",
      e.message || "",
      e.createdAt?.toDate().toLocaleString() || "",
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
    link.download = `enquiries-${timeRange}.csv`;
    link.click();
  };

  if (loading) {
    return (
      <div className="py-20 text-center text-blue-600 font-medium">
        Loading enquiries…
      </div>
    );
  }

  return (
    <>
      <div className="space-y-8">
        {/* HEADER */}
        <div className="bg-white/60 backdrop-blur-xl rounded-3xl p-6 ring-1 ring-black/5 flex items-center justify-between">
          <h1 className="text-2xl font-semibold">Enquiries</h1>

          <button
            onClick={downloadCSV}
            className="cursor-pointer flex items-center gap-2 bg-linear-to-r from-blue-600 to-blue-700 text-white px-6 py-3 rounded-xl shadow-md hover:shadow-lg transition"
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
              placeholder="Search enquiries"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              className="cursor-pointer pl-9 pr-3 py-2 rounded-xl ring-1 ring-black/10 focus:ring-2 focus:ring-blue-500/40 outline-none w-64"
            />
          </div>

          {/* SORT ORDER */}
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="cursor-pointer px-3 py-2 rounded-xl ring-1 ring-black/10"
          >
            <option value="new">Newest first</option>
            <option value="old">Oldest first</option>
          </select>

          {/* ⏱ TIME RANGE */}
          <select
            value={timeRange}
            onChange={(e) => {
              setTimeRange(e.target.value);
              setPage(1);
            }}
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
                <th className="px-5 py-4">Phone</th>
                <th className="px-5 py-4">Product</th>
                <th className="px-5 py-4">Message</th>
                <th className="px-5 py-4">Date</th>
              </tr>
            </thead>

            <tbody>
              {paginated.map((e) => (
                <tr
                  key={e.id}
                  onClick={() => setSelected(e)}
                  className="cursor-pointer hover:bg-black/5 transition"
                >
                  <td className="px-5 py-4 font-medium">{e.name}</td>
                  <td className="px-5 py-4">{e.phone}</td>
                  <td className="px-5 py-4">{e.productName}</td>
                  <td className="px-5 py-4 max-w-xs truncate text-gray-600">
                    {e.message}
                  </td>
                  <td className="px-5 py-4 text-xs text-gray-500">
                    {e.createdAt?.toDate().toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL */}
      {selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-3xl shadow-xl max-w-lg w-full p-6 relative">
            <button
              onClick={() => setSelected(null)}
              className="cursor-pointer absolute top-4 right-4 text-gray-400 hover:text-black transition"
            >
              <X size={20} />
            </button>

            <h2 className="text-xl font-semibold mb-4">
              Enquiry Details
            </h2>

            <div className="space-y-3 text-sm text-gray-700">
              <p><strong>Name:</strong> {selected.name}</p>
              <p><strong>Phone:</strong> {selected.phone}</p>
              <p><strong>Email:</strong> {selected.email || "-"}</p>
              <p><strong>Product:</strong> {selected.productName}</p>

              <div>
                <p className="font-medium mb-1">Message</p>
                <div className="bg-gray-50 p-3 rounded-xl max-h-60 overflow-y-auto">
                  {selected.message}
                </div>
              </div>

              <p className="text-xs text-gray-500">
                {selected.createdAt?.toDate().toLocaleString()}
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
