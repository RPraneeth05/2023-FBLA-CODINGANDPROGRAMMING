const path = require("path");
const fb = require("../../firebaseHelper");
const bcrypt = require("bcryptjs");
const salt = bcrypt.genSaltSync(10);

let schoolId = localStorage.getItem("schoolId");

// Function to handle changing the password
/**
* Changes the password of the school and checks if the password is correct.
* 
* 
* @return { Promise } Resolves when the change is done
*/
async function changePwd() {
   const currentPasswordInput = document.getElementById("CP").value;
   let school = await fb.getSchoolById(schoolId);
   // Check if the current password is correct
   if (!bcrypt.compareSync(currentPasswordInput, school.adminPass)) {
      errorPopup("Wrong Password", "Enter the correct current password!");
      return;
   }
   const newPasswordInput = document.getElementById("NP").value;
   const confirmNewPasswordInput = document.getElementById("CNP").value;
   document.getElementById("CP").value = "";
   document.getElementById("NP").value = "";
   document.getElementById("CNP").value = "";
   // Make sure all fields are entered
   if (
      !currentPasswordInput ||
      !newPasswordInput ||
      !confirmNewPasswordInput
   ) {
      errorPopup("Missing Information", "Make sure all fields are entered!");
      return;
   }

   // if the new password input is not equal to the new password
   if (newPasswordInput !== confirmNewPasswordInput) {
      errorPopup("Password Mismatch", "The new passwords do not match!");
      return;
   }
   /**
   * Callback for when the password has been changed. Hashes the password and sends it to Firebase
   * 
   * @param err - The error that caused the function to run
   * @param salt - The salt to use for
   */
   bcrypt.genSalt(10, function (err, salt) {
      /**
      * Callback for when the password has been changed. This is called when the user clicks on the link in the password form
      * 
      * @param err - The error that triggered the function
      * @param hash - The hash of the password entered by the user
      */
      bcrypt.hash(newPasswordInput, salt, async function (err, hash) {
         await fb.changeAdminPassword(schoolId, hash);
         alertPopup(
            "Password Changed",
            "Successfully changed the password!"
         );
      });
   });
}

// Function to display an alert popup
/**
* Displays a pop - up alert. It takes 1500ms to fade the alert to full screen
* 
* @param title - The title of the alert
* @param description - The description of the alert ( text to be displayed
*/
function alertPopup(title = "Alert", description = "Sample alert text") {
   let alertModal = document.querySelector(".alert__box");
   alertModal.style.display = "block";
   document.querySelector(".alert__title").innerHTML = title;
   document.querySelector(".alert__description").innerHTML = description;
   alertModal.classList.add("fade");
   /**
   * / / object / list to be used in a call to
   */
   setTimeout(function () {
      alertModal.classList.remove("fade");
   }, 700);
   setTimeout(() => {
      alertModal.style.display = "none";
   }, 1500);
}

// Function to display an warning popup
/**
* Shows a warning popup to the user. It takes 1500ms to fade the popup to fullscreen
* 
* @param title - The title of the popup
* @param description - The description of the popup ( optional if title
*/
function warningPopup(title = "Warning", description = "Sample warning text") {
   let warningModal = document.querySelector(".warning__box");
   warningModal.style.display = "block";
   document.querySelector(".warning__title").innerHTML = title;
   document.querySelector(".warning__description").innerHTML = description;
   warningModal.classList.add("fade");
   /**
   * / / object / list to be used in a call to
   */
   setTimeout(function () {
      warningModal.classList.remove("fade");
   }, 700);
   setTimeout(() => {
      warningModal.style.display = "none";
   }, 1500);
}

// Function to display an error popup
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
   * / / object / list to be used in a call to
   */
   setTimeout(function () {
      errorModal.classList.remove("fade");
   }, 1300);
   setTimeout(() => {
      errorModal.style.display = "none";
   }, 1000);
}

