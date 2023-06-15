// Importing required modules
const path = require("path");
const fs = require("fs");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const salt = bcrypt.genSaltSync(10);
// Function to read data from a JSON file
function readFromJSON(file) {
   return JSON.parse(fs.readFileSync(file));
}

// Function to write data to a JSON file
function writeToJSON(file, data) {
   fs.writeFileSync(file, JSON.stringify(data, null, 2), {
      encoding: "utf-8",
      flag: "w",
   });
   console.log(`Wrote ${data} to ${file}`);
}
let USERDATA;
function getUserDetails() {
   const data = fs.readFileSync(path.join(__dirname, "../database/jwt.txt"));
   USERDATA = jwt.decode(data);
   let users = readFromJSON(path.join(__dirname, "../database/users.json"));
   for (let user of users) {
      if (user.username == USERDATA.username) {
         USERDATA = user;
      }
   }
   return USERDATA;
}
getUserDetails();
// Function to populate the select options by fetching events.json file and using it to make html options control element with the different event names
function updateEvents() {
   fetch(path.join(__dirname, "../database/events.json"))
      .then(function (response) {
         return response.json();
      })
      .then(function (events) {
         let placeholder = document.querySelector(".events__output");
         let output = "";
         let buttonHTML = "";
         USERDATA = getUserDetails();
         for (let event of events) {
            console.log(USERDATA);
            if (Date.now() < Date.parse(event.start_date)) {
               buttonHTML = "-";
            } else if (event.participants.includes(USERDATA.username)) {
               buttonHTML = `<input type="button" onclick="updateAttendance('${event.event_name}', false)" value="Didn't Attend">`;
            } else {
               buttonHTML = `<input type="button" onclick="updateAttendance('${event.event_name}', true)" value="Attended">`;
            }
            output += `
				<tr>
				   <td>${event.event_name}</td>
				   <td>${event.event_description}</td>
				   <td>${event.prize}</td>
				   <td>${event.start_date}</td>
				   <td>${event.end_date}</td>
				   <td>
					  <!--<div class="button__bar">-->
					  ${buttonHTML}
					  <!--</div>-->
				   </td>
				</tr>
			 `;
         }
         placeholder.innerHTML = output;
      });
}

// Calling the populateSelect function
updateEvents();
function updateAttendance(eventName, attend) {
   if (attend) {
      // Create the popup
      let popup = document.createElement("div");
      popup.style.position = "fixed";
      popup.style.top = "0";
      popup.style.left = "0";
      popup.style.width = "100%";
      popup.style.height = "100%";
      popup.style.backgroundColor = "rgba(0, 0, 0, 0.5)";
      popup.style.display = "flex";
      popup.style.justifyContent = "center";
      popup.style.alignItems = "center";

      // Add the input field to the popup
      let input = document.createElement("input");
      input.type = "text";
      input.placeholder = "Enter code here";
      popup.appendChild(input);

      // Add the submit button to the popup
      let submit = document.createElement("button");
      submit.innerText = "Submit";
      submit.addEventListener("click", function () {
         let code = input.value;
         if (code) {
            popup.remove();
            backendUpdateAttendance(eventName, attend, code)
         }
      });
      popup.appendChild(submit);

      // Add the popup to the document
      document.body.appendChild(popup);

   } else {
      backendUpdateAttendance(eventName, attend);
   }




}

function backendUpdateAttendance(eventName, attend, code = "") {
   let events = readFromJSON(path.join(__dirname, "../database/events.json"));
   let event;
   for (let e of events) {
      if (e.event_name == eventName) {
         event = e;
         if (attend) {
            e.participants.push(USERDATA.username);
            if (e.code == code) {
               alertPopup("Successfully registered for event!", "");
            } else {
               errorPopup("Wrong code.", "");
               return;
            }
         } else {
            e.participants = e.participants.filter(
               (i) => i != USERDATA.username
            );
         }
      }
   }

   writeToJSON(path.join(__dirname, "../database/events.json"), events);
   let users = readFromJSON(path.join(__dirname, "../database/users.json"));
   for (let usr of users) {
      if (usr.username == USERDATA.username) {
         if (attend) {
            usr.points = Number(usr.points) + Number(event.prize);
            usr.events.push(eventName);
         } else {
            usr.points = Number(usr.points) - Number(event.prize);
            usr.events = usr.events.filter((i) => i != eventName);
         }
         USERDATA = usr;
      }
   }
   // add alert notifying user of updated attendance
   if (attend) {
   } else {
   }
   writeToJSON(path.join(__dirname, "../database/users.json"), users);
   updateEvents();
   refDashboard();
   updateAccounts();
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
   errorModal.classList.add("fade");
   setTimeout(function () {
      errorModal.classList.remove("fade");
   }, 1300);
   setTimeout(() => {
      errorModal.style.display = "none";
   }, 1000);
}

function filterEvents() {
   let input = document.querySelector(".event__search");
   let filter = input.value.toUpperCase();
   let table = document.querySelector(".events__output");
   tr = table.getElementsByTagName("tr");
   for (i = 0; i < tr.length; i++) {
      td = tr[i].getElementsByTagName("td")[0];
      if (td) {
         let textValue = td.textContent || td.innerText;
         if (textValue.toUpperCase().indexOf(filter) > -1) {
            tr[i].style.display = "";
         } else {
            tr[i].style.display = "none";
         }
      }
   }
}

