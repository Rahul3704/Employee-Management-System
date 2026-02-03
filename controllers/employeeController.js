const path = require("path");
const { readJSON, writeJSON } = require("../models/jsonDB");

const EMP_FILE = path.join(__dirname, "..", "db", "employees.json");

exports.getAll = (req, res) => {
  const data = readJSON(EMP_FILE);
  res.json(data);
};

exports.getOne = (req, res) => {
  const data = readJSON(EMP_FILE);
  const emp = data.find(e => e.id === parseInt(req.params.id));
  if (!emp) return res.status(404).json({ error: "Not found" });
  res.json(emp);
};

exports.create = (req, res) => {
  const data = readJSON(EMP_FILE);
  const newEmp = {
    id: data.length ? Math.max(...data.map(e => e.id)) + 1 : 1,
    name: req.body.name || "",
    department: req.body.department || "",
    designation: req.body.designation || "",
    salary: parseFloat(req.body.salary) || 0,
    joining_date: req.body.joining_date || "",
    email: req.body.email || ""
  };
  data.push(newEmp);
  writeJSON(EMP_FILE, data);
  res.status(201).json(newEmp);
};

exports.update = (req, res) => {
  const data = readJSON(EMP_FILE);
  const idx = data.findIndex(e => e.id === parseInt(req.params.id));
  if (idx === -1) return res.status(404).json({ error: "Not found" });
  data[idx] = { ...data[idx], ...req.body, id: data[idx].id };
  writeJSON(EMP_FILE, data);
  res.json(data[idx]);
};

exports.remove = (req, res) => {
  const data = readJSON(EMP_FILE);
  const filtered = data.filter(e => e.id !== parseInt(req.params.id));
  if (filtered.length === data.length) return res.status(404).json({ error: "Not found" });
  writeJSON(EMP_FILE, filtered);
  res.json({ message: "Deleted" });
};
