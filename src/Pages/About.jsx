import ValuesSection from "../Components/About-Us-Sections/ValuesSection";
import WhoWeAre from "../Components/About-Us-Sections/WhoWeAre";
import WhyUsSection from "../Components/About-Us-Sections/WhyUsSection";
import AboutUsCard from "../Components/About-Us-Sections/AboutUsCards";
import BannerHero from "../Components/BannerHero"

export default function About() {
  return (
    <main className="min-h-screen">
      <BannerHero/>
      {/* WHO WE ARE SECTION */}
      <WhoWeAre />

      {/* Values Section */}

      <ValuesSection/>

      {/* Why us section  */}

      <WhyUsSection/>

      {/* testimonial section  */}

      <AboutUsCard/>
    </main>
  );
}
