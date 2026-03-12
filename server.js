const express = require("express");
const cors = require("cors");
require("dotenv").config();

const schoolRoutes = require("./routes/schoolroutes.js");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.status(200).json({
    message: "School Management API is running",
  });
});

app.use("/", schoolRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});