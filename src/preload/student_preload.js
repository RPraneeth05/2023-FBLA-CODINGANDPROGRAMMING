const path = require("path");
const fs = require("fs");
const fb = require("../../firebaseHelper");
const bcrypt = require("bcryptjs");

let schoolId = localStorage.getItem("schoolId");
let userEmail = localStorage.getItem("email");
let USERDATA;

/**
 * Updates the user data. This is done by querying Facebook for the school id and user email.
 *
 *
 * @return { Object } USERDATA - The user data retrieved
 */
async function updateUserData() {
  USERDATA = await fb.getUserByEmail(schoolId, userEmail);
  console.log(USERDATA);
  return USERDATA;
}
updateUserData();
/**
 * Changes the password of the user. Checks if the current password matches the one entered in the form. If they don't it calls errorPopup
 *
 *
 * @return { Promise } If the password change was
 */
async function changePwd() {
  const currentPasswordInput = document.getElementById("cP").value;
  let user = await fb.getUserByEmail(schoolId, userEmail);
  // Check if the current password is correct
  if (!bcrypt.compareSync(currentPasswordInput, user.password)) {
    errorPopup("Wrong Password", "Enter the correct current password!");
    return;
  }
  const newPasswordInput = document.getElementById("nP").value;
  const confirmNewPasswordInput = document.getElementById("cnP").value;

  // Make sure all fields are entered
  if (!currentPasswordInput || !newPasswordInput || !confirmNewPasswordInput) {
    errorPopup("Missing Information", "Make sure all fields are entered!");
    return;
  }

  // if the new password input is not equal to the new password
  if (newPasswordInput !== confirmNewPasswordInput) {
    errorPopup("Password Mismatch", "The new passwords do not match!");
    return;
  }

  bcrypt.genSalt(10, async (err, salt) => {
    bcrypt.hash(newPasswordInput, salt, async (err, hash) => {
      let suc = await fb.updateUser(schoolId, user.id, {
        password: hash,
      });
      // This method is called when the password has changed.
      if (suc)
        alertPopup("Password Changed", "Successfully changed the password!");
    });
  });

  document.getElementById("cP").value = "";
  document.getElementById("nP").value = "";
  document.getElementById("cnP").value = "";
}
// Function to write data to a JSON file
/**
 * Writes data to a JSON file. This is a convenience function for writing to a file that is readable by humans and can be read by humans.
 *
 * @param file - The file to write to. Must be a path.
 * @param data - The data to write to the file as a JSON
 */
function writeToJSON(file, data) {
  fs.writeFileSync(file, JSON.stringify(data, null, 2), {
    encoding: "utf-8",
    flag: "w",
  });
  console.log(`Wrote ${data} to ${file}`);
}

// Function to populate the select options by fetching events.json file and using it to make html options control element with the different event names
/**
 * Updates the events on the page and inserts button to update attendance for each
 */
async function updateEvents() {
  let events = await fb.loadEvents(schoolId);
  let placeholder = document.querySelector(".events__output");
  let output = "";
  let buttonHTML = "";

  for (let event of events) {
    // Update the attendance button.
    if (Date.now() < event.startDate) {
      buttonHTML = "-";
      // Update the attendance button.
    } else if (event.participants.includes(USERDATA.email)) {
      buttonHTML = `<input type="button" onclick="updateAttendance('${event.id}', false)" value="I didn't attend">`;
    } else {
      buttonHTML = `<input type="button" onclick="updateAttendance('${event.id}', true)" value="I Attended">`;
    }
    output += `
				<tr>
				   <td>${event.eventName}</td>
				   <td>${event.eventDesc}</td>
				   <td>${event.prize}</td>
                  <td>${event.startDate.toDate().toLocaleDateString()}</td>
<td>${event.endDate.toDate().toLocaleDateString()}</td>
				   <td>
					  <!--<div class="button__bar">-->
					  ${buttonHTML}
					  <!--</div>-->
				   </td>
				</tr>
			 `;
  }
  placeholder.innerHTML = output;
}

// Calling the populateSelect function
updateEvents();
/**
 * Updates attendance of event. This function is called by backendUpdateAttendance () to update the attendance of an event
 *
 * @param eventId - The id of the event
 * @param attend - True if the event is
 */
function updateAttendance(eventId, attend) {
  // Update the attendance of the popup
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
    /**
     * / / object / list object is used to determine the type of object that is
     */
    /**
     * / / object / list to be used in a call to
     */
    submit.addEventListener("click", function () {
      let code = input.value;
      // Update attendance for the event.
      // Update attendance for the event.
      if (code) {
        popup.remove();
        backendUpdateAttendance(eventId, attend, code);
      }
    });
    popup.appendChild(submit);

    // Add the popup to the document
    document.body.appendChild(popup);
  } else {
    backendUpdateAttendance(eventId, attend);
  }
}

/**
 * Updates attendance of an event. This is called when the user clicks the attendance button in the form.
 *
 * @param eventId - ID of the event to attend to
 * @param attend - True if the event is attend false otherwise
 * @param code - Code of the event. Default is " "
 *
 * @return Promise resolved when the operation is complete. The value is a list of events
 */
