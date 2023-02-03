// const path = require('path');
// const fs = require('fs');
// const bcrypt = require('bcryptjs');
// const salt = bcrypt.genSaltSync(10);
// let script = document.createElement('script');
// script.src = 'https://code.jquery.com/jquery-3.6.3.min.js'; // Check https://jquery.com/ for the current version
// document.getElementsByTagName('head')[0].appendChild(script);

// // Function to read from a JSON file
// function readFromJSON(file) {
//   // Parse the JSON file and return it
//   return JSON.parse(fs.readFileSync(file));
// }

// // Function to write to a JSON file
// function writeToJSON(file, data) {
//   // Write the data to the file using fs.writeFileSync
//   fs.writeFileSync(file, JSON.stringify(data, null, 2), {
//     encoding: "utf-8",
//     flag: "w",
//   });
//   // Log a message to the console indicating that data has been written to the file
//   console.log(`Wrote ${data} to ${file}`);
// }

// // Function to toggle the events window
// function toggleEvents() {
//   // Select the events window
//   let eventsWindow = document.querySelector(".events__holder");
//   // Update the display property of the events window
//   eventsWindow.style.display =
//     eventsWindow.style.display == "none" ? "block" : "none";
// }

// // Function to toggle the accounts window
// function toggleAccounts() {
//   // Select the accounts window
//   let accountsWindow = document.querySelector(".accounts__holder");
//   // Update the display property of the accounts window
//   accountsWindow.style.display =
//     accountsWindow.style.display == "none" ? "block" : "none";
// }

// // Function to update the events data
// function updateEvents() {
//   // Fetch the events data from the JSON file
//   fetch(path.join(__dirname, "../database/events.json"))
//     .then(function (response) {
//       // Convert the response to JSON format
//       return response.json();
//     })
//     // Use the events data to update the events placeholder
//     .then(function (events) {
//       // Select the events placeholder
//       let placeholder = document.querySelector(".events__output");
//       // Initialize the output variable
//       let output = "";
//       // Loop through the events and build the output string
//       for (event of events) {
//         output += `
//                <tr>
//                   <td>${event.event_name}</td>
//                   <td>${event.event_description}</td>
//                   <td>${event.prize}</td>
//                   <td>${event.start_date}</td>
//                   <td>${event.end_date}</td>
//                   <td>
//                      <div class="button__bar">
//                         <input type="button" onclick="editEvent()" value="Edit">
//                         <input type="button" onclick="deleteEvent()" value="Delete">
//                      </div>
//                   </td>
//                </tr>
//             `
//       }
//       // Update the innerHTML of the events placeholder
//       placeholder.innerHTML = output;
//     })
// };

// // Call the updateEvents function to initialize the events data
// updateEvents();

// // Function to create a new event
// function createNewEvent() {
//   // Read the current events from a JSON file
//   let currentEvents = readFromJSON(
//     path.join(__dirname, "../database/events.json")
//   );

//   // Get the event name, description, prize, start date, and end date from the input fields
//   let eventName = document.querySelector(".event__name").value;
//   let eventDescription = document.querySelector(".event__description").value;
//   let prize = document.querySelector(".prize").value;
//   let startDate = document.querySelector(".start__date").value;
//   let endDate = document.querySelector(".end__date").value;

//   // Check if any of the fields are empty
//   if (
//     eventName === "" ||
//     eventDescription === "" ||
//     prize === "" ||
//     startDate === "" ||
//     endDate === ""
//   ) {
//     // If any field is empty, show an alert and return
//     alert("Empty fields present");
//     return;
//   } else if (endDate < startDate) {
//     // If the end date is earlier than the start date, show an alert and return
//     alert("Start date is later than end date");
//     return;
//   }

//   // Split the start and end dates into separate parts (month, day, and year)
//   startDate = startDate.split("-");
//   endDate = endDate.split("-");

//   // Reformat the start and end dates
//   startDate = `${startDate[1]}/${startDate[2]}/${startDate[0]}`;
//   endDate = `${endDate[1]}/${endDate[2]}/${endDate[0]}`;

//   // Define a template for a new event
//   let eventTemplate = {
//     event_name: eventName,
//     event_description: eventDescription,
//     prize: prize,
//     start_date: startDate,
//     end_date: endDate,
//     participants: [],
//   };

//   // Add the new event to the list of current events
//   currentEvents.push(eventTemplate);

//   // Write the updated list of events to the JSON file
//   writeToJSON(path.join(__dirname, "../database/events.json"), currentEvents);

//   // Update the events on the page
//   updateEvents();
// }
// function createNewAccount() {
//   const fname = document.querySelector('.student__fname').value;
//   const lname = document.querySelector('.student__lname').value;
//   const grade = document.querySelector('.student__grade').value;
//   const username = document.querySelector('.student__username').value;
//   const password = document.querySelector('.student__password').value;
//   const eventAlert = document.querySelector("#accountAlert");
  
//   if (!fname || !lname || !grade || !username || !password) {
//     eventAlert.hidden = false;
//     $(eventAlert).fadeIn(500).delay(500).fadeOut(500);
//     eventAlert.innerHTML = "<span>Make sure all fields are present with information!</span>";
//     return;
//   }

