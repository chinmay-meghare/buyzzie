import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { fetchCategories, setFilters } from "../../features/products/productSlice";
import { ArrowRight } from "lucide-react";

/**
 * BentoGrid Component
 * A responsive, Apple-inspired Bento grid layout for category display
 * 
 * Features:
 * - Asymmetric card layout with varying sizes for visual interest
 * - Gradient backgrounds matching category themes
 * - Redux integration for seamless filter management
 * - Smooth hover animations and micro-interactions
 * - Fully responsive across mobile, tablet, and desktop
 * - Optimized for scroll restoration (eager loading, fixed heights)
 * 
 * @param {Object} props
 * @param {string} props.title - Main heading text for the section
 * @param {string} props.subtitle - Subheading text for the section
 */
const BentoGrid = ({ title, subtitle }) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { categories, categoriesLoading } = useSelector((state) => state.products);
    const safeCategories = Array.isArray(categories) ? categories : [];

    useEffect(() => {
        dispatch(fetchCategories());
    }, [dispatch]);

    /**
     * Category gradient configurations
     * Each category has a unique gradient background inspired by the reference images
     */
    const categoryGradients = {
        clothes: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)", // Grey-purple gradient
        electronics: "linear-gradient(135deg, #e0e0e0 0%, #a8a8a8 100%)", // Light grey gradient
        furniture: "linear-gradient(135deg, #f5e6d3 0%, #d4a574 100%)", // Beige gradient
        shoes: "linear-gradient(135deg, #ff6b35 0%, #d84315 100%)", // Dark orange gradient
        miscellaneous: "linear-gradient(135deg, #ffd54f 0%, #ffb300 100%)", // Honey yellow gradient
    };

    /**
     * Grid position classes for asymmetric Bento layout
     * 
     * Desktop Layout:
     * [Vertical Long 1] [Medium 2]
     * [Vertical Long 1] [Medium 3]
     * [Large 4        ] [Horizontal Long 5]
     * 
     * Mobile Layout: Stacked vertically
     */
    const gridPositions = [
        // Card 1 - Vertical Long (spans 2 rows on desktop)
        "col-span-1 row-span-1 lg:row-span-2",
        // Card 2 - Medium (top right)
        "col-span-1 row-span-1",
        // Card 3 - Medium (middle right)
        "col-span-1 row-span-1",
        // Card 4 - Large (bottom left)
        "col-span-1 row-span-1",
        // Card 5 - Horizontal Long (bottom right)
        "col-span-1 row-span-1",
    ];

    /**
     * Handle category card click
     * Sets the category filter in Redux store and navigates to collection page
     * 
     * @param {string} categorySlug - The category slug to filter by (e.g., 'electronics')
     */
    const handleCategoryClick = (categorySlug) => {
        // Set single category filter (replaces any existing category filters)
        dispatch(setFilters({ category: [categorySlug] }));
        // Navigate to collection page where filtered products will be displayed
        navigate("/collection");
    };

    // Loading state
    if (categoriesLoading) {
        return (
            <div className="w-full py-16 px-4">
                <div className="max-w-7xl mx-auto flex flex-col items-center">
                    <div className="text-center text-gray-400 text-lg">Loading categories...</div>
                </div>
            </div>
        );
    }

    return (
        <section className="w-full bg-[#0a0a0a] py-16 px-4">
            <div className="max-w-7xl mx-auto">
                {/* Header Section */}
                <div className="flex flex-col items-center mb-12">
                    <h2 className="text-4xl md:text-6xl font-bold text-center mb-4">
                        <span className="bg-gradient-to-r from-[#ebebeb] to-[#9379fc] bg-clip-text text-transparent">
                            {title}
                        </span>
                    </h2>
                    <p className="text-lg md:text-xl text-gray-400 text-center max-w-2xl">
                        {subtitle}
                    </p>
                </div>

                {/* Bento Grid Layout */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6 auto-rows-[280px] md:auto-rows-[320px]">
                    {safeCategories.map((category, index) => {
                        const gradient = categoryGradients[category.slug] || categoryGradients.miscellaneous;
                        const positionClass = gridPositions[index] || "col-span-1 row-span-1";

                        return (
                            <div
                                key={category.id}
                                className={`${positionClass} group relative overflow-hidden rounded-3xl cursor-pointer transition-all duration-500 hover:scale-[1.02] hover:shadow-2xl hover:shadow-violet-500/20`}
                                onClick={() => handleCategoryClick(category.slug)}
                                style={{
                                    background: gradient,
                                }}
                            >
                                {/* Gradient Overlay for depth and readability */}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent z-10 transition-opacity duration-500 group-hover:opacity-90" />

                                {/* Category Image - EAGER loading for scroll restoration accuracy */}
                                <div className="absolute inset-0 z-0">
                                    <img
                                        src={category.image}
                                        alt={category.name}
                                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                        draggable="false"
                                        loading="eager"
                                        fetchPriority="high"
                                    />
                                </div>

                                {/* Content Overlay */}
                                <div className="relative z-20 h-full flex flex-col justify-end p-6 md:p-8">
                                    {/* Subtitle (e.g., "Fashion & Apparel") */}
                                    <p className="text-xs md:text-sm text-white/90 font-semibold mb-2 tracking-widest uppercase transition-all duration-300 group-hover:text-white group-hover:tracking-[0.2em]">
                                        {category.subtitle}
                                    </p>

                                    {/* Category Name (Large) */}
                                    <h3 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4 md:mb-6 tracking-tight transition-all duration-300 group-hover:translate-x-2">
                                        {category.name.toUpperCase()}
                                    </h3>

                                    {/* Shop Now Button with Arrow */}
                                    <button className="flex items-center gap-2 text-white font-bold text-sm md:text-base transition-all duration-300 group-hover:gap-4 w-fit">
                                        <span className="tracking-wide">SHOP NOW</span>
                                        <ArrowRight
                                            className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-2"
                                            strokeWidth={2.5}
                                        />
                                    </button>
                                </div>

                                {/* Animated Border Effect on Hover */}
                                <div className="absolute inset-0 rounded-3xl border-2 border-transparent group-hover:border-white/40 transition-all duration-500 z-30 pointer-events-none" />

                                {/* Shine Effect on Hover */}
                                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 z-5 pointer-events-none overflow-hidden">
                                    <div className="absolute top-0 -left-full h-full w-1/2 bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12 group-hover:left-[200%] transition-all duration-1000" />
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
};

export default BentoGrid;