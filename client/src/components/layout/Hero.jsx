import React from "react";
import { Link } from "react-router-dom";

function Hero() {
  return (
    <section className="relative flex flex-col justify-center min-h-[80vh] px-12 py-10 bg-gradient-to-br from-[#2d176e] via-[#a171fa] to-[#4a1ad1]  text-white overflow-hidden">
      <div className="max-w-3xl mt-24">
        <h1 className="text-6xl font-extrabold leading-tight mb-4">
          Shop the <span className="text-cyan-300">Future.</span>
          <br />
          Wear the <span className="text-cyan-300">Vibe.</span>
        </h1>
        <p className="text-xl text-purple-100 mb-10">
          Curated essentials for the digital generation.
          <br />
          Express yourself through our premium collection.
        </p>
        <div className="flex gap-6">
          <Link to="/collection">
            <button className="bg-gradient-to-r from-pink-500 to-pink-400 text-white text-lg font-semibold px-8 py-4 rounded-full shadow-lg hover:scale-105 transition-transform">
              Shop Now
            </button>
          </Link>
          <Link to="/collection">
            <button className="border-2 border-white text-white text-lg font-semibold px-8 py-4 rounded-full hover:bg-white/10 transition">
              Explore Categories
            </button>
          </Link>
        </div>
      </div>
      {/* Optional: Add background effects here if needed */}
    </section>
  );
}

export default Hero;
