import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const router = express.Router();

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

// POST /api/auth/login
router.post("/login", async (req, res) => {
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

  res.json({
    token,
    user: { id: user.id, username: user.username, email: user.email },
  });
});

// POST /api/auth/register
router.post("/register", async (req, res) => {
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
});

// GET /api/auth/me (protected)
router.get("/me", (req, res) => {
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

    res.json({ id: user.id, username: user.username, email: user.email });
  } catch (err) {
    res.status(401).json({ message: "Invalid token" });
  }
});

export default router;
