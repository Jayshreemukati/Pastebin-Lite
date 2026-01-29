const express = require("express");
const path = require("path");

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// routes
app.use("/api/healthz", require("./routes/health"));
app.use("/api", require("./routes/pastes"));

// html views
app.use(express.static("views"));

app.get("/p/:id", (req, res) => {
  res.sendFile(path.join(__dirname, "views", "view.html"));
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log("Server running on port", PORT);
});
