/**
 * MSW Handlers for Order Management API
 * 
 * Handles order creation, retrieval, and validation.
 * Persists orders to localStorage via DB utility.
 */

import { http, HttpResponse } from 'msw';
import DB from './db';

/**
 * Calculate estimated delivery date (7 days from now)
 */
const calculateDeliveryDate = () => {
  const deliveryDate = new Date();
  deliveryDate.setDate(deliveryDate.getDate() + 7);
  return deliveryDate.toISOString();
};

/**
 * Extract user ID from Authorization token
 * Token format: "Bearer fake-jwt-u_1234567890"
 */
const extractUserIdFromToken = (request) => {
  try {
    const authHeader = request.headers.get('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return null;
    }
    
    const token = authHeader.replace('Bearer ', '');
    if (!token.startsWith('fake-jwt-')) {
      return null;
    }
    
    const userId = token.replace('fake-jwt-', '');
    return userId || null;
  } catch (error) {
    return null;
  }
};

/**
 * Validate order data before creation
 */
const validateOrderData = (orderData) => {
  const errors = [];
  
  // Validate items array
  if (!Array.isArray(orderData.items) || orderData.items.length === 0) {
    errors.push('Items array is required and must not be empty');
  }
  
  // Validate shipping address
  const requiredShippingFields = ['fullName', 'email', 'phone', 'address', 'city', 'state', 'zipCode'];
  if (!orderData.shippingAddress) {
    errors.push('Shipping address is required');
  } else {
    requiredShippingFields.forEach((field) => {
      if (!orderData.shippingAddress[field]?.trim()) {
        errors.push(`Shipping address ${field} is required`);
      }
    });
  }
  
  // Validate payment method
  if (!orderData.paymentMethod || !orderData.paymentMethod.trim()) {
    errors.push('Payment method is required');
  }
  
  // Validate numeric fields
  const numericFields = ['subtotal', 'shipping', 'tax', 'total'];
  numericFields.forEach((field) => {
    const value = Number(orderData[field]);
    if (isNaN(value) || value < 0) {
      errors.push(`${field} must be a valid positive number`);
    }
  });
  
  return errors;
};

export const orderHandlers = [
  /**
   * POST /api/orders - Create a new order
   */
  http.post('/api/orders', async ({ request }) => {
    try {
      // Extract user ID from token
      const userId = extractUserIdFromToken(request);
      if (!userId) {
        return HttpResponse.json(
          { error: 'Unauthorized. Please log in to place an order.' },
          { status: 401 }
        );
      }
      
      // Parse request body
      const orderData = await request.json();
      
      // Validate order data
      const validationErrors = validateOrderData(orderData);
      if (validationErrors.length > 0) {
        return HttpResponse.json(
          { error: 'Validation failed', details: validationErrors },
          { status: 400 }
        );
      }
      
      // Read current database state
      const db = DB.read();
      
      // Generate unique order ID
      const orderId = `order_${Date.now()}`;
      
      // Create order object
      const newOrder = {
        id: orderId,
        userId: userId,
        items: orderData.items,
        shippingAddress: orderData.shippingAddress,
        paymentMethod: orderData.paymentMethod,
        subtotal: Number(orderData.subtotal) || 0,
        shipping: Number(orderData.shipping) || 0,
        tax: Number(orderData.tax) || 0,
        total: Number(orderData.total) || 0,
        status: 'Pending',
        createdAt: new Date().toISOString(),
        estimatedDelivery: calculateDeliveryDate(),
      };
      
      // Add order to database
      db.orders.push(newOrder);
      
      // Write back to localStorage
      DB.write(db);
      
      // Return success response
      return HttpResponse.json(
        {
          success: true,
          orderId: orderId,
          message: 'Order placed successfully',
          order: newOrder,
        },
        { status: 201 }
      );
    } catch (error) {
      return HttpResponse.json(
        { error: 'Internal server error. Failed to create order.' },
        { status: 500 }
      );
    }
  }),

  /**
   * GET /api/orders - Get all orders for the current user
   */
  http.get('/api/orders', async ({ request }) => {
    try {
      // Extract user ID from token
      const userId = extractUserIdFromToken(request);
      if (!userId) {
        return HttpResponse.json(
          { error: 'Unauthorized. Please log in to view orders.' },
          { status: 401 }
        );
      }
      
      // Read database
      const db = DB.read();
      
      // Filter orders by user ID
      const userOrders = db.orders
        .filter((order) => order.userId === userId)
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      
      return HttpResponse.json({
        orders: userOrders,
        count: userOrders.length,
      });
    } catch (error) {
      return HttpResponse.json(
        { error: 'Internal server error. Failed to fetch orders.' },
        { status: 500 }
      );
    }
  }),

  /**
   * GET /api/orders/:orderId - Get single order by ID
   */
  http.get('/api/orders/:orderId', async ({ request, params }) => {
    try {
      // Extract user ID from token
      const userId = extractUserIdFromToken(request);
      if (!userId) {
        return HttpResponse.json(
          { error: 'Unauthorized. Please log in to view order details.' },
          { status: 401 }
        );
      }
      
      const orderId = params.orderId;
      
      // Read database
      const db = DB.read();
      
      // Find order by ID
      const order = db.orders.find((o) => o.id === orderId);
      
      if (!order) {
        return HttpResponse.json(
          { error: 'Order not found' },
          { status: 404 }
        );
      }
      
      // Verify order belongs to user OR user is admin
      const user = db.users.find(u => u.id === userId);
      const isAdmin = user?.role === 'admin';

      if (order.userId !== userId && !isAdmin) {
        return HttpResponse.json(
          { error: 'Unauthorized. You do not have access to this order.' },
          { status: 403 }
        );
      }
      
      return HttpResponse.json({
        order: order,
      });
    } catch (error) {
      return HttpResponse.json(
        { error: 'Internal server error. Failed to fetch order.' },
        { status: 500 }
      );
    }
  }),
];