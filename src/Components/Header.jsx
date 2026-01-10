import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../Firebase";
import logo from "../Assets/logo.png";

export default function Header() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [collections, setCollections] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const location = useLocation();

  /* SCROLL EFFECT */
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  /* FETCH COLLECTIONS */
  useEffect(() => {
    const fetchCollections = async () => {
      const snap = await getDocs(collection(db, "collections"));
      setCollections(
        snap.docs.map((d) => ({
          id: d.id,
          ...d.data(),
        }))
      );
    };
    fetchCollections();
  }, []);

  const isActive = (path) =>
    location.pathname === path ||
    location.pathname.startsWith(path + "/");

  return (
    <>
      {/* HEADER */}
      <motion.header
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
        className={`fixed top-0 left-0 w-full z-50 transition-all duration-300
          ${scrolled ? "bg-black/80 backdrop-blur-lg py-4" : "bg-transparent py-16"}
        `}
      >
        <div className="mx-5">
          <div className="flex items-center justify-between px-10">

            {/* LOGO */}
            <Link
              to="/"
              className="flex items-center gap-2 text-white font-semibold text-lg"
            >
              <img src={logo} alt="Mac Engineers" className="h-8" />
              Mac-Engineers
            </Link>

            {/* DESKTOP NAV */}
            <nav className="hidden md:flex items-center gap-10 text-white text-sm relative">

              <NavLink label="Home" to="/" active={isActive("/")} />

              <NavLink label="Products" to="/product" active={isActive("/product")} />
              <NavLink label="Projects" to="/projects"  />

              {/* COLLECTIONS DROPDOWN */}
              <div
                className="relative"
                onMouseEnter={() => setShowDropdown(true)}
                onMouseLeave={() => setShowDropdown(false)}
              >
                <button className="opacity-80 hover:opacity-100 transition">
                  Collections
                </button>

                <AnimatePresence>
                  {showDropdown && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="
                        absolute top-full mt-4 left-0
                        bg-black/90 backdrop-blur-lg
                        rounded-2xl shadow-xl
                        min-w-55 p-3
                      "
                    >
                      {collections.length === 0 ? (
                        <p className="text-gray-400 text-sm px-3 py-2">
                          No collections
                        </p>
                      ) : (
                        collections.map((c) => (
                          <Link
                            key={c.id}
                            to={`/collections/${c.slug}`}
                            className="
                              block px-4 py-2 rounded-xl
                              text-sm text-white/80
                              hover:bg-white/10 hover:text-white
                              transition
                            "
                          >
                            {c.name}
                          </Link>
                        ))
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <NavLink label="About Us" to="/about" active={isActive("/about")} />

              {/* CONTACT BUTTON */}
              <Link
                to="/contact"
                className="group bg-white text-black px-6 py-3 rounded-full flex items-center gap-3 font-medium"
              >
                CONTACT US
                <span className="bg-yellow-500 rounded-full p-2 flex items-center justify-center">
                  <svg
                    className="w-4 h-4 text-white transition-transform duration-300 -rotate-45 group-hover:rotate-0"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M5 12h14" />
                    <path d="M13 6l6 6-6 6" />
                  </svg>
                </span>
              </Link>
            </nav>

            {/* MOBILE MENU BUTTON */}
            <button
              onClick={() => setOpen(true)}
              className="md:hidden text-white text-2xl"
            >
              ☰
            </button>
          </div>
        </div>
      </motion.header>

      {/* MOBILE MENU */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-999 bg-black/70 backdrop-blur-sm"
          >
            <motion.div
              initial={{ y: -40, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -40, opacity: 0 }}
              className="absolute top-5 left-5 right-5 bg-black rounded-3xl p-6 text-white"
            >
              <div className="flex items-center justify-between mb-6">
                <Link
                  to="/"
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-2 text-lg font-semibold"
                >
                  <img src={logo} className="h-7" />
                  Mac-Engineers
                </Link>
                <button onClick={() => setOpen(false)} className="text-2xl">
                  ✕
                </button>
              </div>

              <ul className="space-y-4 text-base">
                <li><Link to="/" onClick={() => setOpen(false)}>Home</Link></li>
                <li><Link to="/product" onClick={() => setOpen(false)}>Products</Link></li>

                {/* MOBILE COLLECTIONS */}
                <li>
                  <p className="text-gray-400 text-sm mb-2">Collections</p>
                  <ul className="space-y-2 pl-3">
                    {collections.map((c) => (
                      <li key={c.id}>
                        <Link
                          to={`/collections/${c.slug}`}
                          onClick={() => setOpen(false)}
                          className="block text-sm"
                        >
                          {c.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </li>

                <li><Link to="/about" onClick={() => setOpen(false)}>About Us</Link></li>
              </ul>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

/* 🔹 Small helper */
function NavLink({ to, label, active }) {
  return (
    <div className="relative">
      <Link
        to={to}
        className="opacity-80 hover:opacity-100 transition"
      >
        {label}
      </Link>

      {active && (
        <motion.span
          layoutId="active-underline"
          className="absolute -bottom-2 left-0 right-0 h-0.5 bg-yellow-500 rounded-full"
        />
      )}
    </div>
  );
}
