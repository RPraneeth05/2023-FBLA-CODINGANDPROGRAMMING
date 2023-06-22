// Importing required modules
const path = require("path");
const fs = require("fs");
const jwt = require("jsonwebtoken")
const bcrypt = require('bcryptjs');

// Generating a salt for bcrypt hashing
const salt = bcrypt.genSaltSync(10);

// Event listener for state select element change
const stateSel = document.getElementById("state");

// An event listener is added to the stateSel element to handle changes in the state select dropdown. 
// When a state is selected, it removes the default option from the dropdown.
stateSel.addEventListener("change", () => {
   let state = stateSel.value;

   document.getElementById("default").remove()
});

// Function to read data from a JSON file
function readFromJSON(file) {
   return JSON.parse(fs.readFileSync(file));
}

// Function to display an error popup
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
   }, 1600);
}

// Function to handle form submission and user authentication
function redirect() {
   // Reading the list of users from the users.json file
   let users = readFromJSON(path.join(__dirname, "./src/database/users.json"));

   // Reading the entered username and password
   let usernameInput = document.querySelector(".username").value;
   let passwordInput = document.querySelector(".password").value;
   // Checking if username and password are provided
   if (!usernameInput || !passwordInput) {
      errorPopup("Missing Information", "Make sure all fields are entered!");
      return;
   }
   // Iterating over the list of users
   for (let user of users) {
      let shouldEnd = false;
      // Checking if the entered username matches a user in the list
      if (usernameInput == user.username) {
         // Comparing the entered password with the stored hashed password
         let checkPassword = bcrypt.compare(passwordInput, user.password,
            (err, success) => {
               if (err) {
                  console.error(err);
                  return;
               }
               if (!success) {
                  // // Displaying an error message for incorrect password 
                  errorPopup("Wrong Password", "The password entered is incorrect.");
                  return;
               }
               // Generating a JSON Web Token (JWT) for authentication
               const payload = {
                  "loggedIn": true,
                  "username": user.username,
               };
               // Writing the JWT to a file
               const token = jwt.sign(payload, 'adminKey');
               fs.writeFile(path.join(__dirname, "./src/database/jwt.txt"),
                  token, () => { });
               // Redirecting to the appropriate page based on user role
               if (user.admin)
                  // If the user is an admin, redirecting to the admin page
                  location.href = path.join(__dirname, "./src/main/admin.html");
               // If the user is a student, redirecting to the student page
               else location.href = path.join(__dirname, "./src/main/student.html");
            });
         break;
      } else {
         // Displaying an error message for non-existent account
         setTimeout(() => errorPopup("Account doesn't exist", "Maybe you typed in the wrong username?"), 300);
      }
   }
}
