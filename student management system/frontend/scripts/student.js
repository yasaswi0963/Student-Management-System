document.getElementById("studentForm").addEventListener("submit", addOrUpdateStudent);
fetchStudents();  // Fetch and display students when the page loads

let editingStudentId = null;  // Variable to track the student being edited

// Fetch all students
function fetchStudents() {
  fetch('http://localhost:5000/api/students')
    .then(res => res.json())
    .then(data => {
      const studentsTable = document.querySelector("#studentsTable tbody");
      studentsTable.innerHTML = ""; // Clear the table

      data.forEach(student => {
        const row = document.createElement("tr");
        row.innerHTML = `
          <td>${student.name}</td>
          <td>${student.email}</td>
          <td>${student.age}</td>
          <td>${student.enrolledCourses.map(course => course.courseName).join(", ")}</td>
          <td>
            <button class="btn btn-warning" onclick="editStudent('${student._id}')">Edit</button>
            <button class="btn btn-danger" onclick="deleteStudent('${student._id}')">Delete</button>
          </td>
        `;
        studentsTable.appendChild(row);
      });
    })
    .catch(err => console.log("Error:", err));
}

// Add or update student (same form is used for both actions)
function addOrUpdateStudent(event) {
  event.preventDefault();

  const name = document.getElementById("name").value;
  const email = document.getElementById("email").value;
  const age = document.getElementById("age").value;
  const courses = document.getElementById("courses").value.split(",").map(course => course.trim());

  if (editingStudentId) {
    // We are editing an existing student (send PUT request)
    fetch(`http://localhost:5000/api/students/${editingStudentId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        name,
        email,
        age,
        enrolledCourses: courses
      })
    })
      .then(response => response.json())
      .then(() => {
        resetForm();  // Reset the form after successful update
        fetchStudents();  // Refresh the student list
        editingStudentId = null;  // Clear the editing flag
      })
      .catch(err => console.log("Error:", err));

  } else {
    // We are adding a new student (send POST request)
    fetch('http://localhost:5000/api/students', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        name,
        email,
        age,
        enrolledCourses: courses
      })
    })
      .then(response => response.json())
      .then(() => {
        resetForm();  // Reset the form after successful addition
        fetchStudents();  // Refresh the student list
      })
      .catch(err => console.log("Error:", err));
  }
}

// Edit student: Populate form with current student data
function editStudent(studentId) {
  // Fetch the student's data by ID
  fetch(`http://localhost:5000/api/students/${studentId}`)
    .then(res => res.json())
    .then(student => {
      // Populate the form with the student's current data
      document.getElementById("name").value = student.name;
      document.getElementById("email").value = student.email;
      document.getElementById("age").value = student.age;
      document.getElementById("courses").value = student.enrolledCourses.map(course => course.courseName).join(", ");

      // Set the editing student ID
      editingStudentId = studentId;

      // Change the submit button text to "Update Student"
      document.querySelector("button[type='submit']").textContent = "Update Student";
    })
    .catch(err => console.log("Error:", err));
}

// Reset the form after adding or editing a student
function resetForm() {
  document.getElementById("name").value = '';
  document.getElementById("email").value = '';
  document.getElementById("age").value = '';
  document.getElementById("courses").value = '';
  document.querySelector("button[type='submit']").textContent = "Add Student";
}

// Delete student
function deleteStudent(studentId) {
  const confirmed = confirm("Are you sure you want to delete this student?");
  if (confirmed) {
    fetch(`http://localhost:5000/api/students/${studentId}`, {
      method: 'DELETE'
    })
      .then(() => fetchStudents())  // Refresh student list after deletion
      .catch(err => console.log("Error:", err));
  }
}
