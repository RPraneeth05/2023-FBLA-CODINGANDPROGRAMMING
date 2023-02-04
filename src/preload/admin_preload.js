const path = require('path');
const fs = require('fs');
const bcrypt = require('bcryptjs');
const salt = bcrypt.genSaltSync(10);
let script = document.createElement('script');
script.src = 'https://code.jquery.com/jquery-3.6.3.min.js'; // Check https://jquery.com/ for the current version
document.getElementsByTagName('head')[0].appendChild(script);

// Function to read from a JSON file
function readFromJSON(file) {
  // Parse the JSON file and return it
  return JSON.parse(fs.readFileSync(file));
}

// Function to write to a JSON file
function writeToJSON(file, data) {
  // Write the data to the file using fs.writeFileSync
  fs.writeFileSync(file, JSON.stringify(data, null, 2), {
    encoding: "utf-8",
    flag: "w",
  });
  // Log a message to the console indicating that data has been written to the file
  console.log(`Wrote ${data} to ${file}`);
}

// Function to toggle the events window
function toggleEvents() {
  // Select the events window
  let eventsWindow = document.querySelector(".events__holder");
  // Update the display property of the events window
  eventsWindow.style.display =
    eventsWindow.style.display == "none" ? "block" : "none";
}

// Function to toggle the accounts window
function toggleAccounts() {
  // Select the accounts window
  let accountsWindow = document.querySelector(".accounts__holder");
  // Update the display property of the accounts window
  accountsWindow.style.display =
    accountsWindow.style.display == "none" ? "block" : "none";
}

// Function to update the events data
function updateEvents() {
  // Fetch the events data from the JSON file
  fetch(path.join(__dirname, "../database/events.json"))
    .then(function (response) {
      // Convert the response to JSON format
      return response.json();
    })
    // Use the events data to update the events placeholder
    .then(function (events) {
      // Select the events placeholder
      let placeholder = document.querySelector(".events__output");
      // Initialize the output variable
      let output = "";
      // Loop through the events and build the output string
      for (event of events) {
        output += `
               <tr>
                  <td>${event.event_name}</td>
                  <td>${event.event_description}</td>
                  <td>${event.prize}</td>
                  <td>${event.start_date}</td>
                  <td>${event.end_date}</td>
                  <td>
                     <div class="button__bar">
                        <input type="button" onclick="editEvent()" value="Edit">
                        <input type="button" onclick="deleteEvent()" value="Delete">
                     </div>
                  </td>
               </tr>
            `
      }
      // Update the innerHTML of the events placeholder
      placeholder.innerHTML = output;
    })
};

// Call the updateEvents function to initialize the events data
updateEvents();

// Function to create a new event
function createNewEvent() {
  // Read the current events from a JSON file
  let currentEvents = readFromJSON(
    path.join(__dirname, "../database/events.json")
  );

  // Get the event name, description, prize, start date, and end date from the input fields
  let eventName = document.querySelector(".event__name").value;
  let eventDescription = document.querySelector(".event__description").value;
  let prize = document.querySelector(".prize").value;
  let startDate = document.querySelector(".start__date").value;
  let endDate = document.querySelector(".end__date").value;
  let alertBox = document.querySelector(".error__box");
  // Check if any of the fields are empty
  if (
    eventName === "" ||
    eventDescription === "" ||
    prize === "" ||
    startDate === "" ||
    endDate === ""
  ) {
    // If any field is empty, show an alert and return
    alertBox.style.display = 'block';
    alertBox.style['z-index'] = 2;
    alertBox.childNodes[0].innerHTML = "Make sure all fields are filled!";
    alertBox.childNodes[1].innerHTML = "Some fields aren't filled out with all the data required to add the event. Please enter all the data.";
    alertBox.style.opacity = 100;
    setTimeout(() => {
      alertBox.style.opacity = 0;
      alertBox.style.transition = "opacity .5s";

    }, 1000);
    setTimeout(() => {
      alertBox.style['z-index'] = -2;
    }, 2000);
    return;
  } else if (endDate < startDate) {
    // If the end date is earlier than the start date, show an alert and return
    alertBox.style.display = 'block';
    alertBox.style['z-index'] = 2;
    alertBox.childNodes[1].innerHTML = "The start date is after the end date!";
    alertBox.style.opacity = 100;
    setTimeout(() => {
      alertBox.style.opacity = 0;
      alertBox.style.transition = "opacity .5s";
    }, 1000);
    setTimeout(() => {
      alertBox.style['z-index'] = -2;
    }, 2000);
    return;
  }

  // Split the start and end dates into separate parts (month, day, and year)
  startDate = startDate.split("-");
  endDate = endDate.split("-");

  // Reformat the start and end dates
  startDate = `${startDate[1]}/${startDate[2]}/${startDate[0]}`;
  endDate = `${endDate[1]}/${endDate[2]}/${endDate[0]}`;

  // Define a template for a new event
  let eventTemplate = {
    event_name: eventName,
    event_description: eventDescription,
    prize: prize,
    start_date: startDate,
    end_date: endDate,
    participants: [],
  };

  // Add the new event to the list of current events
  currentEvents.push(eventTemplate);

  // Write the updated list of events to the JSON file
  writeToJSON(path.join(__dirname, "../database/events.json"), currentEvents);

  // Update the events on the page
  updateEvents();
}
function createNewAccount() {
  const fname = document.querySelector('.student__fname').value;
  const lname = document.querySelector('.student__lname').value;
  const grade = document.querySelector('.student__grade').value;
  const username = document.querySelector('.student__username').value;
  const password = document.querySelector('.student__password').value;
  const alertBox = document.querySelector(".warning__box");

  if (!fname || !lname || !grade || !username || !password) {
    alertBox.style.display = 'block';
    alertBox.style['z-index'] = 2;
    alertBox.childNodes[1].innerHTML = "<span>Make sure all fields are present with information!</span>";
    alertBox.style.opacity = 100;
    setTimeout(() => {
      alertBox.style.opacity = 0;
      alertBox.style.transition = "opacity .5s";
    }, 1000);
    setTimeout(() => {
      alertBox.style['z-index'] = -2;
    }, 1500);
    return;
  }

  if (password.length < 8) {
    alertBox.style.display = 'block';
    alertBox.style['z-index'] = 2;
    alertBox.childNodes[1].innerHTML = "Password must be atleast 8 characters long.";
    alertBox.style.opacity = 100;
    setTimeout(() => {
      alertBox.style.opacity = 0;
      alertBox.style.transition = "opacity .5s";
    }, 1000);
    setTimeout(() => {
      alertBox.style['z-index'] = -2;
    }, 1500);
    return;
  }

  const currentUsers = readFromJSON(path.join(__dirname, '../database/users.json'));

  bcrypt.genSalt(10, function (err, salt) {
    bcrypt.hash(password, salt, function (err, hash) {
      const hashedPassword = hash;
      const key = Math.floor(Math.random() * 1000000);

      const newStudent = {
        key: key,
        student_fname: fname,
        student_lname: lname,
        student_grade: grade,
        username: username,
        password: hashedPassword,
        points: 0,
        admin: false
      };
      currentUsers.push(newStudent);
      writeToJSON(path.join(__dirname, '../database/users.json'), currentUsers);
      document.querySelector('.student__fname').value = "";
      document.querySelector('.student__lname').value = "";
      document.querySelector('.student__grade').value = "";
      document.querySelector('.student__username').value = "";
      document.querySelector('.student__password').value = "";
    });
  });
}

// Function to edit an existing event
function editEvent() {

}

// Function to delete an existing event
function deleteEvent() {

}
