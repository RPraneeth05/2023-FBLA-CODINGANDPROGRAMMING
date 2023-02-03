// Importing required modules
const path = require("path");
const fs = require("fs");
const bcrypt = require('bcryptjs');
const salt = bcrypt.genSaltSync(10);
// Function to read data from a JSON file
function readFromJSON(file) {
   return JSON.parse(fs.readFileSync(file));
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
  for (let user of users) {
    let checkPassword = bcrypt.compare(passwordInput, user.password)
    if (usernameInput === user.username && checkPassword) {
      // If the user is an admin, redirect to the admin page
      if (user.admin)
        location.href = path.join(__dirname, "./src/main/admin.html");
      // If the user is a student, redirecting to the student page
      else location.href = path.join(__dirname, "./src/main/student.html");
    }
  }
}
