const readline = require("readline");
const { addSchool, loadSchools, deleteSchoolById } = require("./firebaseHelper");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function clearPrompt() {
  readline.clearLine(process.stdout, 0);
  readline.cursorTo(process.stdout, 0);
}

function prompt(question) {
  return new Promise((resolve) => {
    clearPrompt();
    rl.question(question, (answer) => {
      resolve(answer);
    });
  });
}

async function addSchoolPrompt() {
  const state = await prompt("Enter the state: ");
  const school = await prompt("Enter the school name: ");
  const adminEmail = await prompt("Enter the admin email: ");

  const schoolData = await addSchool(school, state, adminEmail);
  if (schoolData) {
    console.log("School added successfully.");
    console.log("School ID:", schoolData.id);
    console.log("School:", schoolData.school);
    console.log("State:", schoolData.state);
    console.log("Admin Email:", schoolData.adminEmail);
  } else {
    console.log("Failed to add school.");
  }
}

async function deleteSchoolPrompt() {
  const schoolsData = await loadSchools();
  console.table(schoolsData);

  const index = await prompt("Enter the index of the school to delete: ");
  if (index >= 0 && index < schoolsData.length) {
    const schoolId = schoolsData[index].ID;
    await deleteSchoolById(schoolId);
    console.log("School deleted successfully.");
  } else {
    console.log("Invalid index.");
  }
}

async function main() {
  console.log("School Tracker");

  let running = true;
  while (running) {
    console.log("1. Add School");
    console.log("2. Load Schools");
    console.log("3. Delete School");
    console.log("4. Exit");
    const choice = await prompt("Select an option (1-4): ");

    switch (choice) {
      case "1":
        await addSchoolPrompt();
        break;
      case "2":
        const schoolsData = await loadSchools();
        console.table(schoolsData);
        break;
      case "3":
        await deleteSchoolPrompt();
        break;
      case "4":
        running = false;
        break;
      default:
        console.log("Invalid choice.");
        break;
    }
  }

  rl.close();
}

main();
