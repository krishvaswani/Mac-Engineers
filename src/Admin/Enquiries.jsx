import { useEffect, useMemo, useState } from "react";
import {
  collection,
  getDocs,
  orderBy,
  query,
} from "firebase/firestore";
import { db } from "../Firebase";

const PAGE_SIZE = 20;

export default function Enquiries() {
  const [enquiries, setEnquiries] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [sort, setSort] = useState("new"); // new | old
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  useEffect(() => {
    const fetchEnquiries = async () => {
      const q = query(
        collection(db, "enquiries"),
        orderBy("createdAt", "desc")
      );
      const snap = await getDocs(q);

      setEnquiries(
        snap.docs.map((d) => ({
          id: d.id,
          ...d.data(),
        }))
      );
      setLoading(false);
    };

    fetchEnquiries();
  }, []);

  /* 🔍 FILTER + SORT */
  const filtered = useMemo(() => {
    let data = [...enquiries];

    // Search
    if (search) {
      const term = search.toLowerCase();
      data = data.filter((e) =>
        e.name?.toLowerCase().includes(term) ||
        e.phone?.includes(term) ||
        e.productName?.toLowerCase().includes(term)
      );
    }

    // Date range filter
    if (fromDate) {
      const from = new Date(fromDate);
      data = data.filter(
        (e) => e.createdAt?.toDate() >= from
      );
    }

    if (toDate) {
      const to = new Date(toDate);
      to.setHours(23, 59, 59, 999);
      data = data.filter(
        (e) => e.createdAt?.toDate() <= to
      );
    }

    // Sort
    data.sort((a, b) => {
      const d1 = a.createdAt?.toDate();
      const d2 = b.createdAt?.toDate();
      if (!d1 || !d2) return 0;
      return sort === "new" ? d2 - d1 : d1 - d2;
    });

    return data;
  }, [search, enquiries, sort, fromDate, toDate]);

  /* 📄 PAGINATION */
  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paginated = filtered.slice(
    (page - 1) * PAGE_SIZE,
    page * PAGE_SIZE
  );

  /* ⬇️ CSV DOWNLOAD */
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
    link.download = "enquiries.csv";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (loading) return <p>Loading enquiries…</p>;

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="flex flex-wrap gap-4 items-center justify-between">
        <h1 className="text-2xl font-semibold">Enquiries</h1>

        <button
          onClick={downloadCSV}
          className="border px-4 py-2 rounded-lg hover:bg-gray-50"
        >
          Download CSV
        </button>
      </div>

      {/* FILTER BAR */}
      <div className="flex flex-wrap gap-3">
        <input
          placeholder="Search name / phone / product"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
          className="border p-2 rounded-lg w-full sm:w-64"
        />

        <select
          value={sort}
          onChange={(e) => setSort(e.target.value)}
          className="border p-2 rounded-lg"
        >
          <option value="new">Newest first</option>
          <option value="old">Oldest first</option>
        </select>

        <input
          type="date"
          value={fromDate}
          onChange={(e) => setFromDate(e.target.value)}
          className="border p-2 rounded-lg"
        />

        <input
          type="date"
          value={toDate}
          onChange={(e) => setToDate(e.target.value)}
          className="border p-2 rounded-lg"
        />
      </div>

      {/* EMPTY STATE */}
      {filtered.length === 0 ? (
        <div className="bg-white border rounded-xl p-10 text-center text-gray-500">
          No enquiries found
        </div>
      ) : (
        <>
          {/* TABLE */}
          <div className="bg-white border rounded-xl overflow-x-auto">
            <table className="w-full text-sm min-w-225">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-4 py-3 text-left">Name</th>
                  <th className="px-4 py-3 text-left">Phone</th>
                  <th className="px-4 py-3 text-left">Email</th>
                  <th className="px-4 py-3 text-left">Product</th>
                  <th className="px-4 py-3 text-left">Message</th>
                  <th className="px-4 py-3 text-left">Date</th>
                </tr>
              </thead>

              <tbody>
                {paginated.map((e) => (
                  <tr key={e.id} className="border-b last:border-none">
                    <td className="px-4 py-3">{e.name}</td>
                    <td className="px-4 py-3">{e.phone}</td>
                    <td className="px-4 py-3">{e.email || "-"}</td>
                    <td className="px-4 py-3">{e.productName}</td>
                    <td className="px-4 py-3 max-w-xs truncate">
                      {e.message}
                    </td>
                    <td className="px-4 py-3 text-xs text-gray-500">
                      {e.createdAt?.toDate().toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* PAGINATION */}
          {totalPages > 1 && (
            <div className="flex gap-2">
              {Array.from({ length: totalPages }).map((_, i) => (
                <button
                  key={i}
                  onClick={() => setPage(i + 1)}
                  className={`px-3 py-1 rounded ${
                    page === i + 1
                      ? "bg-black text-white"
                      : "border"
                  }`}
                >
                  {i + 1}
                </button>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
