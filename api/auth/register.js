import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "powerframe-dev-secret-change-in-production";

// In-memory user store (replace with database in production)
// Note: This won't persist between serverless function invocations
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

  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    return res.status(400).json({ message: "All fields required" });
  }

  const exists = users.find((u) => u.username === username || u.email === email);
  if (exists) {
    return res.status(409).json({ message: "User already exists" });
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = {
    id: users.length + 1,
    username,
    email,
    password: hashedPassword,
  };

  users.push(newUser);

  const token = jwt.sign(
    { id: newUser.id, username: newUser.username },
    JWT_SECRET,
    { expiresIn: "24h" }
  );

  res.status(201).json({
    token,
    user: { id: newUser.id, username: newUser.username, email: newUser.email },
  });
}
