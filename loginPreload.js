// Importing required modules
const path = require("path");
const fs = require("fs");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { getUserByEmail, loadSchools } = require("./firebaseHelper");

// Function to read data from a JSON file
const stateSel = document.getElementById("state");
const schoolSel = document.getElementById("school");

let schools = [];

document.addEventListener("DOMContentLoaded", async () => {
   schools = await loadSchools();
   populateStateDropdown();
});
function errorPopup(title = "Error", description = "Sample error text") {
   let errorModal = document.querySelector(".error__box");
   errorModal.style.display = "block";
   document.querySelector(".error__title").innerHTML = title;
   document.querySelector(".error__description").innerHTML = description;
   errorModal.classList.add("fade");
   setTimeout(function () {
      errorModal.classList.remove("fade");
   }, 1300);
   setTimeout(() => {
      errorModal.style.display = "none";
   }, 1000);
}


function populateStateDropdown() {
   for (let school of schools) {
      const stateOption = document.createElement("option");
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
   schoolSel.innerHTML = "";
   const stateSchools = schools.filter((school) => school.State === state);
   // console.log(stateSchools)
   for (let school of stateSchools) {
      const schoolOption = document.createElement("option");
      schoolOption.value = school.ID;
      schoolOption.text = school.School;
      schoolSel.appendChild(schoolOption);
   }
   if (stateSchools.length > 0) {
      schoolSel.hidden = false;
      document.querySelector(".user__details").hidden = false;
   }
}

async function redirect() {
   const usernameInput = document.querySelector(".username").value;
   const passwordInput = document.querySelector(".password").value;

   if (!usernameInput || !passwordInput) {
      errorPopup("Missing Information", "Make sure all fields are entered!");
      return;
   }

   const selectedSchoolId = schoolSel.value;
   const selectedSchool = schools.find(
      (school) => school.ID === selectedSchoolId
   );
   localStorage.setItem("schoolId", selectedSchool.ID);
   if (!selectedSchool) {
      errorPopup("Invalid School", "Please select a valid school.");
      return;
   }
   if (usernameInput === selectedSchool.adminEmail) {
      if (bcrypt.compareSync(passwordInput, selectedSchool.adminPass)) {
         location.href = path.join(__dirname, "./src/main/admin.html");
         return;
      }
   }

   // Implement your Firebase authentication logic here to validate the user
   // ...

   // If the user is a student, redirect to the student page
   const user = await getUserByEmail(selectedSchoolId, usernameInput);
   if (!user) {
      errorPopup(
         "Wrong Credentials",
         "Please enter the correct username and password."
      );
      return;
   }
   const correctPassword = bcrypt.compareSync(passwordInput, user.password);

   if (!correctPassword) {
      errorPopup(
         "Wrong Credentials",
         "Please enter the correct username and password."
      );
      return;
   }
   // success student login
   localStorage.setItem("email", usernameInput);
   location.href = path.join(__dirname, "./src/main/student.html");
}
