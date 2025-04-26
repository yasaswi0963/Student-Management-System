document.getElementById("courseForm").addEventListener("submit", saveCourse);
fetchCourses();

function fetchCourses() {
  fetch('http://localhost:5000/api/courses')
    .then(res => res.json())
    .then(data => {
      const coursesTable = document.querySelector("#coursesTable tbody");
      coursesTable.innerHTML = "";
      data.forEach(course => {
        const row = document.createElement("tr");
        row.innerHTML = `
          <td>${course.courseName}</td>
          <td>${course.instructor}</td>
          <td>${course.credits}</td>
          <td>
            <button class="btn btn-sm btn-warning" onclick="editCourse('${course._id}', '${course.courseName}', '${course.instructor}', ${course.credits})">Edit</button>
            <button class="btn btn-sm btn-danger" onclick="deleteCourse('${course._id}')">Delete</button>
          </td>
        `;
        coursesTable.appendChild(row);
      });
    })
    .catch(err => console.log("Error:", err));
}

function saveCourse(event) {
  event.preventDefault();
  const id = document.getElementById("courseId").value;
  const courseName = document.getElementById("courseName").value;
  const instructor = document.getElementById("instructor").value;
  const credits = document.getElementById("credits").value;

  const method = id ? "PUT" : "POST";
  const url = id ? `http://localhost:5000/api/courses/${id}` : "http://localhost:5000/api/courses";

  fetch(url, {
    method,
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ courseName, instructor, credits })
  })
    .then(response => response.json())
    .then(() => {
      fetchCourses();
      document.getElementById("courseForm").reset();
    })
    .catch(err => console.log("Error:", err));
}

function editCourse(id, name, instructor, credits) {
  document.getElementById("courseId").value = id;
  document.getElementById("courseName").value = name;
  document.getElementById("instructor").value = instructor;
  document.getElementById("credits").value = credits;
}

function deleteCourse(id) {
  fetch(`http://localhost:5000/api/courses/${id}`, {
    method: "DELETE"
  })
    .then(() => fetchCourses())
    .catch(err => console.log("Error:", err));
}
