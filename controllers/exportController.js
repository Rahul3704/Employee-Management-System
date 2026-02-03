const path = require("path");
const { readJSON } = require("../models/jsonDB");
const { createObjectCsvWriter } = require("csv-writer");

const EMP_FILE = path.join(__dirname, "..", "db", "employees.json");

exports.exportCSV = async (req, res) => {
  const data = readJSON(EMP_FILE);
  const filePath = path.join(__dirname, "..", "employees_export.csv");

  const csvWriter = createObjectCsvWriter({
    path: filePath,
    header: [
      { id: "id", title: "ID" },
      { id: "name", title: "Name" },
      { id: "department", title: "Department" },
      { id: "designation", title: "Designation" },
      { id: "salary", title: "Salary" },
      { id: "joining_date", title: "JoiningDate" },
      { id: "email", title: "Email" }
    ]
  });

  await csvWriter.writeRecords(data);
  res.download(filePath);
};