//   if (password.length < 8) {
//     eventAlert.hidden = false;
//     $(eventAlert).fadeIn(500).delay(500).fadeOut(500);
//     eventAlert.innerHTML = "<span>Password should be at least 8 characters long!</span>";
//     return;
//   }
  
//   const currentUsers = readFromJSON(path.join(__dirname, '../database/users.json'));
  
//   bcrypt.genSalt(10, function (err, salt) {
//     bcrypt.hash(password, salt, function (err, hash) {
//       const hashedPassword = hash;
//       const key = Math.floor(Math.random() * 1000000);

//       const newStudent = {
//         key: key,
//         student_fname: fname,
//         student_lname: lname,
//         student_grade: grade,
//         username: username,
//         password: hashedPassword,
//         points: 0,
//         admin: false
//       };
//       currentUsers.push(newStudent);
//       writeToJSON(path.join(__dirname, '../database/users.json'), currentUsers);
//       document.querySelector('.student__fname').value = "";
//       document.querySelector('.student__lname').value = "";
//       document.querySelector('.student__grade').value = "";
//       document.querySelector('.student__username').value = "";
//       document.querySelector('.student__password').value = "";
//     });
//   });
// }

// // Function to edit an existing event
// function editEvent() {

// }

// // Function to delete an existing event
// function deleteEvent() {

// }


const path = require('path');
const fs = require('fs');
const { table } = require('console');

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


function alertPopup(title = 'Alert', description = 'Sample alert text') {
   let alertModal = document.querySelector('.alert__box');
   document.querySelector('.alert__title').innerHTML = title;
   document.querySelector('.alert__description').innerHTML = description;
   alertModal.classList.add('fade');
   setTimeout(function () {
      alertModal.classList.remove('fade');
   }, 2000);
}

function warningPopup(title = 'Warning', description = 'Sample warning text') {
   let warningModal = document.querySelector('.warning__box');
   document.querySelector('.warning__title').innerHTML = title;
   document.querySelector('.warning__description').innerHTML = description;
   warningModal.classList.add('fade');
   setTimeout(function () {
      warningModal.classList.remove('fade');
   }, 2000);
}

function errorPopup(title = 'Error', description = 'Sample error text') {
   let errorModal = document.querySelector('.error__box');
   document.querySelector('.error__title').innerHTML = title;
   document.querySelector('.error__description').innerHTML = description;
   errorModal.classList.add('fade');
   setTimeout(function () {
      errorModal.classList.remove('fade');
   }, 2000);
}



// AUTOMATICALLY RESIZE TEXTAREA

// const tx = document.getElementsByTagName('textarea');

// for (let i = 0; i < tx.length; i++) {
//    tx[i].setAttribute('style', 'height:' + (tx[i].scrollHeight) + 'px;overflow-y:hidden;');
//    tx[i].addEventListener('input', OnInput, false);
// }

// function OnInput() {
//    this.style.height = 0;
//    this.style.height = (this.scrollHeight) + 'px';
// }

function generateDefaultPassword(length = 8) {
   return Math.random().toString(36).slice(-length);
}


// change color of select dropdown on change
var selectThing = document.querySelector('.student__grade');
selectThing.onchange = function () {
   selectThing.style.color = (selectThing.value === '0') ? '#777' : '#aaa';
   // if (selectThing.value === '0') {
   //    selectThing.style.color = '#777'
   // } else {
   //    selectThing.style.color = '#aaa'
   // }
}

// change color of date picker on change
let startDateCol = document.querySelector('.start__date');
let endDateCol = document.querySelector('.end__date');
startDateCol.style.color = (startDateCol.value !== '') ? '#aaa' : '#777';
endDateCol.style.color = (endDateCol.value !== '') ? '#aaa' : '#777';
startDateCol.onchange = function () {
   startDateCol.style.color = (startDateCol.value !== '') ? '#aaa' : '#777';
}
endDateCol.onchange = function () {
   endDateCol.style.color = (endDateCol.value !== '') ? '#aaa' : '#777';
}

function toggleEvents() {
   let eventsWindow = document.querySelector('.events__holder');
   eventsWindow.style.display = eventsWindow.style.display == 'none' ? 'block' : 'none';
}

function toggleAccounts() {
   let accountsWindow = document.querySelector('.accounts__holder');
   accountsWindow.style.display = accountsWindow.style.display == 'none' ? 'block' : 'none';
}

function updateEvents() {
   fetch(path.join(__dirname, '../database/events.json'))
      .then(function (response) {
         return response.json();
      })
      .then(function (events) {
         let placeholder = document.querySelector('.events__output');
         let output = '';
         for (event of events) {
            output += `
               <tr>
                  <td>${event.event_name}</td>
                  <td>${event.event_description}</td>
                  <td>${event.prize}</td>
                  <td>${event.start_date}</td>
                  <td>${event.end_date}</td>
                  <td>
                     <!--<div class="button__bar">-->
                        <input type="button" onclick="editEvent()" value="Edit">
                        <input type="button" onclick="deleteEvent()" value="Delete">
                     <!--</div>-->
                  </td>
               </tr>
            `
         }
         placeholder.innerHTML = output;
      });
}