// change color of select dropdown on change
var selectThing = document.querySelector(".student__grade");
/**
* / / object / list object is used to determine the type of object that is
*/
selectThing.onchange = function () {
   selectThing.style.color = selectThing.value === "0" ? "#777" : "#aaa";
};

// change color of date picker on change
let startDateCol = document.querySelector(".start__date");
let endDateCol = document.querySelector(".end__date");
startDateCol.style.color = startDateCol.value !== "" ? "#aaa" : "#777"; // Change color based on whether a value is selected or not
endDateCol.style.color = endDateCol.value !== "" ? "#aaa" : "#777"; // Change color based on whether a value is selected or not
/**
* / / object / string. This is a bit complex. We need to be able to pass a string to the object
*/
startDateCol.onchange = function () {
   startDateCol.style.color = startDateCol.value !== "" ? "#aaa" : "#777"; // Change color based on whether a value is selected or not
};
/**
* / / object / list object is used to determine the type of object that is
*/
endDateCol.onchange = function () {
   endDateCol.style.color = endDateCol.value !== "" ? "#aaa" : "#777"; // Change color based on whether a value is selected or not
};

/**
* Toggles the visibility of the events window. This is called on load
*/
function toggleEvents() {
   let eventsWindow = document.querySelector(".events__holder");
   eventsWindow.style.display =
      eventsWindow.style.display == "none" ? "block" : "none"; // Toggle the display of the events window
}

/**
* Toggles the display of the accounts window. This is called on clicking the " Show accounts " button
*/
function toggleAccounts() {
   let accountsWindow = document.querySelector(".accounts__holder");
   accountsWindow.style.display =
      accountsWindow.style.display == "none" ? "block" : "none"; // Toggle the display of the accounts window
}

textarea = document.querySelector(".auto__resize");
textarea.addEventListener("input", autoResize, false);

/**
* This function is called when the user resizes the textarea to auto size its
*/
function autoResize() {
   this.style.height = "auto";
   this.style.height = this.scrollHeight + "px"; // Auto resize the textarea based on its content
}
// Function to update events in the HTML
/**
* Updates the events table with the data from FB and inserts it into the
*/
async function updateEvents() {
   let events = await fb.loadEvents(schoolId);

   let placeholder = document.querySelector(".events__output");
   let output = "";
   for (let event of events) {
      output += `
               <tr>
                  <td>${event.eventName}</td>
                  <td>${event.eventDesc}</td>
                  <td>${event.prize}</td>
                  <td>${event.startDate.toDate().toLocaleDateString()}</td>
<td>${event.endDate.toDate().toLocaleDateString()}</td>

				  <td>${event.code}</td>
                  <td>
                     <!--<div class="button__bar">-->
                        <!--<input type="button" onclick="editEvent()" value="Edit">-->
                        <input type="button" onclick="deleteEvent('${event.id}')" value="Delete">
                        <input type="button" onclick="showParticipants('${event.id}')" value="Show Participants">
                     <!--</div>-->
                  </td>
               </tr>
               `; // Generate HTML for each event and append to the output
            }
            placeholder.innerHTML = output;
            document.getElementById("totalEvents").innerHTML = events.length; // Update the total number of events
}

