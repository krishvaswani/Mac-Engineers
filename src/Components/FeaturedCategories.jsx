// Image Imports
import airConditioning from "../Assets/True-wireless-earbuds_small.webp";
import inductionHeating from "../Assets/Neckbands_bc6343f4-622f-4ebd-bb36-205643c3bf78_small.png";
import inlineDuct from "../Assets/Smartwatches_88f12bcf-24bd-4e3a-aacb-ecc204f62179_small.webp";
import airDiffuser from "../Assets/nirvana_52689447-c1bb-4bb8-8fa0-0496e3715fc0_small.webp";
import ventilation from "../Assets/Wireless-Headphones_small.webp";
import oxygenSensor from "../Assets/Wireless-Speaker_small.webp";
import wetScrubber from "../Assets/Wired-Headphones_small.webp";
import airCooling from "../Assets/Wired-Earphones_small.webp";
import fanCoil from "../Assets/Soundbars_d9a7bdfd-e780-4581-ab85-f2e86f84cd28_small.webp";
import oxygenConcentrator from "../Assets/Gaming-Headphones_small.png";
import ductDampers from "../Assets/Gaming-Headphones_small.png";
import pressureValve from "../Assets/Gaming-Headphones_small.png";

// Categories Data
const categories = [
  { title: "Industrial Air Conditioning", image: airConditioning },
  { title: "Induction Heating Machine", image: inductionHeating },
  { title: "Inline Duct Fans", image: inlineDuct },
  { title: "Air Diffuser", image: airDiffuser },
  { title: "Air Ventilation System", image: ventilation },
  { title: "Oxygen Sensor", image: oxygenSensor },
  { title: "Wet Scrubber", image: wetScrubber },
  { title: "Air Cooling System", image: airCooling },
  { title: "Fan Coil Unit", image: fanCoil },
  { title: "Oxygen Concentrator Machine", image: oxygenConcentrator },
  { title: "Duct Dampers", image: ductDampers },
  { title: "Pressure Relief Valve", image: pressureValve },
];

export default function CategoryIcons() {
  const isCarousel = categories.length > 6;

  return (
    <section className="bg-white py-16">
      <div className="max-w-7xl mx-auto px-6">

        {/* GRID (≤ 6 items) */}
        {!isCarousel && (
          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-y-12 gap-x-6">
            {categories.map((cat, index) => (
              <CategoryItem key={index} cat={cat} />
            ))}
          </div>
        )}

        {/* CAROUSEL (> 6 items) */}
        {isCarousel && (
          <div className="flex gap-10 overflow-x-auto scrollbar-hide snap-x snap-mandatory py-2">
            {categories.map((cat, index) => (
              <div key={index} className="snap-center shrink-0">
                <CategoryItem cat={cat} />
              </div>
            ))}
          </div>
        )}

      </div>
    </section>
  );
}

/* Reusable Category Item */
function CategoryItem({ cat }) {
  return (
    <div className="flex flex-col items-center text-center cursor-pointer group w-28">
      
      {/* Icon */}
      <div className="w-20 h-20 flex items-center justify-center rounded-full bg-slate-100 shadow-sm group-hover:shadow-md transition">
        <img
          src={cat.image}
          alt={cat.title}
          className="w-14 h-14 object-contain"
          loading="lazy"
        />
      </div>

      {/* Title */}
      <p className="mt-4 text-sm font-medium text-slate-900 leading-tight">
        {cat.title}
      </p>
    </div>
  );
}