updateEvents();

function updateAccounts() {
   fetch(path.join(__dirname, '../database/accounts.json')).then(function (res) {
      return res.json();
   }).then(function (accounts) {
      let placeholder = document.querySelector('.accounts__output');
      let output = '';
      for (account of accounts) {
         if (account.admin) {
            output += `
               <tr>
                  <td>${account.fname}</td>
                  <td>${account.lname}</td>
                  <td>${account.grade}</td>
                  <td>${account.username}</td>
                  <td>${account.points}</td>
                  <!--<td>
                     <input type="button" onclick="editAccount()" value="Edit">
                     <input type="button" onclick="deleteAccount()" value="Delete">
                  </td>-->
                  <td>ADMIN</td>
               </tr>
            `
         } else {
            output += `
               <tr>
                  <td>${account.fname}</td>
                  <td>${account.lname}</td>
                  <td>${account.grade}</td>
                  <td>${account.username}</td>
                  <td>${account.points}</td>
                  <td>
                     <input type="button" onclick="editAccount()" value="Edit">
                     <input type="button" onclick="deleteAccount()" value="Delete">
                  </td>
               </tr>
            `
         }
      }
      placeholder.innerHTML = output;
   });
}

updateAccounts();

function createNewEvent() {
   let currentEvents = readFromJSON(path.join(__dirname, '../database/events.json'));
   let eventName = document.querySelector('.event__name').value;
   let eventDescription = document.querySelector('.event__description').value;
   let prize = document.querySelector('.prize').value;
   let startDate = document.querySelector('.start__date').value;
   let endDate = document.querySelector('.end__date').value;
   if (
      eventName === '' ||
      eventDescription === '' ||
      prize === '' ||
      startDate === '' ||
      endDate === ''
   ) {
      warningPopup('Warning', 'Empty fields present');
      return;
   } else if (endDate < startDate) {
      warningPopup('Warning', 'Invalid timespan');
      return;
   }
   startDate = startDate.split('-');
   endDate = endDate.split('-');
   startDate = `${startDate[1]}/${startDate[2]}/${startDate[0]}`;
   endDate = `${endDate[1]}/${endDate[2]}/${endDate[0]}`;
   let eventTemplate = {
      "event_name": eventName,
      "event_description": eventDescription,
      "prize": prize,
      "start_date": startDate,
      "end_date": endDate,
      "participants": []
   }
   currentEvents.push(eventTemplate);
   writeToJSON(path.join(__dirname, '../database/events.json'), currentEvents);
   updateEvents();
}

function editEvent() {
}

function deleteEvent() {
}

function createNewAccount() {
   let currentAccounts = readFromJSON(path.join(__dirname, '../database/accounts.json'));

   // let fullName = document.querySelector('.student__name').value;

   // if ()

   let fname = document.querySelector('.student__fname').value;
   let lname = document.querySelector('.student__lname').value;


   // let sanitized = fullName.toLowerCase();
   // let fname = fullName.split(' ')[0];
   // let lname = fullName.split(' ')[1];

   let grade = document.querySelector('.student__grade').value;

   if (fname === '' || lname === '' || grade === '0') {
      warningPopup('Warning', 'Empty fields present')
      return;
   }

   // let username = document.querySelector('.student__username').value;
   let username = `${fname.toLowerCase()[0]}${lname.toLowerCase()}`

   let password = generateDefaultPassword();

   let accountTemplate = {
      "fname": fname,
      "lname": lname,
      "grade": grade,
      "username": username,
      "password": password,
      "points": 0,
      "admin": false
   }

   currentAccounts.push(accountTemplate);
   writeToJSON(path.join(__dirname, '../database/accounts.json'), currentAccounts);
   updateAccounts();

   alertPopup('Alert', 'Student account created successfully');
}

function filterEvents() {
   let input = document.querySelector('.event__search');
   let filter = input.value.toUpperCase();
   let table = document.querySelector('.events__output');
   tr = table.getElementsByTagName('tr');
   for (i = 0; i < tr.length; i++) {
      td = tr[i].getElementsByTagName('td')[0];
      if (td) {
         let textValue = td.textContent || td.innerText;
         if (textValue.toUpperCase().indexOf(filter) > -1) {
            tr[i].style.display = '';
         } else {
            tr[i].style.display = 'none';
         }
      }
   }
}

function filterAccounts() {
   let input = document.querySelector('.account__search');
   let filter = input.value.toUpperCase();
   let table = document.querySelector('.accounts__output');
   tr = table.getElementsByTagName('tr');
   for (i = 0; i < tr.length; i++) {
      td = tr[i].getElementsByTagName('td')[0];
      if (td) {
         let textValue = td.textContent || td.innerText;
         if (textValue.toUpperCase().indexOf(filter) > -1) {
            tr[i].style.display = '';
         } else {
            tr[i].style.display = 'none';
         }
      }
   }
}