// call the function
updateEvents();
async function showParticipants(eventId) {
   let participants = (await fb.getEventById(schoolId, eventId)).participants;
   document.querySelector('#parsEvs').style.display = "block";


   let table = document.getElementById("pTT");
   table.innerHTML = `
         <thead>
            <tr>
               <th>Email</th>
            </tr>
         </thead>
   `;
   participants.forEach((i) => table.innerHTML += `<tr><td>${i}</td></tr>`);
}
/**
* Updates the accounts page with the accounts from FB and inserts them into the
*/
async function updateAccounts() {
   let accounts = await fb.loadUsers(schoolId);
   let placeholder = document.querySelector(".accounts__output");
   let output = "";
   for (let account of accounts) {
      output += `
               <tr>
                  <td>${account.fname}</td>
                  <td>${account.lname}</td>
                  <td>${account.grade}</td>
                  <td>${account.email}</td>
                  <td>${account.points}</td>
                  <td>
                     <!--<input type="button" onclick="editAccount()" value="Edit">-->
                     <input type="button" onclick="deleteAccount('${account.id}')" value="Delete">
                     <a href="#the__top">
                        <input type="button" onclick="generateReport('${account.email}')" value="Generate report">
                     </a>
                  </td>
               </tr>
            `; // Generate HTML for each account and append to the output
   }
   placeholder.innerHTML = output;
   document.getElementById("totalStudents").innerHTML = accounts.length; // Update the total number of students
}

/**
* Hides the report window from the user's experience. This is called on clicking the report button
*/
function hideReport() {
   document.querySelector(".report__window").style.display = "none";  // Hide the report window
}
function hideParticipants() {
   document.querySelector("#parsEvs").style.display = "none";
}

/**
* Deletes the account with the specified ID from the user's school.
* 
* @param id - The ID of the account to delete from the School
*/
async function deleteAccount(id) {
   await fb.deleteUser(schoolId, id); // Delete the account with the specified ID
   updateAccounts(); // Update the accounts list
}
/**
* Loads the school and fills in the editable cells with prizes from the
*/
document.addEventListener("DOMContentLoaded", async function () {
   var editableCells = document.getElementsByClassName("editable");
   let school = await fb.getSchoolById(schoolId);
   // Update the fields in the school document
   for (var i = 0; i < editableCells.length; i++) {
      let id = editableCells[i].id;
      // Set the initial value of each editable cell to the corresponding prize from the school object
      editableCells[i].innerHTML = school.prizes[id] || "";
      /**
      * Creates and appends a text input to the cell being edited This is used to prevent double
      */
      editableCells[i].addEventListener("click", function () {
         var currentValue = this.innerHTML;
         var input = document.createElement("input");
         input.setAttribute("type", "text");
         input.value = currentValue;
         this.innerHTML = "";
         this.appendChild(input);
         input.focus();

         /**
         * Updates the cell in the school document based on the edited value. This function is called when the user edits a cell in the cell list.
         * 
         * @param e - The click event object for the cell that was
         */
         input.addEventListener("blur", async function (e) {
            var newValue = this.value;
            this.parentNode.innerHTML = newValue;


            // Determine the field name and value based on the cell being edited
            let fieldName = id;

            // Update the original fields in the school document
            if (newValue.trim() !== "") {

               // Load the school document to get the original fields information
               var school = await fb.getSchoolById(schoolId);
               // Update the fields in the school document
               if (school) {
                  var originalPrizes = school.prizes; // Assuming you want to update other fields as well

                  // Check if the 'prizes' field exists in the originalFields object
                  // If the original prizes are not already set
                  if (!originalPrizes) {
                     originalPrizes = {};
                  }

                  // Check if the fieldName exists within the 'prizes' field
                  // Clear the original prizing field.
                  if (!originalPrizes[fieldName]) {
                     originalPrizes[fieldName] = "";
                  }

                  originalPrizes[fieldName] = newValue;
                  console.log(originalPrizes);
                  // Call the updateSchool function to update the fields in the school document
                  await fb.updateSchool(schoolId, { prizes: originalPrizes });
               } else {
                  console.log("School not found.");
               }
            }
         });
      });
   }
});

