const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();
app.use(cors());
app.use(bodyParser.json());

const studentRoutes = require("./routes/students");
const courseRoutes = require("./routes/courses");

// MongoDB connection
mongoose.connect("mongodb://localhost:27017/student_management", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => console.log("MongoDB Connected"))
  .catch(err => console.log(err));

app.use("/api/students", studentRoutes);
app.use("/api/courses", courseRoutes);

app.listen(5000, () => {
  console.log("Server running on http://localhost:5000");
});
