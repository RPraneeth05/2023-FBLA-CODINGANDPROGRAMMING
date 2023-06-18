// Importing required modules
const path = require("path");
const fs = require("fs");
const jwt = require("jsonwebtoken")
const bcrypt = require('bcryptjs');

const salt = bcrypt.genSaltSync(10);
// Function to read data from a JSON file
const stateSel = document.getElementById("state");

stateSel.addEventListener("change", () => {
  let state = stateSel.value;

  document.getElementById("default").remove()
});
function readFromJSON(file) {
  return JSON.parse(fs.readFileSync(file));
}
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

function validateUsernameAndPassword() {
  // Reading the list of users from the users.json file
  let users = readFromJSON(path.join(__dirname, "./src/database/users.json"));

  // Reading the entered username and password
  let usernameInput = document.querySelector(".username").value;
  let passwordInput = document.querySelector(".password").value;
  if (!usernameInput || !passwordInput) {
    errorPopup("Missing Information", "Make sure all fields are entered!");
    return;
  }
  for (let user of users) {
    let shouldEnd = false;
    if (usernameInput == user.username) {
      let checkPassword = bcrypt.compare(passwordInput, user.password,
        (err, success) => {
          if (err) {
            console.error(err);
            return;
          }
          if (!success) {
            // wrong password
            errorPopup("Wrong Password", "The password entered is incorrect.");
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
      break;
    } else {
      setTimeout(() => errorPopup("Account doesn't exist", "Maybe you typed in the wrong username?"), 300);
    }
  }
}
