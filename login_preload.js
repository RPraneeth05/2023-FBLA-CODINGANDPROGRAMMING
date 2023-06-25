// Importing required modules
const path = require("path");
const fs = require("fs");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const salt = bcrypt.genSaltSync(10);
// Function to read data from a JSON file
const stateSel = document.getElementById("state");

stateSel.addEventListener("change", () => {
  let state = stateSel.value;

  document.getElementById("default").remove();
});
/**
 * Read a JSON file and return the object. This is useful for testing purposes. If you don't want to run this on a production server use ` readFromConsole `
 *
 * @param file - Path to the JSON file
 *
 * @return { Object } Object representation of the JSON file as returned by fs. readFileSync ( file ). It's guaranteed to be JSON
 */
function readFromJSON(file) {
  return JSON.parse(fs.readFileSync(file));
}
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
  }, 1600);
}

/**
 * Redirects to the admin page after user has entered their username and password. This function is called by clicking the submit button on the login form.
 *
 *
 * @return { void } If everything went fine the function returns. Otherwise it prints an error message and quits
 */
function redirect() {
  // Reading the list of users from the users.json file
  let users = readFromJSON(path.join(__dirname, "./src/database/users.json"));

  // Reading the entered username and password
  let usernameInput = document.querySelector(".username").value;
  let passwordInput = document.querySelector(".password").value;
  // Make sure all fields are entered
  if (!usernameInput || !passwordInput) {
    errorPopup("Missing Information", "Make sure all fields are entered!");
    return;
  }
  for (let user of users) {
    let shouldEnd = false;
    // This function is used to check if the user is logged in.
    if (usernameInput == user.username) {
      let checkPassword = bcrypt.compare(
        passwordInput,
        user.password,
        (err, success) => {
          // if there is an error in the console
          if (err) {
            console.error(err);
            return;
          }
          // if success is true the password entered is incorrect.
          if (!success) {
            // wrong password
            errorPopup("Wrong Password", "The password entered is incorrect.");
            return;
          }
          const payload = {
            loggedIn: true,
            username: user.username,
          };
          const token = jwt.sign(payload, "adminKey");
          fs.writeFile(
            path.join(__dirname, "./src/database/jwt.txt"),
            token,
            () => {}
          );
          // If the user is a user or a student redirect to the admin page.
          if (user.admin)
            location.href = path.join(__dirname, "./src/main/admin.html");
          // If the user is a student, redirecting to the student page
          else location.href = path.join(__dirname, "./src/main/student.html");
        }
      );
      break;
    } else {
      setTimeout(
        () =>
          errorPopup(
            "Account doesn't exist",
            "Maybe you typed in the wrong username?"
          ),
        300
      );
    }
  }
}
