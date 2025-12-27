import React from "react";
import BentoGrid from "./BentoGrid";

/**
 * CategoryPreview Component
 * Wrapper component for the BentoGrid that accepts dynamic title and subtitle
 * This allows the same component to be used on different pages with different headings
 * 
 * @param {Object} props
 * @param {string} props.title - Main heading for the section
 * @param {string} props.subtitle - Subheading for the section
 */
const CategoryPreview = ({ title, subtitle }) => {
  return <BentoGrid title={title} subtitle={subtitle} />;
};

export default CategoryPreview;
