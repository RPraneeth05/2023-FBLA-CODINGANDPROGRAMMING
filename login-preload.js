// Importing required modules
const path = require("path");
const fs = require("fs");
const jwt = require("jsonwebtoken");
const bcrypt = require('bcryptjs');
const { loadSchools } = require("./firebaseHelper");

// Function to read data from a JSON file
const stateSel = document.getElementById("state");
const schoolSel = document.getElementById("school");

let schools = [];

document.addEventListener('DOMContentLoaded', async () => {
  schools = await loadSchools();
  populateStateDropdown();
});

function populateStateDropdown() {
  for (let school of schools) {
    const stateOption = document.createElement('option');
    stateOption.value = school.state;
    stateOption.text = school.state;
    stateSel.appendChild(stateOption);
  }
}

stateSel.addEventListener("change", () => {
  const selectedState = stateSel.value;
  populateSchoolDropdown(selectedState);
});

function populateSchoolDropdown(state) {
  schoolSel.innerHTML = '';
  const stateSchools = schools.filter(school => school.State === state);
  for (let school of stateSchools) {
    const schoolOption = document.createElement('option');
    schoolOption.value = school.ID;
    schoolOption.text = school.School;
    schoolSel.appendChild(schoolOption);
  }

  schoolSel.hidden = false;
  document.getElementById("userdetails").hidden = false;
}

function validateUsernameAndPassword() {
  const usernameInput = document.querySelector(".username").value;
  const passwordInput = document.querySelector(".password").value;

  if (!usernameInput || !passwordInput) {
    errorPopup("Missing Information", "Make sure all fields are entered!");
    return;
  }

  const selectedSchoolId = schoolSel.value;
  const selectedSchool = schools.find(school => school.ID === selectedSchoolId);

  if (!selectedSchool) {
    errorPopup("Invalid School", "Please select a valid school.");
    return;
  }
  if (usernameInput === selectedSchool.adminEmail && passwordInput === String(selectedSchool.adminPass)) {
    localStorage.setItem("schoolId", selectedSchool.ID);
    location.href = path.join(__dirname, "./src/main/admin.html");
  }

  // Implement your Firebase authentication logic here to validate the user
  // ...

  // If the user is a student, redirect to the student page
  // location.href = path.join(__dirname, "./src/main/student.html");
}
