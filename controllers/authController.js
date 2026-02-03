const bcrypt = require("bcrypt");
const path = require("path");
const { readJSON } = require("../models/jsonDB");

const ADMIN_FILE = path.join(__dirname, "..", "db", "admins.json");

exports.login = async (req, res) => {
  const { username, password } = req.body;
  const admins = readJSON(ADMIN_FILE);
  const admin = admins.find(a => a.username === username);
  if (!admin) return res.status(401).json({ error: "Invalid credentials" });

  const valid = await bcrypt.compare(password, admin.passwordHash);
  if (!valid) return res.status(401).json({ error: "Invalid credentials" });

  req.session.user = { id: admin.id, username: admin.username };
  res.json({ message: "Login success", user: req.session.user });
};

exports.logout = (req, res) => {
  req.session.destroy(() => res.json({ message: "Logged out" }));
};

exports.me = (req, res) => {
  if (req.session && req.session.user) return res.json(req.session.user);
  return res.status(401).json({ error: "Not logged in" });
};