async function backendUpdateAttendance(eventId, attend, code = "") {
  updateUserData();
  let event = await fb.getEventById(schoolId, eventId);
  /**
   * @type {Array}
   */
  let participantsList = event.participants;
  let eventsList = USERDATA.events;
  // Update the event to the user.
  if (attend) {
    // Checks if the event is the correct code.
    if (code != event.code) {
      errorPopup("Wrong code", "Type the correct code");
      return;
    }
    // not attended to attended
    participantsList.push(userEmail);
    await fb.updateEvent(schoolId, eventId, {
      participants: participantsList,
    });

    eventsList.push(eventId);
    await fb.updateUser(schoolId, USERDATA.id, {
      events: eventsList,
      points: Number(USERDATA.points) + Number(event.prize),
    });
  } else {
    await fb.updateEvent(schoolId, eventId, {
      participants: participantsList.filter((i) => i != userEmail),
    });

    await fb.updateUser(schoolId, USERDATA.id, {
      events: eventsList.filter((i) => i != eventId),
      points: Number(USERDATA.points) - Number(event.prize),
    });
  }
  updateUserData();
  await updateEvents();
  await refDashboard();
}
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
 * This function is called when the user clicks on the login page. It updates the user data to reflect the data received
 */
async function refDashboard() {
  await updateUserData();
  // console.log(USERDATA);
  let hrefA = document.getElementById("logoutPage");
  hrefA.onclick = () => {
    location.href = path.join(__dirname, "../../login.html");
  };
  let data = document.getElementById("user_data");

  data.innerHTML = `
		<h2>Hi ${USERDATA.fname}. You have ${USERDATA.points} points.</h2>
      <br>
		${USERDATA.email}
`;
}
refDashboard();
/**
 * Loads and displays the users in the leaderboard. This is called when the user clicks on the account button.
 *
 *
 * @return { Promise } A promise that resolves when the accounts are
 */
async function updateAccounts() {
  let leaderboardUsers = await fb.loadUsers(schoolId);
  console.log(leaderboardUsers);
  leaderboardUsers.sort((a, b) => {
    return b.points - a.points;
  });
  console.log(leaderboardUsers);
  let placeholder = document.querySelector(".accounts__output");
  let output = "";
  for (account of leaderboardUsers) {
    output += `
				<tr>
				   <td>${account.fname}</td>
				   <td>${account.lname}</td>
				   <td>${account.grade}</td>
				   <td>${account.points}</td>
				</tr>
			 `;
  }
  placeholder.innerHTML = output;

  return leaderboardUsers;
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
/**
 * Toggles visibility of accounts window. This is called on clicking the " Show accounts " button
 */
function toggleAccounts() {
  let accountsWindow = document.querySelector(".accounts__holder");
  accountsWindow.style.display =
    accountsWindow.style.display == "none" ? "block" : "none";
}

/**
 * PET Show or Hides the accounts window in the popular style so it can be
 */
function PET() {
  let accountsWindow = document.querySelector(".popular");
  accountsWindow.style.display =
    accountsWindow.style.display == "none" ? "block" : "none";
}
/**
 * Filter accounts by name in the account list and hide / show them based on
 */
function filterAccountsByName() {
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
const checkboxes = document.querySelectorAll('input[name="grade"]');
let selectedGrades = [];

for (let checkbox of checkboxes) {
  /**
   * a / object / string / number. This is a generic method for use with any
   */
  checkbox.addEventListener("change", function () {
    // Add a checkbox to the list of selected grades.
    if (checkbox.checked) {
      selectedGrades.push(checkbox.value);
    } else {
      let index = selectedGrades.indexOf(checkbox.value);
      // Removes the selected grades from the list.
      if (index > -1) {
        selectedGrades.splice(index, 1);
      }
    }
    filterAccountsByGrade(selectedGrades);
  });
}

/**
 * Filter accounts by grade. This is used to hide / show boxes that don't belong to the user
 *
 * @param boxes - array of boxes to
 */
function filterAccountsByGrade(boxes) {
  // Returns the list of boxes in the box list.
  if (boxes.length == 0) boxes = ["9", "10", "11", "12"];
  let table = document.querySelector(".accounts__output");
  tr = table.getElementsByTagName("tr");
  // This method will display the text of all the boxes in the table.
  for (i = 0; i < tr.length; i++) {
    td = tr[i].getElementsByTagName("td")[2];
    // Set the display of the text box.
    if (td) {
      let textValue = td.textContent || td.innerText;
      // If the text value is in the box s text value set the display to none.
      if (boxes.includes(textValue)) {
        tr[i].style.display = "";
      } else {
        tr[i].style.display = "none";
      }
    }
  }
}

/**
 * Loads and displays event list for the school. This is the page that appears when user clicks on the EVS button
 */
async function evs() {
  let events = await fb.loadEvents(schoolId);
  events = events.filter((i) => i.participants);
  events.sort((a, b) => b.participants.length - a.participants.length);
  let placeholder = document.querySelector(".evs");
  let output = "";
  let buttonHTML = "";
  await updateUserData();
  for (let event of events) {
    // Update the attendance button.
    if (Date.now() < event.startDate) {
      buttonHTML = "-";
      // Update the attendance button.
    } else if (event.participants.includes(USERDATA.email)) {
      buttonHTML = `<input type="button" onclick="updateAttendance('${event.id}', false)" value="I didn't attend">`;
    } else {
      buttonHTML = `<input type="button" onclick="updateAttendance('${event.id}', true)" value="I Attended">`;
    }
    output += `
					<tr>
					   <td>${event.eventName}</td>
					   <td>${event.eventDesc}</td>
					   <td>${event.prize}</td>
					   <td>${event.startDate.toDate().toLocaleDateString()}</td>
					   <td>${event.endDate.toDate().toLocaleDateString()}</td>
					   <td>${event.participants.length}</td>
					   <td>
						  <!--<div class="button__bar">-->
						  ${buttonHTML}
						  <!--</div>-->
					   </td>
					</tr>
				 `;
  }
  placeholder.innerHTML = output;
}

evs();

// function showMail() {

// }
