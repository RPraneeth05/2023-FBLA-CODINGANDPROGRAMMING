const path = require('path');
const fs = require('fs');

function readFromJSON(file) {
   return JSON.parse(fs.readFileSync(file));
}

function writeToJSON(file, data) {
   fs.writeFileSync(file, JSON.stringify(data, null, 2), {
      encoding: 'utf-8',
      flag: 'w'
   });
   console.log(`Wrote ${data} to ${file}`);
}

function populateSelect() {
   fetch(path.join(__dirname, '../database/events.json'))
      .then(function (response) {
         return response.json();
      })
      .then(function (events) {
         let placeholder = document.querySelector('.event__options');
         let output = '';
         for (event of events) {
            output += `
               <option>${event.event_name}</option>
            `
         }
         placeholder.innerHTML = output;
      });
}

populateSelect();

function showForm() {
   document.querySelector('.form__title').innerHTML = document.querySelector('.event__options').value;
}