const form = document.getElementById("quarter-form");
// Function to update the values for each quarter based on the data from the database
/**
* Updates the quarters for the school and displays the values in the
*/
async function updateQuarters() {
   let quarters = (await fb.getSchoolById(schoolId)).quarters;
   // Set the values for each quarter
   if (quarters) {
      // Set the values for each quarter
      document.getElementById("first-quarter-start").value = quarters.firstStartDate.toDate().toISOString().slice(0, 10);
      document.getElementById("first-quarter-end").value = quarters.firstEndDate.toDate().toISOString().slice(0, 10);
      document.getElementById("second-quarter-start").value = quarters.secondStartDate.toDate().toISOString().slice(0, 10);
      document.getElementById("second-quarter-end").value = quarters.secondEndDate.toDate().toISOString().slice(0, 10);
      document.getElementById("third-quarter-start").value = quarters.thirdStartDate.toDate().toISOString().slice(0, 10);
      document.getElementById("third-quarter-end").value = quarters.thirdEndDate.toDate().toISOString().slice(0, 10);
      document.getElementById("fourth-quarter-start").value = quarters.fourthStartDate.toDate().toISOString().slice(0, 10);
      document.getElementById("fourth-quarter-end").value = quarters.fourthEndDate.toDate().toISOString().slice(0, 10);


   }
}
updateQuarters();
// Add form submission event listener
form.addEventListener("submit", async function (event) {
   event.preventDefault();

   const firstStartDate = new Date(document.getElementById("first-quarter-start").value);
   const firstEndDate = new Date(document.getElementById("first-quarter-end").value);
   const secondStartDate = new Date(document.getElementById("second-quarter-start").value);
   const secondEndDate = new Date(document.getElementById("second-quarter-end").value);
   const thirdStartDate = new Date(document.getElementById("third-quarter-start").value);
   const thirdEndDate = new Date(document.getElementById("third-quarter-end").value);
   const fourthStartDate = new Date(document.getElementById("fourth-quarter-start").value);
   const fourthEndDate = new Date(document.getElementById("fourth-quarter-end").value);


   // Perform validation
   let isValid = true;
   let errorMessage = "";

   if (!firstStartDate || !firstEndDate || !secondStartDate || !secondEndDate ||
      !thirdStartDate || !thirdEndDate || !fourthStartDate || !fourthEndDate) {
      isValid = false;
      errorMessage = "Please provide all start and end dates.";
   // Checks if the quarter start date is before the end date.
   } else if (firstStartDate >= firstEndDate) {
      isValid = false;
      errorMessage = "First quarter start date must be before the end date.";
   // Checks if the quarter start date is before the end date.
   } else if (secondStartDate >= secondEndDate) {
      isValid = false;
      errorMessage = "Second quarter start date must be before the end date.";
   // Checks if the third quarter start date is before the end date.
   } else if (thirdStartDate >= thirdEndDate) {
      isValid = false;
      errorMessage = "Third quarter start date must be before the end date.";
   // Check if the fourth quarter start date is before the end date.
   } else if (fourthStartDate >= fourthEndDate) {
      isValid = false;
      errorMessage = "Fourth quarter start date must be before the end date.";
   // Validates that the quarter dates are valid.
   } else if (firstEndDate >= secondStartDate ||
      secondEndDate >= thirdStartDate ||
      thirdEndDate >= fourthStartDate) {
      isValid = false;
      errorMessage = "Invalid quarter dates! Ensure that each quarter ends before the next one starts.";
   }

   // Display the form and submit the form
   if (!isValid) {
      // Display validation error message
      errorPopup("Invalid Dates!", errorMessage);
      return;
   } else {
      // Validation passed, perform further processing or submit the form
      // ...

      // For demonstration purposes, display the captured dates in the console
      // Update the quarters data in the database with the new dates
      await fb.updateSchool(schoolId, {
         quarters: {
            firstEndDate,
            secondEndDate,
            thirdEndDate,
            fourthEndDate,
            firstStartDate,
            secondStartDate,
            thirdStartDate,
            fourthStartDate
         }
      });
      // Reset the form for the next entry
      form.reset();
      // Update the quarters display
      updateQuarters();
      // Perform winners calculation
      pickWinners();
   }
});

