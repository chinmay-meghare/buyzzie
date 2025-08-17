import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { setPage, fetchProducts } from "../../products/productSlice";

const Pagination = () => {
  const dispatch = useDispatch();
  const { meta, filters } = useSelector((state) => state.products);

  // Ensure meta and filters are defined
  const safeMeta = meta || {
    page: 1,
    totalPages: 0,
    total: 0,
    hasNext: false,
    hasPrev: false,
  };
  
  const safeFilters = filters || {};

  const handlePageChange = (newPage) => {
    dispatch(setPage(newPage));
    dispatch(fetchProducts({ ...safeFilters, page: newPage }));
  };

  const renderPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;
    const startPage = Math.max(1, safeMeta.page - Math.floor(maxVisiblePages / 2));
    const endPage = Math.min(safeMeta.totalPages, startPage + maxVisiblePages - 1);

    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <button
          key={i}
          onClick={() => handlePageChange(i)}
          className={`px-3 py-2 mx-1 rounded-md ${
            safeMeta.page === i
              ? "bg-blue-600 text-white"
              : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
          }`}
        >
          {i}
        </button>
      );
    }

    return pages;
  };

  if (safeMeta.totalPages <= 1) {
    return null;
  }

  return (
    <div className="flex justify-center items-center space-x-2 mt-8">
      {/* Previous Button */}
      <button
        onClick={() => handlePageChange(safeMeta.page - 1)}
        disabled={!safeMeta.hasPrev}
        className={`px-3 py-2 rounded-md ${
          safeMeta.hasPrev
            ? "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
            : "bg-gray-100 text-gray-400 cursor-not-allowed"
        }`}
      >
        Previous
      </button>

      {/* Page Numbers */}
      {renderPageNumbers()}

      {/* Next Button */}
      <button
        onClick={() => handlePageChange(safeMeta.page + 1)}
        disabled={!safeMeta.hasNext}
        className={`px-3 py-2 rounded-md ${
          safeMeta.hasNext
            ? "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
            : "bg-gray-100 text-gray-400 cursor-not-allowed"
        }`}
      >
        Next
      </button>

      {/* Page Info */}
      <div className="ml-4 text-sm text-gray-600">
        Page {safeMeta.page} of {safeMeta.totalPages} ({safeMeta.total} total items)
      </div>
    </div>
  );
};

export default Pagination;
