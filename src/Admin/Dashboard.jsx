import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../Firebase";
import { Link } from "react-router-dom";
import {
  Package,
  Layers,
  MessageSquare,
  Plus,
  ArrowRight,
  Mail,
} from "lucide-react";

export default function Dashboard() {
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalCollections: 0,
    totalEnquiries: 0,
    totalContacts: 0,
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [
          productsSnap,
          collectionsSnap,
          enquiriesSnap,
          contactSnap,
        ] = await Promise.all([
          getDocs(collection(db, "products")),
          getDocs(collection(db, "collections")),
          getDocs(collection(db, "enquiries")),
          getDocs(collection(db, "contactMessages")),
        ]);

        setStats({
          totalProducts: productsSnap.size,
          totalCollections: collectionsSnap.size,
          totalEnquiries: enquiriesSnap.size,
          totalContacts: contactSnap.size,
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
      <div className="py-20 text-gray-500 text-center">
        Loading dashboard…
      </div>
    );
  }

  return (
    <div className="space-y-8 bg-gradient-to-br from-gray-50 to-white p-6 rounded-3xl">
      {/* HEADER */}
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">
          Dashboard
        </h1>
        <p className="text-gray-500 mt-1">
          Welcome to your admin panel
        </p>
      </div>

      {/* STATS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Products"
          value={stats.totalProducts}
          icon={<Package size={22} />}
        />
        <StatCard
          title="Collections"
          value={stats.totalCollections}
          icon={<Layers size={22} />}
        />
        <StatCard
          title="Enquiries"
          value={stats.totalEnquiries}
          icon={<MessageSquare size={22} />}
        />
        <StatCard
          title="Contact Messages"
          value={stats.totalContacts}
          icon={<Mail size={22} />}
        />
      </div>

      {/* QUICK ACTIONS */}
      <div className="bg-white/80 backdrop-blur rounded-2xl p-6 shadow-sm ring-1 ring-black/5">
        <h2 className="font-semibold mb-4">
          Quick Actions
        </h2>

        <div className="flex flex-wrap gap-4">
          <Link
            to="/admin/products/add"
            className="flex items-center gap-2 bg-black text-white px-5 py-2.5 rounded-xl shadow-sm hover:opacity-90 transition"
          >
            <Plus size={16} />
            Add Product
          </Link>

          <Link
            to="/admin/collections"
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl ring-1 ring-black/10 hover:bg-black/5 transition"
          >
            Manage Collections
            <ArrowRight size={16} />
          </Link>

          <Link
            to="/admin/enquiries"
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl ring-1 ring-black/10 hover:bg-black/5 transition"
          >
            View Enquiries
            <ArrowRight size={16} />
          </Link>

          <Link
            to="/admin/contact-data"
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl ring-1 ring-black/10 hover:bg-black/5 transition"
          >
            View Contact Messages
            <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </div>
  );
}

/* 🔹 PREMIUM STAT CARD */
function StatCard({ title, value, icon }) {
  return (
    <div className="bg-white/80 backdrop-blur rounded-2xl p-6 shadow-sm ring-1 ring-black/5 hover:-translate-y-1 transition">
      <div className="flex items-center justify-between mb-3">
        <p className="text-sm text-gray-500">
          {title}
        </p>
        <div className="text-gray-400">
          {icon}
        </div>
      </div>

      <h3 className="text-3xl font-semibold tracking-tight">
        {value}
      </h3>
    </div>
  );
}
