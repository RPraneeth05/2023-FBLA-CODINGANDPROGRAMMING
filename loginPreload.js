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
/**
* Shows an error popup. This is a modal window that allows the user to select a message to display in the dialog
* 
* @param title - The title of the error popup
* @param description - The descriptive text of the error ( can be null
*/
function errorPopup(title = "Error", description = "Sample error text") {
   let errorModal = document.querySelector(".error__box");
   errorModal.style.display = "block";
   document.querySelector(".error__title").innerHTML = title;
   document.querySelector(".error__description").innerHTML = description;
   errorModal.classList.add("fade");
   /**
   * / / object / list to be used in a call to any of the methods of the object
   */
   setTimeout(function () {
      errorModal.classList.remove("fade");
   }, 1300);
   setTimeout(() => {
      errorModal.style.display = "none";
   }, 1000);
}


/**
* Toggles visibility of password fields on the form. This is a bit tricky because we need to make sure that passwords are displayed in the correct
*/
function toggleVisibility() {
   var x = document.querySelector('.password');
   // if the type is text or password
   if (x.type === "password") {
      x.type = "text";
   } else {
      x.type = "password";
   }
}

/**
* Populate the state dropdown with the current schools'states. This is called after the page has loaded
*/
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

/**
* Populate school dropdown based on state. Schools are filtered by state to avoid unintended results
* 
* @param state - The state we want to
*/
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
   // Hide the school if there are no schools
   if (stateSchools.length > 0) {
      schoolSel.hidden = false;
      document.querySelector(".user__details").hidden = false;
   }
}

/**
* Redirect the user to the school admin page if they are the same or admin password. This is called when the user clicks on the link in the form.
* 
* 
* @return { Promise } The promise resolves when the redirect is done or rejects if there was an error. In case of success returns
*/
async function redirect() {
   const usernameInput = document.querySelector(".username").value;
   const passwordInput = document.querySelector(".password").value;

   // Make sure all fields are entered
   if (!usernameInput || !passwordInput) {
      errorPopup("Missing Information", "Make sure all fields are entered!");
      return;
   }

   const selectedSchoolId = schoolSel.value;
   const selectedSchool = schools.find(
      (school) => school.ID === selectedSchoolId
   );
   localStorage.setItem("schoolId", selectedSchool.ID);
   // This function is used to select a valid school.
   if (!selectedSchool) {
      errorPopup("Invalid School", "Please select a valid school.");
      return;
   }
   // if username and password are equal
   if (usernameInput === selectedSchool.adminEmail) {
      // If the password input is different from selectedSchool. adminPass then redirect to admin. html
      if (bcrypt.compareSync(passwordInput, selectedSchool.adminPass)) {
         location.href = path.join(__dirname, "./src/main/admin.html");
         return;
      }
   }

   // Implement your Firebase authentication logic here to validate the user
   // ...

   // If the user is a student, redirect to the student page
   const user = await getUserByEmail(selectedSchoolId, usernameInput);
   // if user is not set the user is not authenticated
   if (!user) {
      errorPopup(
         "Wrong Credentials",
         "Please enter the correct username and password."
      );
      return;
   }
   const correctPassword = bcrypt.compareSync(passwordInput, user.password);

   // if correctPassword is true errorPopup is called with the correct username and password.
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