// Function to pick winners based on quarter end dates
/**
* Pick winners for prize. This is done by looking at quarters and prizes that are older than today.
* 
* 
* @return Promise resolved when done. Promises with DOM object
*/
async function pickWinners() {
   let prizeTable = document.getElementById("prize-table");
   prizeTable.style.display = "block"

   let school = await fb.getSchoolById(schoolId);
   let prizes = school.prizes;
   let quarters = school.quarters;
   let today = new Date().toISOString().slice(0, 10);
   let winnersDiv = document.getElementById("prizes");
   winnersDiv.hidden = true;
   let qEnds = document.getElementById("qEnds");
   let noEnds = true;
   // If quarters or prizes are not 5.
   if (!quarters || !prizes || Object.keys(prizes).length != 5) return
   for (let [key, val] of Object.entries(quarters)) {
      // Display the winner information for the school
      if (key.includes("End")) {
         // This method will calculate the winner for the school.
         if (val.toDate().toISOString().slice(0, 10) == today) {
            // do winner calculation

            noEnds = false;
            winnersDiv.hidden = false;
            let users = await fb.loadUsers(schoolId);
            let sortedUsers = users.sort((a, b) => b.points - a.points);
            let topFourUsers = sortedUsers.slice(0, 4);
            let randWinners = {};

            // randomly randomly picks random users from the list of users.
            for (let grade = 9; grade <= 12; grade++) {
               let filteredUsers = users.filter(user => user.grade === grade);
               let randomIndex = Math.floor(Math.random() * filteredUsers.length);
               randWinners[grade] = filteredUsers[randomIndex];
            }

            // Display the information of the random prize winners
            document.getElementById("rand9").innerHTML = `From grade 9, ${randWinners[9].fname} ${randWinners[9].lname} won ${prizes["randomPrize"]}`;
            document.getElementById("rand10").innerHTML = `From grade 10, ${randWinners[10].fname} ${randWinners[10].lname} won ${prizes["randomPrize"]}`;
            document.getElementById("rand11").innerHTML = `From grade 11, ${randWinners[11].fname} ${randWinners[11].lname} won ${prizes["randomPrize"]}`;
            document.getElementById("rand12").innerHTML = `From grade 12, ${randWinners[12].fname} ${randWinners[12].lname} won ${prizes["randomPrize"]}`;

            // Display the information of the top four winners in the desired format
            document.getElementById("pprize1").innerHTML = `First place: ${topFourUsers[0].fname} ${topFourUsers[0].lname} with ${topFourUsers[0].points} points won ${prizes.prize1}`;
            document.getElementById("pprize2").innerHTML = `Second place: ${topFourUsers[1].fname} ${topFourUsers[1].lname} with ${topFourUsers[1].points} points won ${prizes.prize2}`;
            document.getElementById("pprize3").innerHTML = `Third place: ${topFourUsers[2].fname} ${topFourUsers[2].lname} with ${topFourUsers[2].points} points won ${prizes.prize3}`;
            document.getElementById("pprize4").innerHTML = `Fourth place: ${topFourUsers[3].fname} ${topFourUsers[3].lname} with ${topFourUsers[3].points} points won ${prizes.prize4}`;

         }
      }
   }
   qEnds.innerHTML = noEnds ? "Quarter end is not today!" : "";
}

