// Footer.jsx
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../Firebase";
import logo from "../Assets/logo.png";

export default function Footer() {
  const [collections, setCollections] = useState([]);

  useEffect(() => {
    const fetchCollections = async () => {
      const snap = await getDocs(collection(db, "collections"));

      // ✅ LIMIT TO ONLY 6 COLLECTIONS
      setCollections(
        snap.docs
          .map((d) => ({
            id: d.id,
            ...d.data(),
          }))
          .slice(0, 6)
      );
    };

    fetchCollections();
  }, []);

  return (
    <footer className="bg-black/60 text-white relative rounded-3xl mx-4 sm:mx-5 my-5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        {/* TOP GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-10 xl:gap-16">
          {/* BRAND */}
          <div className="sm:col-span-2 lg:col-span-3 xl:col-span-2">
            <Link
              to="/"
              className="flex items-center gap-2 mb-5 text-white font-semibold text-lg"
            >
              <img src={logo} alt="Mac Engineers" className="h-7 sm:h-8" />
              Mac-Engineers
            </Link>

            <p className="text-white/90 max-w-md leading-relaxed text-sm sm:text-base">
              Established in the year 2018 at Hastsal Industrial Area, New Delhi,
              we “Mac Engineers” are a Partnership based firm, engaged as the
              foremost Manufacturer and Trader of Duct Dampers, Industrial Water
              Chillers, SS Kitchen Exhaust Hood, Kitchen Exhaust Wet Scrubber,
              Etc.
            </p>
          </div>

          {/* COMPANY LINKS */}
          <div>
            <h4 className="text-white font-medium mb-4 sm:mb-6">Company</h4>
            <ul className="space-y-3 sm:space-y-4 text-sm sm:text-base">
              <li>
                <Link className="hover:text-white transition" to="/about">
                  About Us
                </Link>
              </li>
              <li>
                <Link className="hover:text-white transition" to="/contact">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link className="hover:text-white transition" to="/product">
                  Products
                </Link>
              </li>
              <li>
                <Link className="hover:text-white transition" to="/projects">
                  Projects
                </Link>
              </li>
            </ul>
          </div>

          {/* DYNAMIC COLLECTIONS (MAX 6) */}
          <div>
            <h4 className="text-white font-medium mb-4 sm:mb-6">
              Collections
            </h4>

            {collections.length === 0 ? (
              <p className="text-gray-400 text-sm">Loading…</p>
            ) : (
              <ul className="space-y-3 sm:space-y-4 text-sm sm:text-base">
                {collections.map((c) => (
                  <li key={c.slug || c.id}>
                    <Link
                      to={`/collections/${c.slug}`}
                      className="hover:text-white transition break-words"
                    >
                      {c.name}
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* CONTACT */}
          <div className="xl:pl-2">
            <h4 className="text-white font-medium mb-4 sm:mb-6">Contact</h4>

            <p className="text-white/90 text-sm sm:text-base mb-2 break-words">
              +91 98765 43210
            </p>
            <p className="text-white/90 text-sm sm:text-base mb-2 break-words">
              info@secunet.com
            </p>

            <p className="text-white font-medium mb-2">Address</p>
            <p className="text-white/90 text-sm sm:text-base leading-relaxed break-words">
              2nd Floor, Plot No. 62a, Om Vihar, Phase-IV, Uttam Nagar, New
              Delhi-110059
            </p>
          </div>
        </div>

        {/* DIVIDER */}
        <div className="border-t border-white/10 mt-14 sm:mt-20 pt-6 sm:pt-8 flex flex-col md:flex-row items-center justify-between gap-4 sm:gap-6">
          <p className="text-xs sm:text-sm text-white/90 text-center leading-relaxed">
            © {new Date().getFullYear()} mac-engineers. Made with love by{" "}
            <a
              href="https://nexadvent.in"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white transition"
            >
              NexAdvent
            </a>
          </p>

          <div className="flex items-center gap-4 sm:gap-6 text-white/90 text-sm">
            <a href="#" className="hover:text-white transition cursor-pointer">
              Fb
            </a>
            <a href="#" className="hover:text-white transition cursor-pointer">
              X
            </a>
            <a href="#" className="hover:text-white transition cursor-pointer">
              Be
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
