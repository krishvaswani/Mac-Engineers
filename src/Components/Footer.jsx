import { Link } from "react-router-dom";
import logo from "../Assets/logo.png";

export default function Footer() {
  return (
    <footer className="bg-black text-gray-300 relative rounded-3xl m-5">
      <div className="max-w-7xl mx-auto px-8 py-16">
        {/* TOP GRID */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-16">
          
          {/* BRAND */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 mb-6">
              <span className="text-white font-bold text-xl"><Link
                            to="/"
                            className="flex items-center gap-2 text-white font-semibold text-lg"
                          >
                            <img src={logo} alt="Mac Engineers" className="h-8" />
                            Mac-Engineers
                          </Link></span>
            </div>

            <p className="text-gray-400 max-w-md leading-relaxed">
              We are a technology-focused company delivering secure, scalable
              and high-performance digital solutions for modern businesses.
            </p>
          </div>

          {/* LINKS 1 */}
          <div>
            <h4 className="text-white font-medium mb-6">Company</h4>
            <ul className="space-y-4">
              <li><Link className="hover:text-white transition" to="/product">Products</Link></li>
              <li><Link className="hover:text-white transition" to="/about">About Us</Link></li>
              <li><Link className="hover:text-white transition" to="/contact">Contact Us</Link></li>
              {/* <li><Link className="hover:text-white transition" to="/faq">FAQ</Link></li> */}
              {/* <li><Link className="hover:text-white transition" to="/contact">Get in Touch</Link></li> */}
            </ul>
          </div>

          {/* LINKS 2 */}
          <div>
            <h4 className="text-white font-medium mb-6">Collections</h4>
            <ul className="space-y-4">
              <li>UI/UX Design</li>
              <li>Web Development</li>
              <li>System Architecture</li>
              <li>SEO & Marketing</li>
              <li>24/7 Support</li>
            </ul>
          </div>

          {/* CONTACT */}
          <div>
            <h4 className="text-white font-medium mb-6 ">Contact</h4>

            <p className="text-gray-400 mb-2">+91 98765 43210</p>
            <p className="text-white text-xl font-semibold mb-6">
              info@secunet.com
            </p>

            {/* IMAGE CARD */}
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
          
          {/* COPYRIGHT */}
          <p className="text-sm text-gray-400">
            © {new Date().getFullYear()} SecuNet. All rights reserved.
          </p>

          {/* SOCIALS */}
          <div className="flex items-center gap-6 text-gray-400">
            <a href="#" className="hover:text-white transition">Fb</a>
            <a href="#" className="hover:text-white transition">X</a>
            <a href="#" className="hover:text-white transition">Be</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
