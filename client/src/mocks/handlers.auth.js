import { http, HttpResponse } from "msw";
import DB from "./db";

// const randomToken = () => "fake-jwt-" + Math.random().toString(36).slice(2, 10);

// Generate deterministic token based on user ID
const generateToken = (userId) => `fake-jwt-${userId}`;

// Migrate any orphaned carts to the new deterministic token
const migrateUserCart = (userId) => {
  try {
    const newToken = `fake-jwt-${userId}`;
    const newCartKey = `buyzzie_cart_${newToken}`;

    // Check if cart already exists for this user
    if (localStorage.getItem(newCartKey)) {
      return; // Cart already exists, no migration needed
    }

    // Search for any orphaned carts in localStorage
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key?.startsWith("buyzzie_cart_fake-jwt-") && key !== newCartKey) {
        // Found a potential orphaned cart
        const cartData = localStorage.getItem(key);
        if (cartData) {
          // Migrate this cart to the new deterministic key
          localStorage.setItem(newCartKey, cartData);
          console.log(`Migrated cart from ${key} to ${newCartKey}`);
          // Optionally remove old cart key
          // localStorage.removeItem(key);
          break; // Only migrate the first found cart
        }
      }
    }
  } catch (error) {
    console.error("Error migrating cart:", error);
  }
};

export const authHandlers = [
  http.post("/auth/signup", async ({ request }) => {
    const { name, email, password } = await request.json();

    const db = DB.read();
    const exists = db.users.find(
      (u) => u.email.toLowerCase() === email.toLowerCase()
    );
    if (exists) {
      return HttpResponse.json(
        { error: "Email already exists" },
        { status: 409 }
      );
    }

    const newUser = {
      id: "u_" + Date.now(),
      name,
      email,
      password,
      role: "user",
      phone: "",
      profilePicture: null,
      addresses: [],
      createdAt: new Date().toISOString(),
    };
    db.users.push(newUser);
    DB.write(db);

    // const token = randomToken();
    const token = generateToken(newUser.id);
    return HttpResponse.json(
      {
        token,
        user: {
          id: newUser.id,
          name,
          email,
          role: newUser.role,
          phone: newUser.phone,
          profilePicture: newUser.profilePicture,
          createdAt: newUser.createdAt,
        },
      },
      { status: 201 }
    );
  }),

  http.post("/auth/login", async ({ request }) => {
    const { email, password } = await request.json();

    const db = DB.read();
    const user = db.users.find(
      (u) => u.email.toLowerCase() === email.toLowerCase()
    );

    if (!user || user.password !== password) {
      return HttpResponse.json(
        { error: "Invalid credentials" },
        { status: 401 }
      );
    }

    // const token = randomToken();
    const token = generateToken(user.id);
    // Migrate any existing cart to the new token format
    migrateUserCart(user.id);
    
    return HttpResponse.json(
      {
        token,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          phone: user.phone ?? "",
          profilePicture: user.profilePicture ?? null,
          createdAt: user.createdAt ?? new Date().toISOString(),
        },
      },
      { status: 200 }
    );
  }),
];
