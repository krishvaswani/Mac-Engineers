import {
  Outlet,
  useNavigate,
  NavLink,
  useLocation,
} from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth } from "../Firebase";
import {
  Menu,
  X,
  LogOut,
  LayoutDashboard,
  Package,
  Layers,
  Mail,
  PhoneCall,
} from "lucide-react";
import { useState } from "react";

const SIDEBAR_WIDTH = "w-64";

export default function AdminLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const [open, setOpen] = useState(false);

  const logout = async () => {
    await signOut(auth);
    navigate("/admin/login", { replace: true });
  };

  const navItems = [
    {
      name: "Dashboard",
      path: "/admin",
      icon: LayoutDashboard,
      exact: true,
    },
    {
      name: "Products",
      path: "/admin/products",
      icon: Package,
    },
    {
      name: "Collections",
      path: "/admin/collections",
      icon: Layers,
    },
    {
      name: "Enquiries",
      path: "/admin/enquiries",
      icon: Mail,
    },
    {
      name: "Contact Us Data",
      path: "/admin/contact-data",
      icon: PhoneCall,
    },
  ];

  const isActive = (item) => {
    if (item.exact) {
      return location.pathname === item.path;
    }
    return location.pathname.startsWith(item.path);
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
          backdrop-blur-xl
          bg-linear-to-b from-blue-900/80 via-blue-800/80 to-blue-900/80
          border-r border-white/10
          text-white
          flex flex-col
          transform transition-transform duration-300
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
        <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item);

            return (
              <NavLink
                key={item.name}
                to={item.path}
                onClick={() => setOpen(false)}
                className={`
                  flex items-center gap-3 px-4 py-2.5 rounded-xl
                  text-sm font-medium transition
                  ${
                    active
                      ? "bg-white/20 text-white shadow-md"
                      : "text-blue-100 hover:bg-white/10 hover:text-white"
                  }
                `}
              >
                <Icon size={18} />
                {item.name}
              </NavLink>
            );
          })}
        </nav>

        {/* LOGOUT */}
        <div className="px-5 py-4 border-t border-white/10">
          <button
            onClick={logout}
            className="flex items-center gap-2 text-red-300 hover:text-red-200 transition"
          >
            <LogOut size={16} />
            Logout
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <div className="min-h-screen md:ml-64">
        {/* MOBILE TOP BAR */}
        <div className="md:hidden bg-white px-4 py-3 border-b flex items-center gap-3">
          <button onClick={() => setOpen(true)}>
            <Menu size={20} />
          </button>
          <h3 className="font-semibold text-gray-800">
            Admin Panel
          </h3>
        </div>

        {/* PAGE CONTENT */}
        <main className="p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
