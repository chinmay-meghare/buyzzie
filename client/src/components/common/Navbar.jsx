import React from "react";

function Navbar() {
  return (
    <nav className="w-full flex items-center justify-between px-12 py-4 bg-[#1d0c3f] ">
      <div className="text-3xl font-bold tracking-wide">
        <h1 className="text-5xl md:text-3xl font-black leading-tight mb-2">
          <span className="bg-gradient-to-r from-violet-400 via-pink-400 to-amber-400 bg-clip-text text-transparent">
            Buyzzie
          </span>
        </h1>
      </div>
      <ul className="flex gap-8 text-lg font-medium text-white/90">
        <li className="hover:text-cyan-300 cursor-pointer">Home</li>
        <li className="hover:text-cyan-300 cursor-pointer">Shop</li>
        <li className="hover:text-cyan-300 cursor-pointer">Categories</li>
        <li className="hover:text-cyan-300 cursor-pointer">New Arrivals</li>
        <li className="hover:text-cyan-300 cursor-pointer">About</li>
      </ul>
      <div className="flex items-center gap-6 text-white text-2xl">
        <span className="cursor-pointer">
          <i className="fa fa-search" />
        </span>
        <span className="cursor-pointer">
          <i className="fa fa-user" />
        </span>
        <span className="relative cursor-pointer">
          <i className="fa fa-shopping-cart" />
          <span className="absolute -top-2 -right-2 bg-pink-400 text-xs text-white rounded-full px-2 py-0.5 font-bold">
            3
          </span>
        </span>
      </div>
    </nav>
  );
}

export default Navbar;
