const fb = require("./firebaseHelper.js");
const random = require('random-name')

// Function to generate an email address from first and last name
/**
* Generates an email based on the first and last name. This is used to generate email addresses that are sent to a group of users
* 
* @param firstName - The first name of the group
* @param lastName - The last name of the group ( case insensitive )
* 
* @return { string } The e - mail address to send to the group of users in the form $firstName$last
*/
function generateEmail(firstName, lastName) {
  const formattedFirstName = firstName.toLowerCase();
  const formattedLastName = lastName.toLowerCase();
  return `${formattedFirstName}.${formattedLastName}@AHS.com`;
}

// Function to generate a random grade (9-12)
/**
* Generates a random grade for use in the GradeBar. It is based on a random number between 4 and 9
* 
* 
* @return { number } The
*/
function generateRandomGrade() {
  return Math.floor(Math.random() * 4) + 9;
}

// Function to add a user to the database
/**
* Adds a user to the database. This is a convenience function for testing purposes. It will try to add the user to the database and if it fails it will log an error to the console.
* 
* @param user - The user to add to the database. Contains fname lname
*/
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
/**
* Generates a number of users in the database. This is a helper function to make it easy to test the database generation functions
* 
* @param numUsers - The number of users to
*/
async function generateRandomUsers(numUsers) {
  // Creates a random user and adds it to the database.
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
