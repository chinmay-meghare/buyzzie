/**
 * handlers.admin.js
 * 
 * MSW handlers for admin panel endpoints.
 * Provides mock API responses for dashboard stats, products, orders, and users.
 */

import { http, HttpResponse } from 'msw';
import db from './db';
import { productsData } from './data/products';

export const adminHandlers = [
  // GET /api/admin/stats - Dashboard statistics
  http.get('/api/admin/stats', () => {
    const mockDb = db.read();
    
    // Get all products (from productsData)
    const allProducts = productsData;
    
    // Get all orders
    const allOrders = mockDb.orders || [];
    
    // Calculate total revenue
    const totalRevenue = allOrders.reduce((sum, order) => sum + (order.total || 0), 0);
    
    // Get low stock products (stock < 10)
    const lowStockProducts = allProducts.filter(product => product.stock < 10);
    
    // Get recent 5 orders (sorted by date, newest first)
    const recentOrders = [...allOrders]
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, 5)
      .map(order => {
        // Find user for customer name
        const user = mockDb.users.find(u => u.id === order.userId);
        return {
          ...order,
          customerName: user?.name || 'Unknown Customer',
        };
      });
    
    return HttpResponse.json({
      totalProducts: allProducts.length,
      totalOrders: allOrders.length,
      totalRevenue,
      lowStockCount: lowStockProducts.length,
      lowStockProducts: lowStockProducts.slice(0, 5), // Show max 5
      recentOrders,
    });
  }),

  // GET /api/admin/products - Get all products
  http.get('/api/admin/products', () => {
    return HttpResponse.json(productsData);
  }),

  // GET /api/admin/products/:id - Get single product
  http.get('/api/admin/products/:id', ({ params }) => {
    const { id } = params;
    const product = productsData.find(p => p.id === Number(id));
    if (!product) return new HttpResponse(null, { status: 404 });
    return HttpResponse.json(product);
  }),

  // POST /api/admin/products - Create product
  http.post('/api/admin/products', async ({ request }) => {
    const newProduct = await request.json();
    newProduct.id = Math.max(...productsData.map(p => p.id)) + 1;
    newProduct.rating = 0; // Default
    
    // In a real app we would save to DB. 
    // For MSW, we can try to push to the array but it resets on reload unless we persist it.
    // For this session, we'll verify it works in memory.
    productsData.unshift(newProduct);
    
    return HttpResponse.json(newProduct, { status: 201 });
  }),

  // PUT /api/admin/products/:id - Update product
  http.put('/api/admin/products/:id', async ({ params, request }) => {
    const { id } = params;
    const updates = await request.json();
    const index = productsData.findIndex(p => p.id === Number(id));
    
    if (index === -1) return new HttpResponse(null, { status: 404 });
    
    productsData[index] = { ...productsData[index], ...updates };
    return HttpResponse.json(productsData[index]);
  }),

  // DELETE /api/admin/products/:id - Delete product
  http.delete('/api/admin/products/:id', ({ params }) => {
    const { id } = params;
    const index = productsData.findIndex(p => p.id === Number(id));
    
    if (index !== -1) {
      productsData.splice(index, 1);
    }
    
    return new HttpResponse(null, { status: 204 });
  }),

  // GET /api/admin/orders - Get all orders
  http.get('/api/admin/orders', () => {
    const mockDb = db.read();
    const orders = mockDb.orders || [];
    
    // Enrich orders with customer names
    const enrichedOrders = orders.map(order => {
      const user = mockDb.users.find(u => u.id === order.userId);
      return {
        ...order,
        customerName: user?.name || 'Unknown Customer',
        customerEmail: user?.email || 'N/A',
      };
    });
    
    // Sort by date desc
    enrichedOrders.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    
    return HttpResponse.json(enrichedOrders);
  }),

  // PUT /api/admin/orders/:id/status - Update order status
  http.put('/api/admin/orders/:id/status', async ({ params, request }) => {
    const { id } = params;
    const { status } = await request.json();
    const mockDb = db.read();
    
    const orderIndex = mockDb.orders.findIndex(o => o.id === id);
    if (orderIndex === -1) return new HttpResponse(null, { status: 404 });
    
    // Update status
    mockDb.orders[orderIndex].status = status;
    db.write(mockDb);
    
    return HttpResponse.json(mockDb.orders[orderIndex]);
  }),
];
