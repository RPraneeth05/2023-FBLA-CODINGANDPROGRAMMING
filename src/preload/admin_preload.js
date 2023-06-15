const path = require("path");
const fs = require("fs");
const { table } = require("console");
const bcrypt = require("bcryptjs");
const salt = bcrypt.genSaltSync(10);

/**
 * Constants for paths for users.json and events.json
 * Prevents typos and errors as you can just refer to variable name
 * rather than exact path
 */
const USERS_JSON_PATH = path.join(__dirname, "../database/users.json");
const EVENTS_JSON_PATH = path.join(__dirname, "../database/events.json");


let hrefA = document.getElementById("logoutPage");
hrefA.href = path.join(__dirname, "../../login.html");
function readFromJSON(file) {
	return JSON.parse(fs.readFileSync(file));
}

function writeToJSON(file, data) {
	fs.writeFileSync(file, JSON.stringify(data, null, 2), {
		encoding: "utf-8",
		flag: "w",
	});
	console.log(`Wrote ${data} to ${file}`);
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
	errorModal.classList.add("fade ");
	setTimeout(function () {
		errorModal.classList.remove("fade");
	}, 1300);
	setTimeout(() => {
		errorModal.style.display = "none";
	}, 1000);
}

// change color of select dropdown on change
var selectThing = document.querySelector(".student__grade");
selectThing.onchange = function () {
	selectThing.style.color = selectThing.value === "0" ? "#777" : "#aaa";
};

// change color of date picker on change
let startDateCol = document.querySelector(".start__date");
let endDateCol = document.querySelector(".end__date");
startDateCol.style.color = startDateCol.value !== "" ? "#aaa" : "#777";
endDateCol.style.color = endDateCol.value !== "" ? "#aaa" : "#777";
startDateCol.onchange = function () {
	startDateCol.style.color = startDateCol.value !== "" ? "#aaa" : "#777";
};
endDateCol.onchange = function () {
	endDateCol.style.color = endDateCol.value !== "" ? "#aaa" : "#777";
};

function toggleEvents() {
	let eventsWindow = document.querySelector(".events__holder");
	eventsWindow.style.display =
		eventsWindow.style.display == "none" ? "block" : "none";
}

function toggleAccounts() {
	let accountsWindow = document.querySelector(".accounts__holder");
	accountsWindow.style.display =
		accountsWindow.style.display == "none" ? "block" : "none";
}

textarea = document.querySelector(".auto__resize");
textarea.addEventListener("input", autoResize, false);

function autoResize() {
	this.style.height = "auto";
	this.style.height = this.scrollHeight + "px";
}

