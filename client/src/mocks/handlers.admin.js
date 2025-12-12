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
];