// Function to hide the winners table
/**
* Hides winners on page load. This is a workaround for bug #4
*/
function hideWinners() {
   let targetWindow = document.querySelector("#prize-table");
   targetWindow.style.display = "none";

}
function hidePointsSG() {
	document.getElementById('pointsSG').style.display='none';
}
async function pointsSG() {
   let users = await fb.loadUsers(schoolId);

   // Separate users into grade-specific arrays
   let grade9Users = [];
   let grade10Users = [];
   let grade11Users = [];
   let grade12Users = [];

   users.forEach(user => {
      if (user.grade === 9) {
         grade9Users.push(user);
      } else if (user.grade === 10) {
         grade10Users.push(user);
      } else if (user.grade === 11) {
         grade11Users.push(user);
      } else if (user.grade === 12) {
         grade12Users.push(user);
      }
   });

   // Sort users in each grade array based on points (assuming points is a numeric property)
   grade9Users.sort((a, b) => b.points - a.points);
   grade10Users.sort((a, b) => b.points - a.points);
   grade11Users.sort((a, b) => b.points - a.points);
   grade12Users.sort((a, b) => b.points - a.points);

   // Create the table HTML
   let tableHTML = `
      <table>
         <thead>
            <tr>
               <th>Grade 9</th>
               <th>Grade 10</th>
               <th>Grade 11</th>
               <th>Grade 12</th>
            </tr>
         </thead>
         <tbody>
            <tr>
               <td style='vertical-align: top'>${generateUserTable(grade9Users)}</td>
               <td style='vertical-align: top'>${generateUserTable(grade10Users)}</td>
               <td style='vertical-align: top'>${generateUserTable(grade11Users)}</td>
               <td style='vertical-align: top'>${generateUserTable(grade12Users)}</td>
            </tr>
         </tbody>
      </table>
   `;

   // Set the HTML content of tblPointsSG
   document.getElementById('tblPointsSG').innerHTML = tableHTML;
   document.getElementById('pointsSG').style.display = "block";
} 

// Helper function to generate the HTML table for a grade-specific user array
// Helper function to generate the HTML table for a grade-specific user array
// Helper function to generate the HTML table for a grade-specific user array
function generateUserTable(users) {
   let tableHTML = `
      <table style="margin-top: 0;">
         <thead>
            <tr>
               <th>Name</th>
               <th>Points</th>
            </tr>
         </thead>
         <tbody>
   `;

   users.forEach(user => {
      tableHTML += `
         <tr>
            <td style="vertical-align: top">${user.fname} ${user.lname}</td>
            <td style="vertical-align: top">${user.points}</td>
         </tr>
      `;
   });

   tableHTML += `
         </tbody>
      </table>
   `;

   return tableHTML;
}



// Function to generate a report for a user based on their email
/**
* Generates and displays the report for the user with the given email. This is a bit hacky but I don't know how to get it from Facebook
* 
* @param email - Email of the user to
*/
async function generateReport(email) {
   let user = await fb.getUserByEmail(schoolId, email);
   let win = document.querySelector(".report__window");
   win.style.display = "block";
   // console.log(win)
   console.log(user);
   document.querySelector(
      ".r__name"
   ).innerHTML = `${user.fname} ${user.lname}`;
   // document.querySelector('.r__events').innerHTML = acc.events

   let output = "";
   for (let eventId of user.events) {
      output += `
      <tr>
         <td>${(await fb.getEventById(schoolId, eventId)).eventName}</td>
      </tr>
      `;
   }
   document.querySelector(".r__events").innerHTML = output;

   document.querySelector(".r__points").innerHTML =
      user.points + " points";
   // console.log(events);
   // for (let i = 0; i < accs.length; i++) {
   //    if (accs[i].username === un) {
   //       accs.splice(i, 1)
   //       break;
   //    }
   // }
   // writeToJSON(path.join(__dirname, '../database/users.json'), accs);
   // updateAccounts();
}

updateAccounts();

