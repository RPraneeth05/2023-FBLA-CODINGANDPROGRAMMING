const fb = require("./firebaseHelper.js");
const random = require('random-name')

// Function to generate an email address from first and last name
function generateEmail(firstName, lastName) {
  const formattedFirstName = firstName.toLowerCase();
  const formattedLastName = lastName.toLowerCase();
  return `${formattedFirstName}.${formattedLastName}@AHS.com`;
}

// Function to generate a random grade (9-12)
function generateRandomGrade() {
  return Math.floor(Math.random() * 4) + 9;
}

// Function to add a user to the database
async function addUserToDatabase(user) {
  try {
    const schoolId = '6loq9Vs0hZYdzFx2mrTH';
    await fb.db.collection('schools').doc(schoolId).collection('users').add(user);
    console.log(`User ${user.fname} ${user.lname} added to the database`);
  } catch (error) {
    console.error('Error adding user to the database:', error);
  }
}

// Generate and add random users to the database
async function generateRandomUsers(numUsers) {
  for (let i = 0; i < numUsers; i++) {
    const firstName = random.first();
    const lastName = random.last();
    const email = generateEmail(firstName, lastName);
    const grade = generateRandomGrade();
    const password = "$2a$10$FBj77ZyWcQ.QOntzjd4xPOxwm1Cay/R/4b.AEpW2xGhg7nK9PfgZG"; // Replace with the desired password

    const user = {
      fname: firstName,
      lname: lastName,
      grade: grade,
      email: email,
      password: password,
      points: 0,
      events: [],
    };

    await addUserToDatabase(user);
  }
}

// Specify the number of random users to generate
const numUsersToGenerate = 100;

// Call the function to generate and add random users to the database
generateRandomUsers(numUsersToGenerate);
