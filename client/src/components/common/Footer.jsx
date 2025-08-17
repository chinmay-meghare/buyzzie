import React from "react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-transparent border-t border-gray-700/30 py-12 mt-15">
      <div className="px-4 sm:px-8 md:px-12 lg:px-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-8">
          <div>
            <h3 className="text-2xl font-extrabold mb-2 bg-gradient-to-r from-violet-500 to-pink-500 bg-clip-text text-transparent">
              Buyzzie
            </h3>
            <p className="text-gray-400">
              Curated collections for the next generation
            </p>
          </div>

          <div className="md:col-span-2 grid grid-cols-1 sm:grid-cols-3 gap-8">
            <div>
              <h4 className="text-white text-base font-semibold mb-4">Shop</h4>
              <Link
                to="/collection"
                className="block text-gray-400 mb-2 hover:text-violet-500 transition-colors"
              >
                All Products
              </Link>
              <Link
                to="/collection"
                className="block text-gray-400 mb-2 hover:text-violet-500 transition-colors"
              >
                New Arrivals
              </Link>
              <Link
                to="/collection"
                className="block text-gray-400 mb-2 hover:text-violet-500 transition-colors"
              >
                Sale
              </Link>
            </div>
            <div>
              <h4 className="text-white text-base font-semibold mb-4">
                Support
              </h4>
              <a
                href="#"
                className="block text-gray-400 mb-2 hover:text-violet-500 transition-colors"
              >
                Help Center
              </a>
              <a
                href="#"
                className="block text-gray-400 mb-2 hover:text-violet-500 transition-colors"
              >
                Returns
              </a>
              <a
                href="#"
                className="block text-gray-400 mb-2 hover:text-violet-500 transition-colors"
              >
                Shipping
              </a>
            </div>
            <div>
              <h4 className="text-white text-base font-semibold mb-4">
                Connect
              </h4>
              <a
                href="#"
                className="block text-gray-400 mb-2 hover:text-violet-500 transition-colors"
              >
                Instagram
              </a>
              <a
                href="#"
                className="block text-gray-400 mb-2 hover:text-violet-500 transition-colors"
              >
                Twitter
              </a>
              <a
                href="#"
                className="block text-gray-400 mb-2 hover:text-violet-500 transition-colors"
              >
                TikTok
              </a>
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-gray-700/30 text-center">
          <p className="text-gray-500 text-sm">
            &copy; 2024 Buyzzie. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
