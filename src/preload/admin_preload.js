const path = require("path");
const fb = require("../../firebaseHelper");
const bcrypt = require("bcryptjs");
const salt = bcrypt.genSaltSync(10);

let schoolId = localStorage.getItem("schoolId");
async function changePwd() {
	const currentPasswordInput = document.getElementById("cP").value;
	let school = await fb.getSchoolById(schoolId);
	if (!bcrypt.compareSync(currentPasswordInput, school.adminPass)) {
		errorPopup("Wrong Password", "Enter the correct current password!");
		return;
	}
	const newPasswordInput = document.getElementById("nP").value;
	const confirmNewPasswordInput = document.getElementById("cnP").value;
	document.getElementById("cP").value = "";
	document.getElementById("nP").value = "";
	document.getElementById("cnP").value = "";
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
	bcrypt.genSalt(10, function (err, salt) {
		bcrypt.hash(newPasswordInput, salt, async function (err, hash) {
			await fb.changeAdminPassword(schoolId, hash);
			alertPopup(
				"Password Changed",
				"Successfully changed the password!"
			);
		});
	});
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
                     <!--</div>-->
                  </td>
               </tr>
            `;
	}
	placeholder.innerHTML = output;
}

updateEvents();

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
            `;
	}
	placeholder.innerHTML = output;
}

function hideReport() {
	document.querySelector(".report__window").style.display = "none";
}

async function deleteAccount(id) {
	await fb.deleteUser(schoolId, id);
	updateAccounts();
}
document.addEventListener("DOMContentLoaded", async function () {
	var editableCells = document.getElementsByClassName("editable");
	let school = await fb.getSchoolById(schoolId);
	for (var i = 0; i < editableCells.length; i++) {
		let id = editableCells[i].id;
		editableCells[i].innerHTML = school.prizes[id] || "";
		editableCells[i].addEventListener("click", function () {
			var currentValue = this.innerHTML;
			var input = document.createElement("input");
			input.setAttribute("type", "text");
			input.value = currentValue;
			this.innerHTML = "";
			this.appendChild(input);
			input.focus();

			input.addEventListener("blur", async function (e) {
				var newValue = this.value;
				this.parentNode.innerHTML = newValue;


				// Determine the field name and value based on the cell being edited
				let fieldName = id;

				if (newValue.trim() !== "") {

					// Load the school document to get the original fields information
					var school = await fb.getSchoolById(schoolId);
					if (school) {
						var originalPrizes = school.prizes; // Assuming you want to update other fields as well

						// Check if the 'prizes' field exists in the originalFields object
						if (!originalPrizes) {
							originalPrizes = {};
						}

						// Check if the fieldName exists within the 'prizes' field
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
async function updateQuarters() {
	let quarters = (await fb.getSchoolById(schoolId)).quarters;
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
	} else if (firstStartDate >= firstEndDate) {
		isValid = false;
		errorMessage = "First quarter start date must be before the end date.";
	} else if (secondStartDate >= secondEndDate) {
		isValid = false;
		errorMessage = "Second quarter start date must be before the end date.";
	} else if (thirdStartDate >= thirdEndDate) {
		isValid = false;
		errorMessage = "Third quarter start date must be before the end date.";
	} else if (fourthStartDate >= fourthEndDate) {
		isValid = false;
		errorMessage = "Fourth quarter start date must be before the end date.";
	} else if (firstEndDate >= secondStartDate ||
		secondEndDate >= thirdStartDate ||
		thirdEndDate >= fourthStartDate) {
		isValid = false;
		errorMessage = "Invalid quarter dates! Ensure that each quarter ends before the next one starts.";
	}

	if (!isValid) {
		// Display validation error message
		errorPopup("Invalid Dates!", errorMessage);
		return;
	} else {
		// Validation passed, perform further processing or submit the form
		// ...

		// For demonstration purposes, display the captured dates in the console
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
		updateQuarters();
		pickWinners();
	}
});

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
	for (let [key, val] of Object.entries(quarters)) {
		if (key.includes("End")) {
			if (val.toDate().toISOString().slice(0, 10) == today) {
				// do winner calculation

				noEnds = false;
				winnersDiv.hidden = false;
				let users = await fb.loadUsers(schoolId);
				let sortedUsers = users.sort((a, b) => b.points - a.points);
				let topFourUsers = sortedUsers.slice(0, 4);
				let randWinners = {};

				for (let grade = 9; grade <= 12; grade++) {
					let filteredUsers = users.filter(user => user.grade === grade);
					let randomIndex = Math.floor(Math.random() * filteredUsers.length);
					randWinners[grade] = filteredUsers[randomIndex];
				}
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

function hideWinners() {
	let targetWindow = document.querySelector("#prize-table");
	targetWindow.style.display = "none";

}

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
         <td>${(await fb.getEventById(eventId)).eventName}</td>
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

async function createNewEvent() {
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

	let event = await fb.addEventToSchool(
		schoolId,
		eventName,
		eventDescription,
		startDate,
		endDate,
		prize,
		code
	);

	if (event) {
		alertPopup("Event created!", `Event '${eventName}' created!`);
	}
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

async function deleteEvent(id) {
	await fb.deleteEvent(schoolId, id);

	await updateEvents();
	// let i = r.parentNode.parentNode.rowIndex;
	// document.querySelector('.events__output').deleteRow(i);
	// updateAccounts();
}

async function createNewAccount() {
	const fname = document.querySelector(".student__fname").value;
	const lname = document.querySelector(".student__lname").value;
	const grade = document.querySelector(".student__grade").value;
	const email = document.querySelector(".student__username").value;
	const password = String(
		Math.floor(Math.random() * 90_000_000) + 10_000_000
	);

	if (!fname || !lname || !grade || !email) {
		warningPopup("Warning", "Empty fields present");
		return;
	}

	// Check if user with the same email already exists
	const existingUser = await fb.getUserByEmail(schoolId, email);
	if (existingUser) {
		errorPopup(
			"User already exists!",
			"An account with the same email already exists."
		);
		return;
	}

	bcrypt.genSalt(10, function (err, salt) {
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

			fb.transporter.sendMail(mailLoad, function (error, info) {
				if (error) {
					console.log(error);
				} else {
					//   console.log('Email sent: ' + info.response);
				}
			});

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