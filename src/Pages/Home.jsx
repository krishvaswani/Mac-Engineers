import FeaturedCategories from "../Components/FeaturedCategories.jsx";
import AboutSection from "../Components/AboutSection.jsx";
import IndustriesSection from "../Components/IndustriesSection.jsx";
import Stats from "../Components/Stats.jsx";
import ProductGrid from "../Components/Productgrid.jsx";
import ProjectsSection from "../Components/ProjectsSection.jsx";
import Process from "../Components/Process.jsx";
import ContactSection from "../Components/ContactSection.jsx";
import ReviewsSection from "../Components/ReviewsSection.jsx";
import Hero from "../Components/Hero";

export default function Home() {
  return (
    <main className="relative w-full overflow-hidden bg-white">

      {/* ================= PAGE SECTIONS ================= */}

      <Hero/>

      <FeaturedCategories />

      <AboutSection />

      <IndustriesSection />
      

      <Stats />

      <ProductGrid />

      <ProjectsSection />

      <Process />

      <ContactSection />

      <ReviewsSection />

    </main>
  );
}