// Function to create a new event
/**
* Creates a new event based on the user input. This function is called when the user clicks on the Add New Event button.
* 
* 
* @return Promise resolved when the operation is completed or rejected with an error
*/
async function createNewEvent() {
   let eventName = document.querySelector(".event__name").value;
   let eventDescription = document.querySelector(".event__description").value;
   let prize = document.querySelector(".prize").value;
   let code = document.querySelector(".code").value;
   let startDate = document.querySelector(".start__date").value;
   let endDate = document.querySelector(".end__date").value;

   // Error validation
   // Checks if the fields are present.
   if (
      eventName === "" ||
      eventDescription === "" ||
      prize === "" ||
      startDate === "" ||
      endDate === "" ||
      code === ""
   ) {
      warningPopup("Warning", "Empty fields present");
      return;
   // This method is called when the end date is less than the start date
   } else if (endDate < startDate) {
      warningPopup("Warning", "Invalid timespan");
      return;
   }

   // Add the event to the school database
   let event = await fb.addEventToSchool(
      schoolId,
      eventName,
      eventDescription,
      new Date(startDate),
      new Date(endDate),
      prize,
      code
   );

   // alerts the event created event popup
   if (event) {
      alertPopup("Event created!", `Event '${eventName}' created!`);
   }
   // Reset the input fields
   document.querySelector(".event__name").value = "";
   document.querySelector(".event__description").value = "";
   document.querySelector(".prize").value = "";
   document.querySelector(".start__date").value = "";
   document.querySelector(".end__date").value = "";

   // currentEvents.push(eventTemplate);
   // writeToJSON(EVENTS_JSON_PATH, currentEvents);

   await updateEvents();
   await updateAccounts();
}

/**
* Deletes an event from the school. This is a wrapper around fb. deleteEvent and updates the events and accounts on the page
* 
* @param id - The id of the event to
*/
async function deleteEvent(id) {
   await fb.deleteEvent(schoolId, id);

   await updateEvents();
   await updateAccounts();
   // let i = r.parentNode.parentNode.rowIndex;
   // document.querySelector('.events__output').deleteRow(i);
   // updateAccounts();
}

/**
* Creates a new account and adds it to the FB database. This function is called when the user clicks on the create account button.
* 
* 
* @return { Promise } Resolves to the newly created account
*/
async function createNewAccount() {
   const fname = document.querySelector(".student__fname").value;
   const lname = document.querySelector(".student__lname").value;
   const grade = document.querySelector(".student__grade").value;
   const email = document.querySelector(".student__username").value;
   const password = String(
      Math.floor(Math.random() * 90_000_000) + 10_000_000
   );

   // if fname lname grade email is empty
   if (!fname || !lname || !grade || !email) {
      warningPopup("Warning", "Empty fields present");
      return;
   }

   // Check if user with the same email already exists
   const existingUser = await fb.getUserByEmail(schoolId, email);
   // Checks if the user already exists.
   if (existingUser) {
      errorPopup(
         "User already exists!",
         "An account with the same email already exists."
      );
      return;
   }

   /**
   * Function called when the password is correct. Adds the user to the school and sends an email
   * 
   * @param err - The error that occured.
   * @param salt - The salt that was used to generate the password
   */
   bcrypt.genSalt(10, function (err, salt) {
      /**
      * Callback for when the user clicks on the link. Adds the user to the school and sends an email to the eventhive user
      * 
      * @param err - The error that occured when the function is called
      * @param hash - The hash of the user's password in clear
      */
      bcrypt.hash(password, salt, async function (err, hash) {
         // Add the new user to the school
         const newUser = await fb.addUserToSchool(
            schoolId,
            fname,
            lname,
            grade,
            email,
            hash
         );

         const mailLoad = {
            from: "eventhivefbla@gmail.com",
            to: email,
            subject: `EventHive User Credentials For ${email}.`,
            text: `Username: ${email}\nPassword: ${password}`,
         };

         /**
         * @param error - info The info for the email sent. null if no
         * @param info
         */
         fb.transporter.sendMail(mailLoad, function (error, info) {
            // Send email to the server.
            if (error) {
               console.log(error);
            } else {
               //   console.log('Email sent: ' + info.response);
            }
         });

         // Creates a new student account.
         if (newUser) {
            document.querySelector(".student__fname").value = "";
            document.querySelector(".student__lname").value = "";
            document.querySelector(".student__grade").value = "";
            document.querySelector(".student__username").value = "";
            // updateAccounts();
            alertPopup("Alert", "Student account created successfully");
         } else {
            errorPopup("Error", "Failed to create a new student account");
         }
      });
   });
   await updateEvents();
   await updateAccounts();
}

