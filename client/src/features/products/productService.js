import api from "../../services/axios";

export const productService = {
  // Get products with pagination, filtering, and sorting
  getProducts: async (params = {}) => {
    const {
      page = 1,
      limit = 12,
      sortBy = "createdAt",
      sortOrder = "desc",
      q = "",
      category = [],
      minPrice = null,
      maxPrice = null,
    } = params;

    const queryParams = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      sortBy,
      sortOrder,
    });

    if (q) queryParams.append("q", q);
    if (category.length > 0) queryParams.append("category", category.join(","));
    if (minPrice) queryParams.append("minPrice", minPrice.toString());
    if (maxPrice) queryParams.append("maxPrice", maxPrice.toString());

    console.log("API Request - URL:", `/products?${queryParams.toString()}`);
    console.log("API Request - Params:", params);

    const response = await api.get(`/products?${queryParams.toString()}`);
    console.log("API Response:", response.data);
    return response.data;
  },

  // Get single product by ID
  getProduct: async (id) => {
    const response = await api.get(`/products/${id}`);
    return response.data;
  },

  // Get categories
  getCategories: async () => {
    const response = await api.get("/categories");
    return response.data;
  },
};
