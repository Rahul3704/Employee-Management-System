const path = require("path");
const { readJSON } = require("../models/jsonDB");

const EMP_FILE = path.join(__dirname, "..", "db", "employees.json");

exports.getStats = (req, res) => {
  const data = readJSON(EMP_FILE);
  if (!data.length) return res.json({ total: 0 });

  const total = data.length;
  const salaries = data.map(e => e.salary || 0);
  const avgSalary = salaries.reduce((a, b) => a + b, 0) / total;
  const maxSalary = Math.max(...salaries);
  const minSalary = Math.min(...salaries);

  const deptCount = {};
  data.forEach(e => {
    const d = e.department || "Unknown";
    deptCount[d] = (deptCount[d] || 0) + 1;
  });

  res.json({ total, avgSalary, maxSalary, minSalary, departmentWise: deptCount });
};
