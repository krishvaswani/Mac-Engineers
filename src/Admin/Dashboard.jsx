import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../Firebase";
import { Link } from "react-router-dom";

export default function Dashboard() {
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalCollections: 0,
    totalEnquiries: 0,
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [
          productsSnap,
          collectionsSnap,
          enquiriesSnap,
        ] = await Promise.all([
          getDocs(collection(db, "products")),
          getDocs(collection(db, "collections")),
          getDocs(collection(db, "enquiries")),
        ]);

        setStats({
          totalProducts: productsSnap.size,
          totalCollections: collectionsSnap.size,
          totalEnquiries: enquiriesSnap.size,
        });
      } catch (err) {
        console.error("Dashboard stats error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="py-20 text-gray-500">
        Loading dashboard…
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* HEADER */}
      <div>
        <h1 className="text-2xl font-semibold">Dashboard</h1>
        <p className="text-gray-500 mt-1">
          Welcome to your admin panel
        </p>
      </div>

      {/* STATS CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <StatCard
          title="Total Products"
          value={stats.totalProducts}
        />
        <StatCard
          title="Collections"
          value={stats.totalCollections}
        />
        <StatCard
          title="Enquiries"
          value={stats.totalEnquiries}
        />
      </div>

      {/* QUICK ACTIONS */}
      <div className="bg-white border rounded-xl p-6">
        <h2 className="font-semibold mb-4">
          Quick Actions
        </h2>

        <div className="flex flex-wrap gap-4">
          <Link
            to="/admin/products/add"
            className="bg-black text-white px-5 py-2 rounded-lg"
          >
            + Add Product
          </Link>

          <Link
            to="/admin/collections"
            className="border px-5 py-2 rounded-lg"
          >
            Manage Collections
          </Link>

          <Link
            to="/admin/enquiries"
            className="border px-5 py-2 rounded-lg"
          >
            View Enquiries
          </Link>
        </div>
      </div>
    </div>
  );
}

/* 🔹 Reusable Stat Card */
function StatCard({ title, value }) {
  return (
    <div className="bg-white border rounded-xl p-6">
      <p className="text-sm text-gray-500 mb-1">
        {title}
      </p>
      <h3 className="text-3xl font-semibold">
        {value}
      </h3>
    </div>
  );
}
