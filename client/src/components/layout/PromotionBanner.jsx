import { Link } from "react-router-dom";

const PromotionBanner = () => {
  return (
    <div className="py-16 px-4">
    <section className="w-full py-12 px-4 border bg-gradient-to-r from-[#181024] to-[#1a0a2e] text-white rounded-3xl border-violet-500/50">
      <div className="max-w-5xl mx-auto flex flex-col gap-8">
        <h2 className="text-3xl md:text-5xl font-bold">
          Summer Collection
          <span className="bg-gradient-to-r from-[#bcaaff] to-[#a18aff] bg-clip-text text-transparent">
            &nbsp;2026
          </span>
        </h2>
        <p className="text-lg md:text-xl text-gray-300">
          Limited edition drops. Get them before they're gone.
        </p>

        <Link to="/collection">
          <button className="w-fit px-6 md:px-8 py-2 bg-white text-black rounded-full text-lg font-medium shadow hover:bg-gray-100 transition">
            View Collection
          </button>
        </Link>
      </div>
    </section>
    </div>
  );
};

export default PromotionBanner;
