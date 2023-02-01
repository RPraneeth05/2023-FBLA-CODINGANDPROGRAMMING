// Importing required modules
const path = require("path");
const fs = require("fs");

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

// Function to populate the select options by fetching events.json file and using it to make html options control element with the different event names
function populateSelect() {
  fetch(path.join(__dirname, "../database/events.json"))
    .then(function (response) {
      return response.json();
    })
    .then(function (events) {
      let placeholder = document.querySelector(".event__options");
      let output = "";
      for (event of events) {
        output += <option>${event.event_name}</option>;
      }
      placeholder.innerHTML = output;
    });
}

// Calling the populateSelect function
populateSelect();

// Function to show the form
function showForm() {
  document.querySelector(".form__title").innerHTML =
    document.querySelector(".event__options").value;
}