/**
* Filter events based on search string in table and show / hide them according to
*/
function filterEvents() {
   let input = document.querySelector(".event__search");
   let filter = input.value.toUpperCase();
   let table = document.querySelector(".events__output");
   tr = table.getElementsByTagName("tr");
   // This method will display all the text in the table.
   for (i = 0; i < tr.length; i++) {
      td = tr[i].getElementsByTagName("td")[0];
      // Set the display of the text in the table.
      if (td) {
         let textValue = td.textContent || td.innerText;
         // Set the display of the text value.
         if (textValue.toUpperCase().indexOf(filter) > -1) {
            tr[i].style.display = "";
         } else {
            tr[i].style.display = "none";
         }
      }
   }
}

/**
* Filter accounts based on search string in account text. This function is called on click
*/
function filterAccounts() {
   let input = document.querySelector(".account__search");
   let filter = input.value.toUpperCase();
   let table = document.querySelector(".accounts__output");
   tr = table.getElementsByTagName("tr");
   // This method will display all the text in the table.
   for (i = 0; i < tr.length; i++) {
      td = tr[i].getElementsByTagName("td")[0];
      // Set the display of the text in the table.
      if (td) {
         let textValue = td.textContent || td.innerText;
         // Set the display of the text value.
         if (textValue.toUpperCase().indexOf(filter) > -1) {
            tr[i].style.display = "";
         } else {
            tr[i].style.display = "none";
         }
      }
   }
}

/**
* Send message to selected recipient in form and save to database. This function is called when user clicks on send
*/
function sendMsg() {
   let recipient = document.querySelector(".recipient").value;
   let subjectText = document.querySelector(".subject").value;
   let messageText = document.querySelector(".message").value;
   let studentAccounts = readFromJSON(
      path.join(__dirname, "../database/users.json")
   );
   for (studentAccount of studentAccounts) {
      // console.log(studentAccount.emails)
      // Add a new email to the student account s emails list.
      if (studentAccount.username === recipient) {
         // console.log(studentAccount)
         studentAccount.emails.push({
            subject: subjectText,
            message: messageText,
         });
         // console.log(typeof studentAccount.emails)
         break;
      }
   }
   writeToJSON(
      path.join(__dirname, "../database/users.json"),
      studentAccounts
   );
}
let helpButton = document.getElementById("qm");
helpButton.addEventListener("click", (e) => {
   window.open("../main/chat.html");
});

var q1 = new Date("2/6/2023");
var q2 = new Date("2/6/2023");
var q3 = new Date("2/6/2023");
var q4 = new Date("2/6/2023");

window.setInterval(() => {
   var todaysDate = new Date();
   // picks the winners in the past
   if (
      q1.setHours(0, 0, 0, 0) == todaysDate.setHours(0, 0, 0, 0) ||
      q2.setHours(0, 0, 0, 0) == todaysDate.setHours(0, 0, 0, 0) ||
      q3.setHours(0, 0, 0, 0) == todaysDate.setHours(0, 0, 0, 0) ||
      q4.setHours(0, 0, 0, 0) == todaysDate.setHours(0, 0, 0, 0)
   ) {
      // pickWinners()
   }
   // pickWinners();
   // console.log(Date.now())
   // console.log(new Date())
}, 86400000);

/**
* popRecs ( schoolId ) Loads the list of recorens to populate the drop
*/
async function popRecs() {
   let recsList = await fb.loadUsers(schoolId);
   let recsSel = document.getElementById('populate__recipients');

   for (let user of recsList) {
      const selOption = document.createElement("option");
      selOption.value = user.email;
      selOption.text = user.fname + user.lname;
      recsSel.appendChild(selOption);
   }
}

popRecs();