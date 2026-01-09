export default function TestimonialCard({ review }) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-lg transition-shadow duration-300 flex flex-col gap-6 p-6">
      
      {/* TOP BAR */}
      <div className="flex items-center justify-between bg-slate-100 rounded-xl px-4 py-3">
        <span className="font-medium text-slate-900">
          {review.headerName}
        </span>
        <span className="text-sm text-slate-500">
          {review.year}
        </span>
      </div>

      {/* STARS */}
      <div className="flex gap-1">
        {Array.from({ length: 5 }).map((_, i) => (
          <span key={i} className="text-orange-500 text-lg">★</span>
        ))}
      </div>

      {/* REVIEW TEXT */}
      <p className="text-slate-700 leading-relaxed text-sm">
        {review.text}
      </p>

      {/* FOOTER */}
      <div className="pt-4 border-t border-slate-200">
        <p className="font-medium text-slate-900">
          {review.author}
        </p>
        <p className="text-sm text-slate-500">
          {review.location}
        </p>
      </div>
    </div>
  );
}
