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
  const isGrid = collections.length > 8;
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

  return (
    <>
      <motion.header
        initial={{ y: -60, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className={`
          z-50 w-full transition-all duration-300
          ${isHome ? "fixed top-0" : "sticky top-0"}
          ${isHome
            ? scrolled
              ? "bg-black/50 backdrop-blur-lg py-4"
              : "bg-transparent py-16"
            : "bg-black/60 backdrop-blur-lg py-4"
          }
        `}
      >
        <div className="md:mx-5">
          <div className="flex items-center justify-between px-10">

            {/* LOGO */}
            <Link
              to="/"
              className="flex items-center gap-2 text-white font-semibold text-lg uppercase"
            >
              <img src={logo} alt="Mac Engineers" className="h-8" />
              MAC-ENGINEERS
            </Link>

            {/* DESKTOP NAV */}
            <nav className="hidden md:flex items-center gap-10 text-white text-sm relative uppercase tracking-wide">
              <NavLink label="HOME" to="/" active={isActive("/")} />
              <NavLink label="ABOUT US" to="/about" active={isActive("/about")} />
              <NavLink label="PRODUCTS" to="/product" active={isActive("/product")} />

              {/* COLLECTIONS */}
              <div
                className="relative"
                onMouseEnter={() => setShowDropdown(true)}
                onMouseLeave={() => setShowDropdown(false)}
              >
                <button className="flex items-center gap-2 opacity-80 hover:opacity-100 transition">
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
  absolute top-full mt-6
  left-1/2 -translate-x-1/2
  bg-white rounded-3xl
  shadow-[0_30px_80px_rgba(0,0,0,0.25)]
  px-8 py-6
  w-180 max-w-[90vw]
  grid grid-cols-[repeat(auto-fit,minmax(240px,1fr))]
  gap-x-10 gap-y-4
  max-h-105 overflow-y-auto
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

              <NavLink label="PROJECTS" to="/projects" active={isActive("/projects")} />

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
                {/* Hover background animation */}
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

                {/* Button content */}
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
            className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm"
          >
            <motion.div
              initial={{ y: -40, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -40, opacity: 0 }}
              className="absolute top-5 left-5 right-5 bg-black rounded-3xl p-6 text-white uppercase"
            >
              <div className="flex items-center justify-between mb-6">
                <Link to="/" onClick={() => setOpen(false)} className="flex items-center gap-2 text-lg font-semibold">
                  <img src={logo} className="h-7" />
                  MAC-ENGINEERS
                </Link>
                <button onClick={() => setOpen(false)} className="text-2xl">✕</button>
              </div>

              <ul className="space-y-4 text-base">
                <li><Link to="/" onClick={() => setOpen(false)}>HOME</Link></li>
                <li><Link to="/product" onClick={() => setOpen(false)}>PRODUCTS</Link></li>
                <li><Link to="/about" onClick={() => setOpen(false)}>ABOUT US</Link></li>
              </ul>
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
