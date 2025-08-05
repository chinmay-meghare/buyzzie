import React from "react";
import { assets } from "../../assets/assets";

const categories = [
  {
    name: "Clothes",
    items: 8,
    img: assets.product_clothes,
  },
  {
    name: "Electronics",
    items: 12,
    img: assets.product_laptop,
  },
  {
    name: "Shoes",
    items: 6,
    img: assets.product_shoes,
  },
  {
    name: "Furniture",
    items: 7,
    img: assets.product_chair,
  },
  {
    name: "Miscellaneous",
    items: 9,
    img: assets.product_misc,
  },
];

const CategoryPreview = () => {
  return (
    <section className="w-full bg-[#10318] py-16 px-4">
      <div className="max-w-7xl mx-auto flex flex-col items-center">
        <h2 className="text-4xl md:text-6xl font-bold text-center mb-4">
          <span className="bg-gradient-to-r from-[#ebebeb] to-[#9379fc] bg-clip-text text-transparent">
            Shop by Category
          </span>
        </h2>
        <p className="text-lg md:text-xl text-gray-400 text-center mb-12">
          Explore our carefully curated collections designed for the modern
          lifestyle
        </p>
        <div className="w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8">
          {categories.map((cat) => (
            <div
              key={cat.name}
              className="group relative bg-[#202328] rounded-2xl overflow-hidden shadow-md flex flex-col border border-[#23262b] transition-all duration-300 hover:border-violet-500"
              style={{ minHeight: 380 }}
            >
              {/* Card hover scale */}
              <div className="absolute inset-0 z-0 group-hover:scale-[1.03] transition-transform duration-300" />
              {/* Image with scale on hover */}
              <img
                src={cat.img}
                alt={cat.name}
                className="w-full h-56 object-cover transition-transform duration-300 group-hover:scale-105"
                draggable="false"
              />
              {/* Content with scale on hover */}
              <div className="flex flex-col flex-1 justify-between p-6 transition-transform duration-300 group-hover:scale-105">
                <div>
                  <h3 className="text-2xl font-semibold text-white mb-1">
                    {cat.name}
                  </h3>
                  <p className="text-gray-400 mb-6">{cat.items} Items</p>
                </div>
                <button className="w-full py-2 rounded-lg border border-[#23262b] text-white font-semibold transition-colors duration-200 hover:bg-[#23204a]">
                  Explore
                </button>
              </div>
              {/* Animated border (for smoothness) */}
              <span className="pointer-events-none absolute inset-0 rounded-2xl border-2 border-transparent group-hover:border-violet-500 transition-all duration-300 z-10"></span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CategoryPreview;
