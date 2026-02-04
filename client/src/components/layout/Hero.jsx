import React from "react";
import { Link } from "react-router-dom";
import heroImageMobile from "../../assets/images/freepik-model-mobile-image.jpg";
import heroImageDesktop from "../../assets/images/freepik-model-image.jpg";

function Hero() {
  return (
    <section className="relative h-[850px] md:h-[1000px] lg:h-[100vh] overflow-hidden">
      {/* Art Direction: Different images for mobile vs. desktop */}
      <picture>
        <source
          media="(max-width: 1075px)"
          srcSet={heroImageMobile}
        />
        <source
          media="(min-width: 1076px)"
          srcSet={heroImageDesktop}
        />
        <img
          src={heroImageDesktop}
          alt="Hero Banner - Shop the Future Collection"
          className="w-full h-full object-cover object-[80%_center]"
          loading="eager"
          fetchPriority="high"
        />
      </picture>

      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-black/20 to-transparent" />

      {/* Hero Content */}
      <div className="absolute inset-0 flex flex-col justify-center px-6 md:px-12 py-10 text-white">
        <div className="relative z-10 max-w-3xl mt-12 md:mt-24">
          <h1 className="text-4xl md:text-6xl font-extrabold leading-tight mb-4">
            Level Up Your Look.
            <br />
            Built for Style.
          </h1>
          <p className="text-lg md:text-xl text-purple-100 mb-8 md:mb-10">
            Fresh drops for the digital era.
            <br />
            Grab the latest essentials and show the world who you are.
          </p>
          <div className="flex flex-row max-[500px]:flex-col gap-4 md:gap-6">
            <Link to="/collection">
              <button className="w-full sm:w-auto bg-gradient-to-r from-violet-600 to-violet-400 text-white text-lg font-semibold px-6 md:px-6 py-2 rounded-full shadow-lg hover:scale-105 transition-transform">
                Shop Now
              </button>
            </Link>
            <Link to="/collection">
              <button className="w-full sm:w-auto border-2 border-white text-white text-lg font-semibold px-6 md:px-8 py-2 rounded-full hover:bg-white/10 transition">
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
