import React from "react";
import { Link } from "react-router-dom";

function Hero() {
  return (
    <section className="hero-bg bg-cover relative flex flex-col justify-center min-h-[80vh] px-12 py-10 text-white overflow-hidden">
      <div className="absolute inset-0 bg-black/40"></div>

      <div className="relative z-10">
        <div className="max-w-3xl mt-24">
          <h1 className="text-6xl font-extrabold leading-tight mb-4">
            Shop the Future.
            <br />
            Wear the Vibe.
          </h1>
          <p className="text-xl text-purple-100 mb-10">
            Curated essentials for the digital generation.
            <br />
            Express yourself through our premium collection.
          </p>
          <div className="flex gap-6">
            <Link to="/collection">
              <button className="bg-gradient-to-r from-violet-600 to-violet-400 text-white text-lg font-semibold px-4 py-2 rounded-full shadow-lg hover:scale-105 transition-transform">
                Shop Now
              </button>
            </Link>
            <Link to="/collection">
              <button className="border-2 border-white text-white text-lg font-semibold px-4 py-2 rounded-full hover:bg-white/10 transition">
                Explore Categories
              </button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Hero;
