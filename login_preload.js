// Importing required modules
const path = require("path");
const fs = require("fs");
const jwt = require("jsonwebtoken")
const bcrypt = require('bcryptjs');
const salt = bcrypt.genSaltSync(10);
// Function to read data from a JSON file
function readFromJSON(file) {
  return JSON.parse(fs.readFileSync(file));
}



function alertPopup(title = "Alert", description = "Sample alert text") {
  let alertModal = document.querySelector(".alert__box");
  alertModal.style.display = "block";
  document.querySelector(".alert__title").innerHTML = title;
  document.querySelector(".alert__description").innerHTML = description;
  alertModal.classList.add("fade");
  setTimeout(function () {
    alertModal.classList.remove("fade");
  }, 700);
  setTimeout(() => {
    alertModal.style.display = "none";
  }, 1500);
}

function warningPopup(title = "Warning", description = "Sample warning text") {
  let warningModal = document.querySelector(".warning__box");
  warningModal.style.display = "block";
  document.querySelector(".warning__title").innerHTML = title;
  document.querySelector(".warning__description").innerHTML = description;
  warningModal.classList.add("fade");
  setTimeout(function () {
    warningModal.classList.remove("fade");
  }, 700);
  setTimeout(() => {
    warningModal.style.display = "none";
  }, 1500);
}

function errorPopup(title = "Error", description = "Sample error text") {
  let errorModal = document.querySelector(".error__box");
  errorModal.style.display = "block";
  document.querySelector(".error__title").innerHTML = title;
  document.querySelector(".error__description").innerHTML = description;
  errorModal.classList.add("fade ");
  setTimeout(function () {
    errorModal.classList.remove("fade");
  }, 1300);
  setTimeout(() => {
    errorModal.style.display = "none";
  }, 1000);
}


function writeToJSON(file, data) {
  fs.writeFileSync(file, JSON.stringify(data, null, 2), {
    encoding: 'utf-8',
    flag: 'w'
  });
  console.log(`Wrote ${data} to ${file}`);
}

function validateUsernameAndPassword() {
  // Reading the list of users from the users.json file
  let users = readFromJSON(path.join(__dirname, "./src/database/users.json"));

  // Reading the entered username and password
  let usernameInput = document.querySelector(".username").value;
  let passwordInput = document.querySelector(".password").value;
  if (!usernameInput || !passwordInput) {
    errorPopup("Missing Information", "Make sure all fields are entered!")
  }
  for (let user of users) {
    if (usernameInput == user.username) {
      let checkPassword = bcrypt.compare(passwordInput, user.password,
        (err, success) => {
          if (err) {
            console.error(err);
            return;
          }
          if (!success) {
            // wrong password
            errorPopup("Invalid username or password",
              "The username or password is incorrect, or maybe the account doesn't exist. ")
            return;
          }
          const payload = {
            "loggedIn": true,
            "username": user.username,
          };
          const token = jwt.sign(payload, 'adminKey');
          fs.writeFile(path.join(__dirname, "./src/database/jwt.txt"),
            token, () => { });
          if (user.admin)
            location.href = path.join(__dirname, "./src/main/admin.html");
          // If the user is a student, redirecting to the student page
          else location.href = path.join(__dirname, "./src/main/student.html");
        });
    }
  }
}
