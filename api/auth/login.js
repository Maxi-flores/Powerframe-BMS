import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "powerframe-dev-secret-change-in-production";

// In-memory user store (replace with database in production)
const users = [
  {
    id: 1,
    username: "admin",
    email: "admin@powerframe.io",
    password: bcrypt.hashSync("admin123", 10),
  },
];

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: "Username and password required" });
  }

  const user = users.find(
    (u) => u.username === username || u.email === username
  );

  if (!user) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  const validPassword = await bcrypt.compare(password, user.password);
  if (!validPassword) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  const token = jwt.sign(
    { id: user.id, username: user.username },
    JWT_SECRET,
    { expiresIn: "24h" }
  );

  res.status(200).json({
    token,
    user: { id: user.id, username: user.username, email: user.email },
  });
}
