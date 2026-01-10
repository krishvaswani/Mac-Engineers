import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import ScrollToTop from "./Components/ScrollToTop";
import TopMarquee from "./Components/TopMarquee";
import Header from "./Components/Header.jsx";
import Footer from "./Components/Footer.jsx";

// FRONTEND PAGES
import Home from "./Pages/Home.jsx";
import About from "./Pages/About.jsx";
import Contact from "./Pages/Contact.jsx";
import Services from "./Pages/Services.jsx";
import Blog from "./Pages/Blog.jsx";
import ProductPage from "./Pages/ProductPage.jsx";
import CollectionPage from "./Pages/CollectionPage";
import Allproduct from "./Pages/Products.jsx"

// ADMIN
import AdminLogin from "./Admin/AdminLogin";
import AdminLayout from "./Admin/AdminLayout";
import Dashboard from "./Admin/Dashboard";
import Products from "./Admin/Products";
import Collections from "./Admin/Collections";
import ProtectedRoute from "./Components/ProtectedRoute";
import AddProduct from "./Admin/AddProduct";
import EditProduct from "./Admin/EditProduct";
import Enquiries from "./Admin/Enquiries";
import ContactMessages from "./Admin/ContactMessages";

function LayoutWrapper({ children }) {
  const location = useLocation();
  const isAdmin = location.pathname.startsWith("/admin");

  return (
    <>
      {!isAdmin && (
        <>
          <TopMarquee />
          <Header />
        </>
      )}

      {children}

      {!isAdmin && <Footer />}
    </>
  );
}

function AppRoutes() {
  return (
    <Routes>
      {/* FRONTEND */}
      <Route path="/" element={<Home />} />
      <Route path="/services" element={<Services />} />
      <Route path="/blog/*" element={<Blog />} />
      <Route path="/about/*" element={<About />} />
      <Route path="/contact/*" element={<Contact />} />
      <Route path="/product" element={<Allproduct />} />
      <Route path="/product/:id" element={<ProductPage />} />
      <Route path="/collections/:slug" element={<CollectionPage />} />

      {/* ADMIN LOGIN (PUBLIC) */}
      <Route path="/admin/login" element={<AdminLogin />} />

      {/* ADMIN PANEL (PROTECTED) */}
      <Route
        path="/admin/*"
        element={
          <ProtectedRoute>
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Dashboard />} />
        <Route path="products" element={<Products />} />
        <Route path="products/add" element={<AddProduct />} />
        <Route path="products/edit/:id" element={<EditProduct />} />
        <Route path="collections" element={<Collections />} />
        <Route path="enquiries" element={<Enquiries />} />
        <Route path="contact-data" element={<ContactMessages />} />
      </Route>
    </Routes>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <LayoutWrapper>
        <AppRoutes />
      </LayoutWrapper>
    </BrowserRouter>
  );
}
