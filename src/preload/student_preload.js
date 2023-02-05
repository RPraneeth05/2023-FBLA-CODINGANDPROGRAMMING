// Importing required modules
const path = require("path");
const fs = require("fs");
const bcrypt = require('bcryptjs');
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
	const data = fs.readFile(
		path.join(__dirname, '../database/jwt.txt'),
		'utf8',
		(err, data) => {
			if (err) {
				console.error(err);
				return;
			}
			const jwt = require('jsonwebtoken');
			USERDATA = jwt.decode(data);
		}
	)
}
getUserDetails();
// Function to populate the select options by fetching events.json file and using it to make html options control element with the different event names
function updateEvents() {
	fetch(path.join(__dirname, '../database/events.json'))
		.then(function (response) {
			return response.json();
		})
		.then(function (events) {
			let placeholder = document.querySelector('.events__output');
			let output = '';
			let buttonHTML = '';

			for (let event of events) {
				if (event.participants.includes(USERDATA.username)) {
					buttonHTML = 'Attended!'
				} else {
					buttonHTML = `<input type="button" onclick="updateAttendance('${event.event_name}')" value="Here!">`;
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
			 `
			}
			placeholder.innerHTML = output;
		});
}



// Calling the populateSelect function
updateEvents();

// Function to show the form
function addEvent() {
	let events = readFromJSON(path.join(__dirname, '../database/events.json'));
	let eventRequested;
	for (let event of events) {
		let selectedEvent = document.querySelector("event__options");
		if (event.event_name == selectedEvent) eventRequested
	}
	eventOut.innerHTML += `
	<tr>
	  <th> 
	</tr>
  `
	console.log(events);
}

function updateAttendance(eventName) {
	let events = readFromJSON(path.join(__dirname, '../database/events.json'));
	let event;
	for (let e of events) {
		if (e.event_name == eventName) {
			event = e;
			e.participants.push(USERDATA.username);
		}
	}
	writeToJSON(path.join(__dirname, '../database/events.json'), 
	events);
	let users = readFromJSON(path.join(
		__dirname,
		'../database/users.json'
	));
	for (let usr of users) {
		if (usr.username == USERDATA.username) {
			console.log(usr);
			console.log(usr.points);
			usr.points = Number(usr.points) + Number(event.prize);
			usr.events.push(eventName);
		}
	}
	writeToJSON(
		path.join(
			__dirname,
			'../database/users.json'),
		users
	);	
	updateEvents()
}

