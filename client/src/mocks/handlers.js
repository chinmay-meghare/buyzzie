import { http, HttpResponse } from "msw";
import { productsData } from "./data/products";
import { authHandlers } from "./handlers.auth";
import { orderHandlers } from "./handlers.orders";
import { userHandlers } from "./handlers.user";
import { adminHandlers } from "./handlers.admin";

// Helper function to filter products
const filterProducts = (products, filters) => {
  let filtered = [...products];

  // Search by title/description
  if (filters.q) {
    const searchTerm = filters.q.toLowerCase();
    filtered = filtered.filter(
      (product) =>
        product.title.toLowerCase().includes(searchTerm) ||
        product.description.toLowerCase().includes(searchTerm)
    );
  }

  // Filter by category (multi-select)
  if (filters.category && filters.category.length > 0) {
    filtered = filtered.filter((product) =>
      filters.category.includes(product.category.slug)
    );
  }

  // Filter by price range
  if (filters.minPrice) {
    filtered = filtered.filter(
      (product) => product.price >= Number(filters.minPrice)
    );
  }
  if (filters.maxPrice) {
    filtered = filtered.filter(
      (product) => product.price <= Number(filters.maxPrice)
    );
  }

  return filtered;
};

// Helper function to sort products
const sortProducts = (products, sortBy, sortOrder) => {
  const sorted = [...products];

  switch (sortBy) {
    case "title":
      sorted.sort((a, b) => {
        const comparison = a.title.localeCompare(b.title);
        return sortOrder === "desc" ? -comparison : comparison;
      });
      break;
    case "price":
      sorted.sort((a, b) => {
        const comparison = a.price - b.price;
        return sortOrder === "desc" ? -comparison : comparison;
      });
      break;
    case "rating":
      sorted.sort((a, b) => {
        const comparison = a.rating - b.rating;
        return sortOrder === "desc" ? -comparison : comparison;
      });
      break;
    case "createdAt":
      sorted.sort((a, b) => {
        const comparison = new Date(a.createdAt) - new Date(b.createdAt);
        return sortOrder === "desc" ? -comparison : comparison;
      });
      break;
    default:
      // Default sort by newest
      sorted.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }

  return sorted;
};

// Helper function to paginate products
const paginateProducts = (products, page, limit) => {
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;
  return products.slice(startIndex, endIndex);
};

export const handlers = [
  // GET /products - Get products with pagination, filtering, and sorting
  http.get("/products", ({ request }) => {
    const url = new URL(request.url);

    // Parse query parameters
    const page = parseInt(url.searchParams.get("page")) || 1;
    const limit = parseInt(url.searchParams.get("limit")) || 10;
    const sortBy = url.searchParams.get("sortBy") || "createdAt";
    const sortOrder = url.searchParams.get("sortOrder") || "desc";
    const q = url.searchParams.get("q") || "";
    const category = url.searchParams.get("category")
      ? url.searchParams.get("category").split(",")
      : [];
    const minPrice = url.searchParams.get("minPrice") || null;
    const maxPrice = url.searchParams.get("maxPrice") || null;

    // Apply filters
    const filters = { q, category, minPrice, maxPrice };
    let filteredProducts = filterProducts(productsData, filters);

    // Apply sorting
    filteredProducts = sortProducts(filteredProducts, sortBy, sortOrder);

    // Calculate pagination metadata
    const total = filteredProducts.length;
    const totalPages = Math.ceil(total / limit);
    const hasNext = page < totalPages;
    const hasPrev = page > 1;

    // Apply pagination
    const paginatedProducts = paginateProducts(filteredProducts, page, limit);

    return HttpResponse.json({
      data: paginatedProducts,
      meta: {
        total,
        page,
        limit,
        totalPages,
        hasNext,
        hasPrev,
      },
    });
  }),

  // GET /products/:id - Get single product
  http.get("/products/:id", ({ params }) => {
    const productId = parseInt(params.id, 10);

    const product = productsData.find((p) => p.id === productId);
    console.log("MSW returning product:", product);

    if (!product) {
      return new HttpResponse("Product not found", { status: 404 });
    }

    return HttpResponse.json(product);
  }),

  // GET /categories - Get all categories
  http.get("/categories", () => {
    const categories = [
      {
        id: 1,
        name: "Clothes",
        slug: "clothes",
        image: "https://i.imgur.com/QkIa5tT.jpeg",
      },
      {
        id: 2,
        name: "Electronics",
        slug: "electronics",
        image: "https://i.imgur.com/ZANVnHE.jpeg",
      },
      {
        id: 3,
        name: "Furniture",
        slug: "furniture",
        image: "https://i.imgur.com/Qphac99.jpeg",
      },
      {
        id: 4,
        name: "Shoes",
        slug: "shoes",
        image: "https://i.imgur.com/qNOjJje.jpeg",
      },
      {
        id: 5,
        name: "Miscellaneous",
        slug: "miscellaneous",
        image: "https://i.imgur.com/BG8J0Fj.jpg",
      },
    ];

    return HttpResponse.json(categories);
  }),
  ...authHandlers,
  ...orderHandlers,
  ...userHandlers,
  ...adminHandlers,
];