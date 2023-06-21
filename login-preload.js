// Importing required modules
const path = require("path");
const fs = require("fs");
const jwt = require("jsonwebtoken");
const bcrypt = require('bcryptjs');
const { getUserByEmail, loadSchools } = require("./firebaseHelper");

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

async function validateUsernameAndPassword() {
  const usernameInput = document.querySelector(".username").value;
  const passwordInput = document.querySelector(".password").value;

  if (!usernameInput || !passwordInput) {
    errorPopup("Missing Information", "Make sure all fields are entered!");
    return;
  }

  const selectedSchoolId = schoolSel.value;
  const selectedSchool = schools.find(school => school.ID === selectedSchoolId);
  localStorage.setItem("schoolId", selectedSchool.ID);
  if (!selectedSchool) {
    errorPopup("Invalid School", "Please select a valid school.");
    return;
  }
  if (usernameInput === selectedSchool.adminEmail) {
    if (bcrypt.compareSync(passwordInput, selectedSchool.adminPass)) {
      location.href = path.join(__dirname, "./src/main/admin.html");
    }
    return;
  }

  // Implement your Firebase authentication logic here to validate the user
  // ...

  // If the user is a student, redirect to the student page
  const user = await getUserByEmail(selectedSchoolId, usernameInput);
  if (!user) {
    errorPopup("Wrong Credentials", "Please enter the correct username and password.");
    return;
  }
  const correctPassword = bcrypt.compareSync(passwordInput, user.password);

  if (!correctPassword) {
    errorPopup("Wrong Credentials", "Please enter the correct username and password.");
    return;
  }
  location.href = path.join(__dirname, "./src/main/student.html");
}
