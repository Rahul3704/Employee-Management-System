const express = require("express");
const path = require("path");
const cors = require("cors");
const session = require("express-session");

const authRoutes = require("./routes/authRoutes");
const employeeRoutes = require("./routes/employeeRoutes");
const statsRoutes = require("./routes/statsRoutes");
const exportRoutes = require("./routes/exportRoutes");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors({ origin: "http://localhost:3000", credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));

app.use(session({
  secret: "supersecretkey",
  resave: false,
  saveUninitialized: false,
  cookie: { maxAge: 60 * 60 * 1000 }
}));

// mount routes
app.use("/api", authRoutes);
app.use("/api/employees", employeeRoutes);
app.use("/api", statsRoutes);
app.use("/api", exportRoutes);

app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));