function refDashboard() {
   let hrefA = document.getElementById("logoutPage");
   hrefA.onclick = () => {
      location.href = path.join(__dirname, "../../login.html");
   };
   let data = document.getElementById("user_data");
   data.innerHTML = `
		<h2>Hi ${USERDATA.student_fname}. You have ${USERDATA.points} points.</h2>
		${USERDATA.username}
`;
}
refDashboard();
let AccsTest;
function updateAccounts() {
   fetch(path.join(__dirname, "../database/users.json"))
      .then(function (res) {
         return res.json();
      })
      .then(function (leaderboardUsers) {
         console.log(leaderboardUsers);
         leaderboardUsers.sort((a, b) => {
            return b.points - a.points;
         });
         console.log(leaderboardUsers);
         AccsTest = leaderboardUsers;
         let placeholder = document.querySelector(".accounts__output");
         let output = "";
         for (account of leaderboardUsers) {
            if (account.admin) {
               continue;
            } else {
               output += `
				<tr>
				   <td>${account.student_fname}</td>
				   <td>${account.student_lname}</td>
				   <td>${account.student_grade}</td>
				   <td>${account.username}</td>
				   <td>${account.points}</td>
				</tr>
			 `;
            }
         }
         placeholder.innerHTML = output;

         return leaderboardUsers;
      });
}
updateAccounts();
document.getElementById("toggleLeaderboard").addEventListener("click", () => {
   let lead = document.querySelector(".accounts__holder");
   let currentDisplay = lead.style.display;
   lead.style.display = currentDisplay == "none" ? "block" : "none";
});
document.getElementById("togglePE").addEventListener("click", () => {
   let lead = document.querySelector(".popular");
   let currentDisplay = lead.style.display;
   lead.style.display = currentDisplay == "none" ? "block" : "none";
});
function toggleAccounts() {
   let accountsWindow = document.querySelector(".accounts__holder");
   accountsWindow.style.display =
      accountsWindow.style.display == "none" ? "block" : "none";
}

function PET() {
   let accountsWindow = document.querySelector(".popular");
   accountsWindow.style.display =
      accountsWindow.style.display == "none" ? "block" : "none";
}
function filterAccountsByName() {
   let input = document.querySelector(".account__search");
   let filter = input.value.toUpperCase();
   let table = document.querySelector(".accounts__output");
   tr = table.getElementsByTagName("tr");
   for (i = 0; i < tr.length; i++) {
      td = tr[i].getElementsByTagName("td")[0];
      if (td) {
         let textValue = td.textContent || td.innerText;
         if (textValue.toUpperCase().indexOf(filter) > -1) {
            tr[i].style.display = "";
         } else {
            tr[i].style.display = "none";
         }
      }
   }
}
const checkboxes = document.querySelectorAll('input[name="grade"]');
let selectedGrades = [];

for (let checkbox of checkboxes) {
   checkbox.addEventListener("change", function () {
      if (checkbox.checked) {
         selectedGrades.push(checkbox.value);
      } else {
         let index = selectedGrades.indexOf(checkbox.value);
         if (index > -1) {
            selectedGrades.splice(index, 1);
         }
      }
      filterAccountsByGrade(selectedGrades);
   });
}

function filterAccountsByGrade(boxes) {
   if (boxes.length == 0) boxes = ["9", "10", "11", "12"];
   let table = document.querySelector(".accounts__output");
   tr = table.getElementsByTagName("tr");
   for (i = 0; i < tr.length; i++) {
      td = tr[i].getElementsByTagName("td")[2];
      if (td) {
         let textValue = td.textContent || td.innerText;
         if (boxes.includes(textValue)) {
            tr[i].style.display = "";
         } else {
            tr[i].style.display = "none";
         }
      }
   }
}

function evs() {
   fetch(path.join(__dirname, "../database/events.json"))
      .then(function (response) {
         return response.json();
      })
      .then(function (events) {
         let placeholder = document.querySelector(".evs");
         let output = "";
         let buttonHTML = "";
         USERDATA = getUserDetails();
         let i = 0;
         for (let event of events) {
            if (i % 2 == 0) {
               console.log(USERDATA);
               if (Date.now() < Date.parse(event.start_date)) {
                  buttonHTML = "-";
               } else if (event.participants.includes(USERDATA.username)) {
                  buttonHTML = `<input type="button" onclick="updateAttendance('${event.event_name}', false)" value="Unregister">`;
               } else {
                  buttonHTML = `<input type="button" onclick="updateAttendance('${event.event_name}', true)" value="Register">`;
               }
               output += `
				<tr>
				   <td>${event.event_name}</td>
				   <td>${event.event_description}</td>
				   <td>${event.prize}</td>
				   <td>${event.start_date}</td>
				   <td>${event.end_date}</td>
				   <td>
					  <!--<div class="button__bar">-->
					  ${buttonHTML}
					  <!--</div>-->
				   </td>
				</tr>
			 `;
            }
            i++;
         }
         placeholder.innerHTML = output;
      });
}

evs();

// function showMail() {

// }
