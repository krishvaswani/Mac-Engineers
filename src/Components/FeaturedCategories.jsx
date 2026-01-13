// Image Imports
import airDiffuser from "../Assets/Featured-collection/Air Diffusers.png";
import inlineDuct from "../Assets/Featured-collection/Air Ventilation Systems.png";
import inductionHeating from "../Assets/Featured-collection/Induction Heating Machines.png";
import airConditioning from "../Assets/Featured-collection/Industrial Air Conditioning System.png";
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
    <section className="bg-white pt-16 pb-8">
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
          <div className="flex gap-8 overflow-x-auto scrollbar-hide snap-x snap-mandatory py-2">
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
