// Importing required modules
const path = require("path");
const fs = require("fs");
const fb = require("../../firebaseHelper");
const bcrypt = require("bcryptjs");
// Function to read data from a JSON file
function readFromJSON(file) {
	return JSON.parse(fs.readFileSync(file));
}
let schoolId = localStorage.getItem("schoolId");
let userEmail = localStorage.getItem("email");
let USERDATA;

async function updateUserData() {
	USERDATA = await fb.getUserByEmail(schoolId, userEmail);
	console.log(USERDATA);
	return USERDATA;
}
updateUserData();
async function changePwd() {
	const currentPasswordInput = document.getElementById("cP").value;
	let user = await fb.getUserByEmail(schoolId, userEmail);
	if (!bcrypt.compareSync(currentPasswordInput, user.password)) {
		errorPopup("Wrong Password", "Enter the correct current password!");
		return;
	}
	const newPasswordInput = document.getElementById("nP").value;
	const confirmNewPasswordInput = document.getElementById("cnP").value;

	if (
		!currentPasswordInput ||
		!newPasswordInput ||
		!confirmNewPasswordInput
	) {
		errorPopup("Missing Information", "Make sure all fields are entered!");
		return;
	}

	if (newPasswordInput !== confirmNewPasswordInput) {
		errorPopup("Password Mismatch", "The new passwords do not match!");
		return;
	}

	bcrypt.genSalt(10, async (err, salt) => {
		bcrypt.hash(newPasswordInput, salt, async (err, hash) => {
			let suc = await fb.updateUser(schoolId, user.id, {
				password: hash,
			});
			if (suc)
				alertPopup(
					"Password Changed",
					"Successfully changed the password!"
				);
		});
	});

	document.getElementById("cP").value = "";
	document.getElementById("nP").value = "";
	document.getElementById("cnP").value = "";
}
// Function to write data to a JSON file
function writeToJSON(file, data) {
	fs.writeFileSync(file, JSON.stringify(data, null, 2), {
		encoding: "utf-8",
		flag: "w",
	});
	console.log(`Wrote ${data} to ${file}`);
}

// Function to populate the select options by fetching events.json file and using it to make html options control element with the different event names
async function updateEvents() {
	let events = await fb.loadEvents(schoolId);
	let placeholder = document.querySelector(".events__output");
	let output = "";
	let buttonHTML = "";

	for (let event of events) {
		if (Date.now() < event.startDate) {
			buttonHTML = "-";
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
function updateAttendance(eventId, attend) {
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

async function backendUpdateAttendance(eventId, attend, code = "") {
	updateUserData();
	let event = await fb.getEventById(schoolId, eventId);
	/**
	 * @type {Array}
	 */
	let participantsList = event.participants;
	let eventsList = USERDATA.events;
	if (attend) {
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
               <td>${account.username}</td>
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

async function evs() {
	let events = await fb.loadEvents(schoolId);
	let placeholder = document.querySelector(".evs");
	let output = "";
	let buttonHTML = "";
	await updateUserData();
	let i = 0;
	for (let event of events) {
		if (i % 2 == 0) {
			console.log(USERDATA);
			if (Date.now() < event.startDate) {
				buttonHTML = "-";
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
					   <td>${event.startDate}</td>
					   <td>${event.endDate}</td>
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
}

evs();

// function showMail() {

// }
