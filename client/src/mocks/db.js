export const DB_KEY = "buyzzie_mock_db_v1";
const seed = {
  users: [
    {
      id: "u_admin",
      name: "Admin",
      email: "admin@buyzzie.test",
      password: "admin123",
      role: "admin",
      phone: "",
      profilePicture: null,
      addresses: [],
      createdAt: "2024-01-15T10:30:00.000Z",
    },
  ],
  products: [],
  orders: [],
};
function read() {
  const raw = localStorage.getItem(DB_KEY);
  return raw ? JSON.parse(raw) : JSON.parse(JSON.stringify(seed));
}
function write(db) {
  localStorage.setItem(DB_KEY, JSON.stringify(db));
}
export default { read, write };
