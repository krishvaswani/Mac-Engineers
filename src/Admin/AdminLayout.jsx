import { Link, Outlet, useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth } from "../Firebase";
import { Menu, X, LogOut } from "lucide-react";
import { useState } from "react";

const SIDEBAR_WIDTH = "w-64"; // 256px

export default function AdminLayout() {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const logout = async () => {
    await signOut(auth);
    navigate("/admin/login", { replace: true });
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* MOBILE OVERLAY */}
      {open && (
        <div
          className="fixed inset-0 bg-black/40 z-40 md:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      {/* SIDEBAR */}
      <aside
        className={`
          fixed top-0 left-0 z-50
          h-screen ${SIDEBAR_WIDTH}
          bg-black text-white
          flex flex-col
          transform transition-transform
          ${open ? "translate-x-0" : "-translate-x-full"}
          md:translate-x-0
        `}
      >
        {/* HEADER */}
        <div className="px-5 py-4 border-b border-white/10 flex justify-between items-center">
          <h2 className="text-lg font-semibold">Admin Panel</h2>
          <button className="md:hidden" onClick={() => setOpen(false)}>
            <X size={18} />
          </button>
        </div>

        {/* NAV */}
        <nav className="flex-1 px-5 py-6 space-y-3 overflow-y-auto">
          <Link to="/admin" className="block hover:text-gray-300">
            Dashboard
          </Link>
          <Link to="/admin/products" className="block hover:text-gray-300">
            Products
          </Link>
          <Link to="/admin/collections" className="block hover:text-gray-300">
            Collections
          </Link>
          <Link to="/admin/enquiries" className="block hover:text-gray-300">
            Enquiries
          </Link>
          <Link to="/admin/contact-data" className="block hover:text-gray-300">
            Contact Us Data
          </Link>
        </nav>

        {/* LOGOUT */}
        <div className="px-5 py-4 border-t border-white/10">
          <button
            onClick={logout}
            className="flex items-center gap-2 text-red-400 hover:text-red-300"
          >
            <LogOut size={16} />
            Logout
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <div
        className={`
          min-h-screen
          md:ml-64   /* ← THIS FIXES EVERYTHING */
        `}
      >
        {/* MOBILE TOP BAR */}
        <div className="md:hidden bg-white px-4 py-3 border-b flex items-center gap-3">
          <button onClick={() => setOpen(true)}>
            <Menu size={20} />
          </button>
          <h3 className="font-semibold">Admin Panel</h3>
        </div>

        {/* PAGE CONTENT */}
        <main className="p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
