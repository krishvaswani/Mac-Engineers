import { useNavigate } from "react-router-dom";

/* Image Imports */
import airDiffuser from "../Assets/Featured-collection/Air Diffusers.png";
import ventilation from "../Assets/Featured-collection/Air Ventilation Systems.png";
import inductionHeating from "../Assets/Featured-collection/Induction Heating Machines.png";
import airConditioning from "../Assets/Featured-collection/Industrial Air Conditioning System.png";
import inlineDuct from "../Assets/Featured-collection/Inline Duct Fans.png";
import oxygenSensor from "../Assets/Featured-collection/oxygen.png";
import wetScrubber from "../Assets/Featured-collection/wet.png";
import airCooling from "../Assets/Featured-collection/aircooling.png"; 
import fanCoil from "../Assets/Featured-collection/fancoil.png";
import oxygenConcentrator from "../Assets/Featured-collection/oxygensystem.png";
import ductDampers from "../Assets/Featured-collection/Duct.png";
import pressureValve from "../Assets/Featured-collection/valve.png";

/* Categories Data (with slugs) */
const categories = [
  { title: "Inline Duct Fans", image: inlineDuct, slug: "inline-duct-fans" },
  { title: "Air Diffuser", image: airDiffuser, slug: "air-diffusers" },
  { title: "Fan Coil Unit", image: fanCoil, slug: "fan-coil-units" },
  { title: "Wet Scrubber", image: wetScrubber, slug: "wet-scrubbers" },
  { title: "Duct Dampers", image: ductDampers, slug: "duct-dampers" },
  { title: "Oxygen Sensor", image: oxygenSensor, slug: "oxygen-sensors" },
  { title: "Industrial Air Conditioning", image: airConditioning, slug: "industrial-air-conditioning" },
  { title: "Induction Heating Machine", image: inductionHeating, slug: "induction-heating-machines" },
  { title: "Air Ventilation System", image: ventilation, slug: "air-ventilation-systems" },
  { title: "Air Cooling System", image: airCooling, slug: "air-cooling-systems" },
  { title: "Pressure Relief Valve", image: pressureValve, slug: "pressure-relief-valves" },
  { title: "Oxygen Concentrator Machine", image: oxygenConcentrator, slug: "oxygen-concentrator-machines" },
];

export default function CategoryIcons() {
  const isCarousel = categories.length > 6;

  return (
    <section className="bg-white py-8 ">
      <div className="max-w-7xl mx-auto px-4">

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
          <div className="flex gap-14 overflow-x-auto scrollbar-hide snap-x snap-mandatory py-2">
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
  const navigate = useNavigate();

  return (
    <div
      onClick={() => navigate(`/collections/${cat.slug}`)}
      className="flex flex-col items-center text-center cursor-pointer group w-28"
    >
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
      <p className="mt-4 text-sm font-medium text-slate-900">
        {cat.title}
      </p>
    </div>
  );
}