function updateEvents() {
	fetch(EVENTS_JSON_PATH)
		.then(function (response) {
			return response.json();
		})
		.then(function (events) {
			let placeholder = document.querySelector(".events__output");
			let output = "";
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
                        <!--<input type="button" onclick="editEvent()" value="Edit">-->
                        <input type="button" onclick="deleteEvent('${event.event_name}')" value="Delete">
                     <!--</div>-->
                  </td>
               </tr>
            `;
			}
			placeholder.innerHTML = output;
		});
}

updateEvents();

function updateAccounts() {
	fetch(USERS_JSON_PATH)
		.then(function (res) {
			return res.json();
		})
		.then(function (accounts) {
			console.log(accounts);
			let placeholder = document.querySelector(".accounts__output");
			let output = "";
			for (account of accounts) {
				if (account.admin) {
					output += `
               <tr>
                  <td>${account.fname}</td>
                  <td>${account.lname}</td>
                  <td></td>
                  <td>${account.username}</td>
                  <td></td>
                  <!--<td>
                     <input type="button" onclick="editAccount()" value="Edit">
                     <input type="button" onclick="deleteAccount()" value="Delete">
                  </td>-->
                  <td>ADMIN</td>
               </tr>
            `;
				} else {
					output += `
               <tr>
                  <td>${account.student_fname}</td>
                  <td>${account.student_lname}</td>
                  <td>${account.student_grade}</td>
                  <td>${account.username}</td>
                  <td>${account.points}</td>
                  <td>
                     <!--<input type="button" onclick="editAccount()" value="Edit">-->
                     <input type="button" onclick="deleteAccount('${account.username}')" value="Delete">
                     <a href="#the__top">
                        <input type="button" onclick="generateReport('${account.username}')" value="Generate report">
                     </a>
                  </td>
               </tr>
            `;
				}
			}
			placeholder.innerHTML = output;
		});
}

function hideWin() {
	document.querySelector(".report__window").style.display = "none";
}

function deleteAccount(un) {
	let accs = readFromJSON(USERS_JSON_PATH);
	for (let i = 0; i < accs.length; i++) {
		if (accs[i].username === un) {
			accs.splice(i, 1);
			break;
		}
	}
	writeToJSON(USERS_JSON_PATH, accs);
	updateAccounts();
}

function pickWinners() {
	let accs = readFromJSON(USERS_JSON_PATH);
	let ninthUsers = [];
	let tenthUsers = [];
	let eleventhUsers = [];
	let twelfthUsers = [];
	for (acc of accs) {
		if (acc.student_grade === "9") ninthUsers.push(acc);
		else if (acc.student_grade === "10") tenthUsers.push(acc);
		else if (acc.student_grade === "11") eleventhUsers.push(acc);
		else if (acc.student_grade === "12") twelfthUsers.push(acc);
	}
	let winner9 = ninthUsers[Math.floor(Math.random() * ninthUsers.length)];
	let winner10 = tenthUsers[Math.floor(Math.random() * tenthUsers.length)];
	let winner11 =
		eleventhUsers[Math.floor(Math.random() * eleventhUsers.length)];
	let winner12 =
		twelfthUsers[Math.floor(Math.random() * twelfthUsers.length)];

	let a = "<strong>Yearlong free tickets to all games!</strong>";
	let b = "<strong>$15 Chick-fil-A gift card</strong>";
	let c = "<strong>1 Homework Pass</strong>";
	let d = "<strong>Football team T-Shirt</strong>";
	let targetWindow = document.querySelector(".winners__window");
	targetWindow.style.display = "block";
	document.querySelector(
		".ninth__winner"
	).innerHTML = `<strong>${winner9.student_fname} ${winner9.student_lname} (${winner9.points} points)</strong>`;
	if (winner9.points >= 10000) {
		document.querySelector(".ninth__prize").innerHTML = a;
	} else if (winner9.points >= 7500) {
		document.querySelector(".ninth__prize").innerHTML = b;
	} else if (winner9.points >= 5000) {
		document.querySelector(".ninth__prize").innerHTML = c;
	} else {
		document.querySelector(".ninth__prize").innerHTML = d;
	}

	document.querySelector(
		".tenth__winner"
	).innerHTML = `<strong>${winner10.student_fname} ${winner10.student_lname} (${winner10.points} points)</strong>`;
	if (winner10.points >= 10000) {
		document.querySelector(".tenth__prize").innerHTML = a;
	} else if (winner10.points >= 7500) {
		document.querySelector(".tenth__prize").innerHTML = b;
	} else if (winner10.points >= 5000) {
		document.querySelector(".tenth__prize").innerHTML = c;
	} else {
		document.querySelector(".tenth__prize").innerHTML = d;
	}

	document.querySelector(
		".eleventh__winner"
	).innerHTML = `<strong>${winner11.student_fname} ${winner11.student_lname} (${winner11.points} points)</strong>`;
	if (winner11.points >= 10000) {
		document.querySelector(".eleventh__prize").innerHTML = a;
	} else if (winner11.points >= 7500) {
		document.querySelector(".eleventh__prize").innerHTML = b;
	} else if (winner11.points >= 5000) {
		document.querySelector(".eleventh__prize").innerHTML = c;
	} else {
		document.querySelector(".eleventh__prize").innerHTML = d;
	}

	document.querySelector(
		".twelfth__winner"
	).innerHTML = `<strong>${winner12.student_fname} ${winner12.student_lname} (${winner12.points} points)</strong>`;
	if (winner12.points >= 10000) {
		document.querySelector(".twelfth__prize").innerHTML = a;
	} else if (winner12.points >= 7500) {
		document.querySelector(".twelfth__prize").innerHTML = b;
	} else if (winner12.points >= 5000) {
		document.querySelector(".twelfth__prize").innerHTML = c;
	} else {
		document.querySelector(".twelfth__prize").innerHTML = d;
	}
	/** @type Array */
	let arr = readFromJSON(USERS_JSON_PATH);
	let max = arr[1];
	for (let i of arr.slice(1)) {
		if (i.points > max.points) max = i;
	}
	console.log(max);
	document.querySelector(
		".top__winner"
	).innerHTML = `<strong>${max.student_fname} ${max.student_lname}  (${max.points} points)</strong>`;
	document.querySelector(".top__prize").innerHTML = "<strong>$100 Visa Gift Card</strong>";

}

function hideWinners() {
	let targetWindow = document.querySelector(".winners__window");
	targetWindow.style.display = "none";
}

function generateReport(un) {
	let users = readFromJSON(path.join(__dirname, "../database/users.json"));
	let targetUser;
	for (let usr of users) {
		if (usr.username === un) {
			targetUser = usr;
			break;
		}
	}
	let win = document.querySelector(".report__window");
	win.style.display = "block";
	// console.log(win)
	console.log(targetUser);
	document.querySelector(
		".r__name"
	).innerHTML = `${targetUser.student_fname} ${targetUser.student_lname}`;
	// document.querySelector('.r__events').innerHTML = acc.events

	let output = "";
	for (accEvent of targetUser.events) {
		console.log(accEvent);
		output += `
      <tr>
         <td>${accEvent}</td>
      </tr>
      `;
	}
	document.querySelector(".r__events").innerHTML = output;

	document.querySelector(".r__points").innerHTML =
		targetUser.points + " points";
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

function createNewEvent() {
	let currentEvents = readFromJSON(EVENTS_JSON_PATH);
	let eventName = document.querySelector(".event__name").value;
	let eventDescription = document.querySelector(".event__description").value;
	let prize = document.querySelector(".prize").value;
	let code = document.querySelector(".code").value;
	let startDate = document.querySelector(".start__date").value;
	let endDate = document.querySelector(".end__date").value;

	// error validation
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
	} else if (endDate < startDate) {
		warningPopup("Warning", "Invalid timespan");
		return;
	}

	// date formatting
	startDate = startDate.split("-");
	endDate = endDate.split("-");
	startDate = `${startDate[1]}/${startDate[2]}/${startDate[0]}`;
	endDate = `${endDate[1]}/${endDate[2]}/${endDate[0]}`;

	let eventTemplate = {
		event_name: eventName,
		event_description: eventDescription,
		prize: prize,
		start_date: startDate,
		end_date: endDate,
		code: code,
		participants: [],
	};

	document.querySelector(".event__name").value = "";
	document.querySelector(".event__description").value = "";
	document.querySelector(".prize").value = "";
	document.querySelector(".start__date").value = "";
	document.querySelector(".end__date").value = "";

	currentEvents.push(eventTemplate);
	writeToJSON(EVENTS_JSON_PATH, currentEvents);

	alertPopup("Event created!", `Event '${eventName}' created!`);
	updateEvents();
}

function editEvent() { }

function deleteEvent(name) {
	// console.log(name)
	let events = readFromJSON(EVENTS_JSON_PATH);
	// console.log(events);
	for (let i = 0; i < events.length; i++) {
		// console.log(events[i].event_name)
		if (events[i].event_name === name) {
			// delete events[i];
			events.splice(i, 1);
			break;
		}
	}
	writeToJSON(EVENTS_JSON_PATH, events);
	updateEvents();
	// let i = r.parentNode.parentNode.rowIndex;
	// document.querySelector('.events__output').deleteRow(i);
	// updateAccounts();
}
function createNewAccount() {
	const fname = document.querySelector(".student__fname").value;
	const lname = document.querySelector(".student__lname").value;
	const grade = document.querySelector(".student__grade").value;
	const username = document.querySelector(".student__username").value;
	const password = document.querySelector(".student__password").value;
	const alertBox = document.querySelector(".warning__box");

	// In JS, an empty string is false. Therefore, not empty string is true.
	// So, we can use a boolean expression like the following
	// to make sure all the fields are full
	// without making the code look messy
	if (!fname || !lname || !grade || !username || !password) {
		warningPopup("Warning", "Empty fields present");
		return;
	}
	// Checks if password length is less than 8 characters
	if (password.length < 8) {
		warningPopup(
			"Password",
			"Password length has to be atleast 8 characters"
		);
		return;
	}
	// Checks if username already exists
	const currentUsers = readFromJSON(USERS_JSON_PATH);
	for (let usr of currentUsers) {
		if (usr.username == username) {
			errorPopup(
				"User already exists!",
				"Username has to be unique for all students."
			);
			return;
		}
	}
	let key = Math.floor(Math.random() * 1000000);
	function uniqueKey() {
		for (let usr of currentUsers) {
			if (usr.key == key) {
				key = Math.floor(Math.random() * 1000000);
				uniqueKey();
			}
		}
		return;
	}
	uniqueKey();
	bcrypt.genSalt(10, function (err, salt) {
		bcrypt.hash(password, salt, function (err, hash) {
			const hashedPassword = hash;

			const newStudent = {
				key: key,
				student_fname: fname,
				student_lname: lname,
				student_grade: grade,
				username: username,
				password: hashedPassword,
				points: 0,
				admin: false,
				events: [],
				emails: [],
			};
			currentUsers.push(newStudent);
			writeToJSON(USERS_JSON_PATH, currentUsers);
			document.querySelector(".student__fname").value = "";
			document.querySelector(".student__lname").value = "";
			document.querySelector(".student__grade").value = "";
			document.querySelector(".student__username").value = "";
			document.querySelector(".student__password").value = "";
			updateAccounts();
		});
	});
	alertPopup("Alert", "Student account created successfully");
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

function filterAccounts() {
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

function sendMsg() {
	let recipient = document.querySelector(".recipient").value;
	let subjectText = document.querySelector(".subject").value;
	let messageText = document.querySelector(".message").value;
	let studentAccounts = readFromJSON(
		path.join(__dirname, "../database/users.json")
	);
	for (studentAccount of studentAccounts) {
		// console.log(studentAccount.emails)
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
