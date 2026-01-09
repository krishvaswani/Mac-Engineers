export default function ContactHero() {
  return (
    <section className="relative h-[50vh] w-full overflow-hidden">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1581091215367-59ab6c5f8c7b?q=80&w=1920&auto=format&fit=crop')",
        }}
      />

      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-black/60" />

      {/* CONTENT */}
      <div className="relative z-10 h-full max-w-7xl mx-auto px-6 flex flex-col">
     

        {/* HERO TEXT */}
        <div className="flex-1 flex items-center">
          <div className="max-w-xl text-white">
            <h1 className="text-5xl md:text-6xl font-bold leading-tight">
              Product 
            </h1>
            <p className="mt-6 text-lg text-white/80">
              Have questions about your HVAC system? Need a quick repair,
              maintenance service, or a custom consultation?
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
