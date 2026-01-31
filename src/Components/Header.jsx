// Header.jsx
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
  const isHome = location.pathname === "/";

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

  // Close mobile menu on route change
  useEffect(() => {
    setOpen(false);
    setShowDropdown(false);
  }, [location.pathname]);

  return (
    <>
      <motion.header
        initial={{ y: -60, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className={`
          z-50 w-full transition-all duration-300
          ${isHome ? "fixed top-0" : "sticky top-0"}
          ${
            isHome
              ? scrolled
                ? "bg-black/50 backdrop-blur-lg py-3 sm:py-4"
                : "bg-transparent py-8 sm:py-10 lg:py-16"
              : "bg-black/60 backdrop-blur-lg py-3 sm:py-4"
          }
        `}
      >
        <div className="mx-auto max-w-7xl  mt-4 px-8 sm:px-12 md:mt-4 lg:px-10">
          <div className="flex items-center justify-between gap-3">
            {/* LOGO */}
            <Link
              to="/"
              className="flex items-center gap-2 text-white font-semibold uppercase whitespace-nowrap"
            >
              <img src={logo} alt="Mac Engineers" className="h-7 sm:h-8" />
              <span className="text-base sm:text-lg tracking-wide">
                MAC-ENGINEERS
              </span>
            </Link>

            {/* DESKTOP NAV (lg+) */}
            <nav className="hidden lg:flex items-center gap-6 xl:gap-10 text-white text-sm relative uppercase tracking-wide">
              <NavLink label="HOME" to="/" active={isActive("/")} />
              <NavLink label="ABOUT US" to="/about" active={isActive("/about")} />
              <NavLink
                label="PRODUCTS"
                to="/product"
                active={isActive("/product")}
              />

              {/* COLLECTIONS DROPDOWN */}
              <div
                className="relative"
                onMouseEnter={() => setShowDropdown(true)}
                onMouseLeave={() => setShowDropdown(false)}
              >
                <button
                  type="button"
                  className="flex items-center gap-2 opacity-80 hover:opacity-100 transition"
                >
                  COLLECTIONS
                  <motion.span
                    animate={{ rotate: showDropdown ? 180 : 0 }}
                    transition={{ duration: 0.3, ease: "easeOut" }}
                  >
                    <svg
                      width="12"
                      height="12"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M6 9l6 6 6-6" />
                    </svg>
                  </motion.span>
                </button>

                <AnimatePresence>
                  {showDropdown && (
                    <motion.div
                      initial={{ opacity: 0, y: 12, scale: 0.98 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 12, scale: 0.98 }}
                      transition={{ duration: 0.25, ease: "easeOut" }}
                      className="
                        absolute top-full mt-4
                        left-1/2 -translate-x-1/2
                        bg-white rounded-3xl
                        shadow-[0_30px_80px_rgba(0,0,0,0.25)]
                        px-6 py-5
                        w-[92vw] sm:w-[520px] lg:w-[720px] xl:w-[900px]
                        grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3
                        gap-x-10 gap-y-4
                        max-h-[420px] overflow-y-auto
                        modern-scroll
                      "
                    >
                      {collections.length === 0 ? (
                        <p className="text-gray-500 text-sm px-3 py-2 uppercase">
                          NO COLLECTIONS
                        </p>
                      ) : (
                        collections.map((c) => (
                          <Link
                            key={c.id}
                            to={`/collections/${c.slug}`}
                            className="
                              text-sm font-medium uppercase
                              text-gray-800
                              hover:text-[#fabd14]
                              transition
                              leading-snug
                              break-words
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

              <NavLink
                label="PROJECTS"
                to="/projects"
                active={isActive("/projects")}
              />

              {/* CONTACT BUTTON */}
              <Link
                to="/contact"
                className="
                  relative group overflow-hidden
                  bg-white text-black
                  px-4 py-2
                  rounded-full
                  flex items-center gap-3
                  font-semibold uppercase
                  shadow-[0_8px_24px_rgba(0,0,0,0.12)]
                "
              >
                {/* Hover bg */}
                <span
                  className="
                    absolute inset-0
                    bg-[#fabd14]
                    -translate-x-full
                    group-hover:translate-x-0
                    transition-transform
                    duration-500
                    ease-out
                  "
                />
                {/* Content */}
                <span className="relative z-10 flex items-center gap-3">
                  CONTACT US
                  <span
                    className="
                      bg-black/90
                      rounded-full
                      p-2
                      flex items-center justify-center
                      transition-all
                      duration-300
                      group-hover:bg-black
                    "
                  >
                    <svg
                      className="
                        w-4 h-4
                        text-white
                        transition-transform
                        duration-300
                        ease-out
                        -rotate-45
                        group-hover:rotate-0
                        group-hover:translate-x-0.5
                      "
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M5 12h14" />
                      <path d="M13 6l6 6-6 6" />
                    </svg>
                  </span>
                </span>
              </Link>
            </nav>

            {/* MOBILE/TABLET MENU BUTTON (below lg) */}
            <button
              onClick={() => setOpen(true)}
              className="lg:hidden text-white text-2xl"
              aria-label="Open menu"
            >
              ☰
            </button>
          </div>
        </div>
      </motion.header>

      {/* MOBILE/TABLET MENU */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm"
          >
            <motion.div
              initial={{ y: -40, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -40, opacity: 0 }}
              className="
                absolute top-4 left-4 right-4
                bg-black rounded-3xl
                p-6 text-white uppercase
                max-h-[90vh] overflow-y-auto
                modern-scroll
              "
            >
              {/* HEADER */}
              <div className="flex items-center justify-between mb-6">
                <Link
                  to="/"
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-2 text-lg font-semibold whitespace-nowrap"
                >
                  <img src={logo} className="h-7" alt="Mac Engineers" />
                  MAC-ENGINEERS
                </Link>

                <button
                  onClick={() => setOpen(false)}
                  className="text-2xl"
                  aria-label="Close menu"
                >
                  ✕
                </button>
              </div>

              {/* LINKS */}
              <ul className="space-y-5 text-sm tracking-wide">
                <li>
                  <Link to="/" onClick={() => setOpen(false)}>
                    HOME
                  </Link>
                </li>

                <li>
                  <Link to="/about" onClick={() => setOpen(false)}>
                    ABOUT US
                  </Link>
                </li>

                <li>
                  <Link to="/product" onClick={() => setOpen(false)}>
                    PRODUCTS
                  </Link>
                </li>

                <li>
                  <Link to="/projects" onClick={() => setOpen(false)}>
                    PROJECTS
                  </Link>
                </li>

                {/* COLLECTIONS ACCORDION */}
                <li>
                  <button
                    type="button"
                    onClick={() => setShowDropdown(!showDropdown)}
                    className="w-full flex items-center justify-between opacity-80 hover:opacity-100 transition"
                  >
                    COLLECTIONS
                    <motion.span
                      animate={{ rotate: showDropdown ? 180 : 0 }}
                      transition={{ duration: 0.25 }}
                    >
                      <svg
                        width="14"
                        height="14"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <path d="M6 9l6 6 6-6" />
                      </svg>
                    </motion.span>
                  </button>

                  <AnimatePresence>
                    {showDropdown && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25, ease: "easeOut" }}
                        className="
                          mt-3 pl-4
                          space-y-3
                          max-h-64 overflow-y-auto
                          modern-scroll
                          border-l border-white/10
                        "
                      >
                        {collections.map((c) => (
                          <Link
                            key={c.id}
                            to={`/collections/${c.slug}`}
                            onClick={() => setOpen(false)}
                            className="block text-xs opacity-80 hover:opacity-100 break-words"
                          >
                            {c.name}
                          </Link>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </li>
              </ul>

              {/* CONTACT CTA */}
              <Link
                to="/contact"
                onClick={() => setOpen(false)}
                className="
                  mt-8 block text-center
                  bg-[#fabd14] text-black
                  py-3 rounded-full
                  font-semibold
                  tracking-wide
                "
              >
                CONTACT US
              </Link>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

/* NAV LINK */
function NavLink({ to, label, active }) {
  return (
    <div className="relative">
      <Link to={to} className="opacity-80 hover:opacity-100 transition">
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
