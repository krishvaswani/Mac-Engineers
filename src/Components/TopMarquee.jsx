export default function TopMarquee() {
  const items = [
    "24/7 Emergency HVAC Repairs — Call Now!",
    "Duct Cleaning 20% Off This Month",
    "Winter Prep Special — Furnace Checkup $59",
    "Serving Homes & Businesses",
  ];

  return (
    <>
      <style>{`
        .marquee-track {
          display: flex;
          width: max-content;
          animation: marquee 20s linear infinite;
        }
        .marquee-item {
          white-space: nowrap;
          padding: 0 24px;
        }
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-33.33%); }
        }
      `}</style>

      <div className="overflow-hidden bg-white py-2 text-[11px] sm:text-xs text-gray-600">
        <div className="marquee-track">
          {[1, 2, 3].map((g) => (
            <div key={g} className="flex">
              {items.map((text, i) => (
                <span key={`${g}-${i}`} className="marquee-item">
                  {text}
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
