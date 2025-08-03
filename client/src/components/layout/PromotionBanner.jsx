import React from "react";

const PromotionBanner = () => {
  return (
    <section className="w-full bg-gradient-to-r from-[#181024] to-[#1a0a2e] text-white py-16 px-4 md:px-16">
      <div className="max-w-5xl mx-auto flex flex-col gap-8">
        <h2 className="text-3xl md:text-5xl font-bold">
          Summer Collection
          <span className="bg-gradient-to-r from-[#bcaaff] to-[#a18aff] bg-clip-text text-transparent">
            2023
          </span>
        </h2>
        <p className="text-lg md:text-xl text-gray-300">
          Limited edition drops. Get them before they're gone.
        </p>
        <button className="w-fit px-8 py-4 bg-white text-black rounded-full text-lg font-medium shadow hover:bg-gray-100 transition">
          View Collection
        </button>
      </div>
    </section>
  );
};

export default PromotionBanner;