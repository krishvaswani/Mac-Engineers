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
    <footer className="bg-black text-gray-300 relative rounded-3xl m-5">
      <div className="max-w-7xl mx-auto px-8 py-16">

        {/* TOP GRID */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-16">

          {/* BRAND */}
          <div className="md:col-span-2">
            <Link
              to="/"
              className="flex items-center gap-2 mb-6 text-white font-semibold text-lg"
            >
              <img src={logo} alt="Mac Engineers" className="h-8" />
              Mac-Engineers
            </Link>

            <p className="text-gray-400 max-w-md leading-relaxed">
              We are a technology-focused company delivering secure, scalable
              and high-performance digital solutions for modern businesses.
            </p>
          </div>

          {/* COMPANY LINKS */}
          <div>
            <h4 className="text-white font-medium mb-6">
              Company
            </h4>
            <ul className="space-y-4">
              
              <li>
                <Link
                  className="hover:text-white transition"
                  to="/about"
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  className="hover:text-white transition"
                  to="/contact"
                >
                  Contact Us
                </Link>
              </li>
              <li>
                <Link
                  className="hover:text-white transition"
                  to="/product"
                >
                  Products
                </Link>
              </li>
               <li>
                <Link
                  className="hover:text-white transition"
                  to="/projects"
                >
                  Projects
                </Link>
              </li>
            </ul>
          </div>

          {/* DYNAMIC COLLECTIONS (MAX 6) */}
          <div>
            <h4 className="text-white font-medium mb-6">
              Collections
            </h4>

            {collections.length === 0 ? (
              <p className="text-gray-500 text-sm">
                Loading…
              </p>
            ) : (
              <ul className="space-y-4">
                {collections.map((c) => (
                  <li key={c.slug || c.id}>
                    <Link
                      to={`/collection/${c.slug}`}
                      className="hover:text-white transition"
                    >
                      {c.name}
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* CONTACT */}
          <div>
            <h4 className="text-white font-medium mb-6">
              Contact
            </h4>

            <p className="text-gray-400 mb-2">
              +91 98765 43210
            </p>
            <p className="text-white text-xl font-semibold mb-6">
              info@secunet.com
            </p>

            <div className="rounded-xl overflow-hidden bg-linear-to-br from-gray-800 to-gray-900 shadow-lg">
              <img
                src="/src/Assets/footer.jpg"
                alt="Footer visual"
                className="w-full h-28 object-cover opacity-90"
              />
            </div>
          </div>
        </div>

        {/* DIVIDER */}
        <div className="border-t border-white/10 mt-20 pt-8 flex flex-col md:flex-row items-center justify-between gap-6">

         <p className="text-sm text-gray-400 text-center leading-relaxed">
  © {new Date().getFullYear()} mac-engineers. Made with love by{" "}
  <a
    href="https://nexadvent.com"
    target="_blank"
    rel="noopener noreferrer"
    className="hover:text-white transition"
  >
    nexAdvent
  </a>
</p>

          <div className="flex items-center gap-6 text-gray-400">
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
