import React from 'react';

const Hero: React.FC = () => {
  return (
    <section className="relative h-[80vh] flex items-center justify-center overflow-hidden">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <img
          src="/hero-bg.png"
          alt="Oro Restaurant Interior"
          className="w-full h-full object-cover scale-105 animate-fade-in"
        />
        <div className="absolute inset-0 bg-black/50" />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto text-center px-4">
        <span className="block text-oro-gold font-sans font-semibold tracking-[0.3em] uppercase mb-4 animate-fade-in">
          Premium Filipino Cuisine
        </span>
        <h1 className="text-6xl md:text-8xl font-serif text-white mb-8 animate-slide-up leading-tight">
          Exquisite Flavors,
          <span className="block text-oro-gold">Golden Traditions.</span>
        </h1>
        <p className="text-xl md:text-2xl text-white/90 mb-10 max-w-3xl mx-auto animate-slide-up delay-100 font-sans font-light">
          Indulge in a culinary journey where authentic Filipino recipes meet modern elegance.
        </p>
        <div className="flex justify-center animate-slide-up delay-200">
          <a
            href="#menu"
            className="group relative inline-flex items-center justify-center px-10 py-4 font-serif text-lg font-bold text-oro-dark transition-all duration-300 bg-oro-gold rounded-full hover:bg-oro-accent hover:shadow-xl hover:-translate-y-1"
          >
            Explore Our Menu
            <div className="absolute inset-0 rounded-full border-2 border-oro-gold group-hover:scale-110 group-hover:opacity-0 transition-all duration-500" />
          </a>
        </div>
      </div>
    </section>
  );
};

export default Hero;