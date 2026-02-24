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

export default function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "No token provided" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const user = users.find((u) => u.id === decoded.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ id: user.id, username: user.username, email: user.email });
  } catch (err) {
    res.status(401).json({ message: "Invalid token" });
  }
}
