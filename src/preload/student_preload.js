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
				if (event.participants.includes(USERDATA.username)) {
					buttonHTML = `<input type="button" onclick="updateAttendance('${event.event_name}', false)" value="Not Here!">`;
				} else {
					buttonHTML = `<input type="button" onclick="updateAttendance('${event.event_name}', true)" value="Here!">`;
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
	let events = readFromJSON(path.join(__dirname, "../database/events.json"));
	let event;
	for (let e of events) {
		if (e.event_name == eventName) {
			event = e;
			if (attend) {
				e.participants.push(USERDATA.username);
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
let hrefA = document.getElementById("logoutPage");
hrefA.href = path.join(__dirname, "../../login.html");
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

let data = document.getElementById("user_data");
data.innerHTML = `
		<h2>Hi ${USERDATA.student_fname}. You have ${USERDATA.points}.</h2>
		${USERDATA.username}
`;
