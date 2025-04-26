const express = require("express");
const router = express.Router();
const Student = require("../models/Student");
const Course = require("../models/course");

// Fetch all students and populate the enrolled courses using $lookup
router.get("/", async (req, res) => {
  try {
    const students = await Student.find().populate("enrolledCourses");
    res.json(students);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Fetch a single student by ID
router.get("/:id", async (req, res) => {
  try {
    const student = await Student.findById(req.params.id).populate("enrolledCourses");
    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }
    res.json(student);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Create a new student
router.post("/", async (req, res) => {
  const { name, email, age, enrolledCourses } = req.body;

  // Create a new student instance
  const student = new Student({
    name,
    email,
    age,
    enrolledCourses: enrolledCourses.map(course => course.trim()) // Ensure course names are trimmed
  });

  try {
    const newStudent = await student.save();
    res.status(201).json(newStudent);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Update student details (name, email, age, enrolled courses)
router.put("/:id", async (req, res) => {
  const { name, email, age, enrolledCourses } = req.body;

  try {
    const student = await Student.findByIdAndUpdate(
      req.params.id,
      {
        name,
        email,
        age,
        enrolledCourses: enrolledCourses.map(course => course.trim())  // Ensure courses are trimmed
      },
      { new: true }  // This will return the updated student object
    );

    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    res.json(student);  // Send the updated student as response
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Delete a student
router.delete("/:id", async (req, res) => {
  try {
    const student = await Student.findByIdAndDelete(req.params.id);
    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }
    res.status(204).send();  // Send a success response with no content
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
