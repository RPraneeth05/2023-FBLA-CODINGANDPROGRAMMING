// // Importing required modules
// const path = require("path");
// const fs = require("fs");

// // Function to read data from a JSON file
// function readFromJSON(file) {
//   return JSON.parse(fs.readFileSync(file));
// }

// // Function to write data to a JSON file
// function writeToJSON(file, data) {
//   fs.writeFileSync(file, JSON.stringify(data, null, 2), {
//     encoding: "utf-8",
//     flag: "w",
//   });
//   console.log(`Wrote ${data} to ${file}`);
// }

// // Function to validate the entered username and password
// function validateUsernameAndPassword() {
//   // Reading the list of users from the users.json file
//   let users = readFromJSON(path.join(__dirname, "./src/database/users.json"));

//   // Reading the entered username and password
//   let usernameInput = document.querySelector(".username").value;
//   let passwordInput = document.querySelector(".password").value;

//   // Checking if the entered username and password match with any of the users
//   for (user of users) {
//     if (usernameInput === user.username && passwordInput === user.password) {
//       // If the user is an admin, redirect to the admin page
//       if (user.admin)
//         location.href = path.join(__dirname, "./src/main/admin.html");
//       // If the user is a student, redirecting to the student page
//       else location.href = path.join(__dirname, "./src/main/student.html");
//     }
//   }
// }

const path = require('path');
const fs = require('fs');

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
   let users = readFromJSON(path.join(__dirname, './src/database/accounts.json'));
   let usernameInput = document.querySelector('.username').value;
   let passwordInput = document.querySelector('.password').value;
   for (user of users) {
      if (usernameInput === user.username && passwordInput === user.password) {
         if (user.admin) location.href = path.join(__dirname, './src/main/admin.html');
         else location.href = path.join(__dirname, './src/main/student.html');
      }
   }
}
