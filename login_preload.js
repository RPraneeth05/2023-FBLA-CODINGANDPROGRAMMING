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
   let users = readFromJSON(path.join(__dirname, './src/database/users.json'));
   let usernameInput = document.querySelector('.username').value;
   let passwordInput = document.querySelector('.password').value;
   for (user of users) {
      if (usernameInput === user.username && passwordInput === user.password) {
         if (user.admin) location.href = path.join(__dirname, './src/main/admin.html');
         else location.href = path.join(__dirname, './src/main/student.html');
      }
   }
}