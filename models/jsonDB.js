const fs = require("fs");

const readJSON = (file) => fs.existsSync(file)
  ? JSON.parse(fs.readFileSync(file, "utf8") || "[]")
  : [];

const writeJSON = (file, data) => fs.writeFileSync(file, JSON.stringify(data, null, 2));

module.exports = { readJSON, writeJSON };
