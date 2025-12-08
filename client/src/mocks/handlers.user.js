/**
 * MSW Handlers for User Profile Management API
 * 
 * Handles user profile updates, password changes, address management,
 * and account deletion. Persists data to localStorage via DB utility.
 */

import { http, HttpResponse } from 'msw';
import DB from './db';

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
 * Validate email format
 */
const validateEmail = (email) => {
  if (typeof email !== 'string') return false;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email.trim());
};

/**
 * Validate phone number (10 digits)
 */
const validatePhone = (phone) => {
  if (!phone) return true; // Phone is optional
  if (typeof phone !== 'string') return false;
  const digitsOnly = phone.replace(/\D/g, '');
  return digitsOnly.length === 10;
};

/**
 * Validate password strength
 */
const validatePassword = (password) => {
  if (typeof password !== 'string' || password.length < 8) return false;
  // Must contain uppercase, lowercase, and number
  const hasUppercase = /[A-Z]/.test(password);
  const hasLowercase = /[a-z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  return hasUppercase && hasLowercase && hasNumber;
};

export const userHandlers = [
  /**
   * PATCH /api/users/profile - Update user profile
   */
  http.patch('/api/users/profile', async ({ request }) => {
    try {
      const userId = extractUserIdFromToken(request);
      if (!userId) {
        return HttpResponse.json(
          { error: 'Unauthorized. Please log in to update your profile.' },
          { status: 401 }
        );
      }

      const profileData = await request.json();
      const db = DB.read();

      // Find user
      const userIndex = db.users.findIndex((u) => u.id === userId);
      if (userIndex === -1) {
        return HttpResponse.json(
          { error: 'User not found' },
          { status: 404 }
        );
      }

      // Validate email if provided
      if (profileData.email && !validateEmail(profileData.email)) {
        return HttpResponse.json(
          { error: 'Invalid email format' },
          { status: 400 }
        );
      }

      // Validate phone if provided
      if (profileData.phone && !validatePhone(profileData.phone)) {
        return HttpResponse.json(
          { error: 'Phone number must be 10 digits' },
          { status: 400 }
        );
      }

      // Validate name length
      if (profileData.name) {
        const trimmedName = profileData.name.trim();
        if (trimmedName.length < 2 || trimmedName.length > 100) {
          return HttpResponse.json(
            { error: 'Name must be between 2 and 100 characters' },
            { status: 400 }
          );
        }
      }

      // Validate profile picture size (max 2MB when base64 encoded)
      if (profileData.profilePicture) {
        const base64Length = profileData.profilePicture.length;
        const sizeInBytes = (base64Length * 3) / 4;
        if (sizeInBytes > 2 * 1024 * 1024) {
          return HttpResponse.json(
            { error: 'Profile picture must be less than 2MB' },
            { status: 400 }
          );
        }
      }

      // Update user profile
      const updatedUser = {
        ...db.users[userIndex],
        name: profileData.name ?? db.users[userIndex].name,
        email: profileData.email ?? db.users[userIndex].email,
        phone: profileData.phone ?? db.users[userIndex].phone,
        profilePicture: profileData.profilePicture ?? db.users[userIndex].profilePicture,
      };

      db.users[userIndex] = updatedUser;
      DB.write(db);

      // Return updated user (without password)
      const { password, ...userWithoutPassword } = updatedUser;

      return HttpResponse.json({
        success: true,
        message: 'Profile updated successfully',
        user: userWithoutPassword,
      });
    } catch (error) {
      return HttpResponse.json(
        { error: 'Internal server error. Failed to update profile.' },
        { status: 500 }
      );
    }
  }),

  /**
   * POST /api/users/change-password - Change user password
   */
  http.post('/api/users/change-password', async ({ request }) => {
    try {
      const userId = extractUserIdFromToken(request);
      if (!userId) {
        return HttpResponse.json(
          { error: 'Unauthorized. Please log in to change your password.' },
          { status: 401 }
        );
      }

      const { currentPassword, newPassword } = await request.json();
      const db = DB.read();

      // Find user
      const user = db.users.find((u) => u.id === userId);
      if (!user) {
        return HttpResponse.json(
          { error: 'User not found' },
          { status: 404 }
        );
      }

      // Validate current password
      if (user.password !== currentPassword) {
        return HttpResponse.json(
          { error: 'Current password is incorrect' },
          { status: 400 }
        );
      }

      // Validate new password strength
      if (!validatePassword(newPassword)) {
        return HttpResponse.json(
          { error: 'Password must be at least 8 characters and contain uppercase, lowercase, and number' },
          { status: 400 }
        );
      }

      // Update password
      const userIndex = db.users.findIndex((u) => u.id === userId);
      db.users[userIndex].password = newPassword;
      DB.write(db);

      return HttpResponse.json({
        success: true,
        message: 'Password changed successfully',
      });
    } catch (error) {
      return HttpResponse.json(
        { error: 'Internal server error. Failed to change password.' },
        { status: 500 }
      );
    }
  }),

  /**
   * GET /api/users/addresses - Get all user addresses
   */
  http.get('/api/users/addresses', async ({ request }) => {
    try {
      const userId = extractUserIdFromToken(request);
      if (!userId) {
        return HttpResponse.json(
          { error: 'Unauthorized. Please log in to view addresses.' },
          { status: 401 }
        );
      }

      const db = DB.read();
      const user = db.users.find((u) => u.id === userId);

      if (!user) {
        return HttpResponse.json(
          { error: 'User not found' },
          { status: 404 }
        );
      }

      return HttpResponse.json({
        addresses: user.addresses ?? [],
      });
    } catch (error) {
      return HttpResponse.json(
        { error: 'Internal server error. Failed to fetch addresses.' },
        { status: 500 }
      );
    }
  }),

  /**
   * POST /api/users/addresses - Add new address
   */
  http.post('/api/users/addresses', async ({ request }) => {
    try {
      const userId = extractUserIdFromToken(request);
      if (!userId) {
        return HttpResponse.json(
          { error: 'Unauthorized. Please log in to add an address.' },
          { status: 401 }
        );
      }

      const addressData = await request.json();
      const db = DB.read();

      const userIndex = db.users.findIndex((u) => u.id === userId);
      if (userIndex === -1) {
        return HttpResponse.json(
          { error: 'User not found' },
          { status: 404 }
        );
      }

      // Generate address ID
      const addressId = `addr_${Date.now()}`;

      // Create new address
      const newAddress = {
        id: addressId,
        ...addressData,
        isDefault: db.users[userIndex].addresses?.length === 0 ? true : (addressData.isDefault ?? false),
      };

      // If this is set as default, unset other defaults
      if (newAddress.isDefault && db.users[userIndex].addresses) {
        db.users[userIndex].addresses = db.users[userIndex].addresses.map((addr) => ({
          ...addr,
          isDefault: false,
        }));
      }

      // Add address to user
      if (!db.users[userIndex].addresses) {
        db.users[userIndex].addresses = [];
      }
      db.users[userIndex].addresses.push(newAddress);

      DB.write(db);

      return HttpResponse.json({
        success: true,
        message: 'Address added successfully',
        address: newAddress,
      }, { status: 201 });
    } catch (error) {
      return HttpResponse.json(
        { error: 'Internal server error. Failed to add address.' },
        { status: 500 }
      );
    }
  }),

  /**
   * PATCH /api/users/addresses/:addressId - Update address
   */
  http.patch('/api/users/addresses/:addressId', async ({ request, params }) => {
    try {
      const userId = extractUserIdFromToken(request);
      if (!userId) {
        return HttpResponse.json(
          { error: 'Unauthorized. Please log in to update address.' },
          { status: 401 }
        );
      }

      const { addressId } = params;
      const addressData = await request.json();
      const db = DB.read();

      const userIndex = db.users.findIndex((u) => u.id === userId);
      if (userIndex === -1) {
        return HttpResponse.json(
          { error: 'User not found' },
          { status: 404 }
        );
      }

      const addressIndex = db.users[userIndex].addresses?.findIndex((a) => a.id === addressId);
      if (addressIndex === -1 || addressIndex === undefined) {
        return HttpResponse.json(
          { error: 'Address not found' },
          { status: 404 }
        );
      }

      // Update address
      db.users[userIndex].addresses[addressIndex] = {
        ...db.users[userIndex].addresses[addressIndex],
        ...addressData,
        id: addressId, // Preserve ID
      };

      DB.write(db);

      return HttpResponse.json({
        success: true,
        message: 'Address updated successfully',
        address: db.users[userIndex].addresses[addressIndex],
      });
    } catch (error) {
      return HttpResponse.json(
        { error: 'Internal server error. Failed to update address.' },
        { status: 500 }
      );
    }
  }),

  /**
   * DELETE /api/users/addresses/:addressId - Delete address
   */
  http.delete('/api/users/addresses/:addressId', async ({ request, params }) => {
    try {
      const userId = extractUserIdFromToken(request);
      if (!userId) {
        return HttpResponse.json(
          { error: 'Unauthorized. Please log in to delete address.' },
          { status: 401 }
        );
      }

      const { addressId } = params;
      const db = DB.read();

      const userIndex = db.users.findIndex((u) => u.id === userId);
      if (userIndex === -1) {
        return HttpResponse.json(
          { error: 'User not found' },
          { status: 404 }
        );
      }

      const addressIndex = db.users[userIndex].addresses?.findIndex((a) => a.id === addressId);
      if (addressIndex === -1 || addressIndex === undefined) {
        return HttpResponse.json(
          { error: 'Address not found' },
          { status: 404 }
        );
      }

      // Remove address
      db.users[userIndex].addresses.splice(addressIndex, 1);
      DB.write(db);

      return HttpResponse.json({
        success: true,
        message: 'Address deleted successfully',
      });
    } catch (error) {
      return HttpResponse.json(
        { error: 'Internal server error. Failed to delete address.' },
        { status: 500 }
      );
    }
  }),

  /**
   * POST /api/users/addresses/:addressId/set-default - Set default address
   */
  http.post('/api/users/addresses/:addressId/set-default', async ({ request, params }) => {
    try {
      const userId = extractUserIdFromToken(request);
      if (!userId) {
        return HttpResponse.json(
          { error: 'Unauthorized. Please log in to set default address.' },
          { status: 401 }
        );
      }

      const { addressId } = params;
      const db = DB.read();

      const userIndex = db.users.findIndex((u) => u.id === userId);
      if (userIndex === -1) {
        return HttpResponse.json(
          { error: 'User not found' },
          { status: 404 }
        );
      }

      const addressIndex = db.users[userIndex].addresses?.findIndex((a) => a.id === addressId);
      if (addressIndex === -1 || addressIndex === undefined) {
        return HttpResponse.json(
          { error: 'Address not found' },
          { status: 404 }
        );
      }

      // Unset all defaults, then set the selected one
      db.users[userIndex].addresses = db.users[userIndex].addresses.map((addr, idx) => ({
        ...addr,
        isDefault: idx === addressIndex,
      }));

      DB.write(db);

      return HttpResponse.json({
        success: true,
        message: 'Default address updated successfully',
      });
    } catch (error) {
      return HttpResponse.json(
        { error: 'Internal server error. Failed to set default address.' },
        { status: 500 }
      );
    }
  }),

  /**
   * DELETE /api/users/account - Delete user account
   */
  http.delete('/api/users/account', async ({ request }) => {
    try {
      const userId = extractUserIdFromToken(request);
      if (!userId) {
        return HttpResponse.json(
          { error: 'Unauthorized. Please log in to delete your account.' },
          { status: 401 }
        );
      }

      const db = DB.read();

      const userIndex = db.users.findIndex((u) => u.id === userId);
      if (userIndex === -1) {
        return HttpResponse.json(
          { error: 'User not found' },
          { status: 404 }
        );
      }

      // Remove user from database
      db.users.splice(userIndex, 1);
      DB.write(db);

      return HttpResponse.json({
        success: true,
        message: 'Account deleted successfully',
      });
    } catch (error) {
      return HttpResponse.json(
        { error: 'Internal server error. Failed to delete account.' },
        { status: 500 }
      );
    }
  }),
];
