export default function ProductCard({
  image,
  title,
  price,
  oldPrice,
  rating = 4,
  discount,
}) {
  return (
    <div
      className="
        group bg-white rounded-2xl border border-slate-200
        overflow-hidden transition-all duration-300
        hover:-translate-y-1
        hover:shadow-[0_20px_50px_rgba(0,0,0,0.12)]
      "
    >
      {/* IMAGE */}
      <div className="relative bg-slate-50 aspect-square flex items-center justify-center p-6 overflow-hidden">
        
        {/* DISCOUNT BADGE */}
        {discount && (
          <span
            className="
              absolute top-4 left-4 z-10
              bg-red-500 text-white text-xs font-semibold
              px-3 py-1 rounded-full
              shadow-md
            "
          >
            {discount}
          </span>
        )}

        {/* PRODUCT IMAGE */}
        <img
          src={image}
          alt={title}
          className="
            max-h-full max-w-full object-contain
            transition-transform duration-300
            group-hover:scale-105
          "
          draggable="false"
        />
      </div>

      {/* CONTENT */}
      <div className="p-5 space-y-3">
        
        {/* TITLE */}
        <h3
          className="
            text-sm font-medium text-slate-900
            leading-snug line-clamp-2
          "
        >
          {title}
        </h3>

        {/* PRICE */}
        <div className="flex items-center gap-2">
          {oldPrice && (
            <span className="text-sm text-slate-400 line-through">
              ${oldPrice}
            </span>
          )}
          <span className="text-base font-semibold text-slate-900">
            ${price}
          </span>
        </div>

        {/* RATING */}
        <div className="flex items-center gap-1">
          {[1, 2, 3, 4, 5].map((i) => (
            <span
              key={i}
              className={`text-sm ${
                i <= rating
                  ? "text-amber-400"
                  : "text-slate-300"
              }`}
            >
              ★
            </span>
          ))}
          <span className="ml-2 text-xs text-slate-500">
            ({rating}.0)
          </span>
        </div>

        {/* CTA (OPTIONAL BUT PREMIUM) */}
        <button
          className="
            mt-3 w-full text-sm font-medium
            text-slate-700 border border-slate-300
            rounded-lg py-2
            transition-all duration-200
            group-hover:bg-slate-900
            group-hover:text-white
            group-hover:border-slate-900
          "
        >
          View product
        </button>
      </div>
    </div>
  );
}
