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
      <div className="py-24 text-center">
        <div className="inline-flex items-center gap-3 text-blue-600 font-medium">
          <span className="h-4 w-4 rounded-full border-2 border-blue-600 border-t-transparent animate-spin" />
          Loading dashboard
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-10">
      {/* HEADER */}
      <div className="bg-white/60 backdrop-blur-xl rounded-3xl p-6 ring-1 ring-black/5">
        <h1 className="text-2xl font-semibold tracking-tight text-gray-900">
          Dashboard
        </h1>
        <p className="text-gray-500 mt-1">
          Welcome back, manage everything from here
        </p>
      </div>

      {/* STATS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Products"
          value={stats.totalProducts}
          icon={<Package size={22} />}
          accent="blue"
        />
        <StatCard
          title="Collections"
          value={stats.totalCollections}
          icon={<Layers size={22} />}
          accent="indigo"
        />
        <StatCard
          title="Enquiries"
          value={stats.totalEnquiries}
          icon={<MessageSquare size={22} />}
          accent="violet"
        />
        <StatCard
          title="Contact Messages"
          value={stats.totalContacts}
          icon={<Mail size={22} />}
          accent="cyan"
        />
      </div>

      {/* QUICK ACTIONS */}
      <div className="bg-white/70 backdrop-blur-xl rounded-3xl p-6 shadow-sm ring-1 ring-black/5">
        <h2 className="font-semibold text-gray-900 mb-5">
          Quick Actions
        </h2>

        <div className="flex flex-wrap gap-4">
          <Link
            to="/admin/products/add"
            className="group flex items-center gap-2
              bg-gradient-to-r from-blue-600 to-blue-700
              text-white px-6 py-3 rounded-xl
              shadow-md hover:shadow-lg
              transition"
          >
            <Plus size={16} className="group-hover:rotate-90 transition" />
            Add Product
          </Link>

          <QuickLink
            to="/admin/collections"
            label="Manage Collections"
          />

          <QuickLink
            to="/admin/enquiries"
            label="View Enquiries"
          />

          <QuickLink
            to="/admin/contact-data"
            label="Contact Messages"
          />
        </div>
      </div>
    </div>
  );
}

/* 🔹 PREMIUM STAT CARD */
function StatCard({ title, value, icon, accent }) {
  const accents = {
    blue: "from-blue-500/20 to-blue-600/20 text-blue-600",
    indigo: "from-indigo-500/20 to-indigo-600/20 text-indigo-600",
    violet: "from-violet-500/20 to-violet-600/20 text-violet-600",
    cyan: "from-cyan-500/20 to-cyan-600/20 text-cyan-600",
  };

  return (
    <div
      className="
        group relative
        bg-white/70 backdrop-blur-xl
        rounded-3xl p-6
        ring-1 ring-black/5
        hover:-translate-y-1 hover:shadow-xl
        transition-all
      "
    >
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm text-gray-500">
          {title}
        </p>

        <div
          className={`
            p-3 rounded-xl bg-gradient-to-br
            ${accents[accent]}
          `}
        >
          {icon}
        </div>
      </div>

      <h3 className="text-3xl font-semibold tracking-tight text-gray-900">
        {value}
      </h3>
    </div>
  );
}

/* 🔹 QUICK LINK */
function QuickLink({ to, label }) {
  return (
    <Link
      to={to}
      className="
        group flex items-center gap-2
        px-6 py-3 rounded-xl
        bg-white/80 backdrop-blur
        ring-1 ring-black/10
        hover:bg-blue-50
        transition
      "
    >
      <span className="text-gray-800 font-medium">
        {label}
      </span>
      <ArrowRight
        size={16}
        className="text-gray-400 group-hover:translate-x-1 transition"
      />
    </Link>
  );
}
