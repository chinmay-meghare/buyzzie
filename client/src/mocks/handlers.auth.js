import { http, HttpResponse } from "msw";
import DB from "./db";

const randomToken = () => "fake-jwt-" + Math.random().toString(36).slice(2, 10);

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
    };
    db.users.push(newUser);
    DB.write(db);

    const token = randomToken();
    return HttpResponse.json(
      {
        token,
        user: {
          id: newUser.id,
          name,
          email,
          role: newUser.role,
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

    const token = randomToken();
    return HttpResponse.json(
      {
        token,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
      },
      { status: 200 }
    );
  }),
];
