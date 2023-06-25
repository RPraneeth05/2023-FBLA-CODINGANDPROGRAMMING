const readline = require("readline");
const {
  addSchool,
  loadSchools,
  deleteSchoolById,
} = require("./firebaseHelper");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});
/**
 * Excludes a column from data. This is useful for columns that don't have a value in them
 *
 * @param data - The data to filter.
 * @param column - The column to exclude. Must be a valid column name.
 *
 * @return { Array } The filtered data with the column excluded from the data in place of the original data ( which may have changed
 */
function excludeColumn(data, column) {
  return data.map((item) => {
    const { [column]: _, ...rest } = item;
    return rest;
  });
}
/**
 * Clears the prompt and moves the cursor to the beginning of the line. Useful for prompting a file
 */
function clearPrompt() {
  readline.clearLine(process.stdout, 0);
  readline.cursorTo(process.stdout, 0);
}

/**
 * Prompt the user for input. Clears the prompt before prompting the user for input. Resolves with the user's input.
 *
 * @param question - The question to display to the user. Should be a string that can be parsed by RichText.
 *
 * @return { Promise } A promise that will resolve with the user's input or reject if the user hits cancel
 */
function prompt(question) {
  return new Promise((resolve) => {
    clearPrompt();
    rl.question(question, (answer) => {
      resolve(answer);
    });
  });
}

/**
 * Prompt the user for state school name and admin email and add them to the database. This is a wrapper around addSchool
 */
async function addSchoolPrompt() {
  const state = await prompt("Enter the state: ");
  const school = await prompt("Enter the school name: ");
  const adminEmail = await prompt("Enter the admin email: ");

  const schoolData = await addSchool(school, state, adminEmail);
}

/**
 * Deletes a school by prompts the user for the index of the school to delete and deletes
 */
async function deleteSchoolPrompt() {
  const schoolsData = await loadSchools();
  console.table(excludeColumn(schoolsData, "adminPass"));

  const index = await prompt("Enter the index of the school to delete: ");
  // Delete school by index.
  if (index >= 0 && index < schoolsData.length) {
    const schoolId = schoolsData[index].ID;
    await deleteSchoolById(schoolId);
    console.log("School deleted successfully.");
  } else {
    console.log("Invalid index.");
  }
}

/**
 * This is the main function that runs until the user quits. It asks the user what to do
 */
async function main() {
  console.log("School Tracker");

  let running = true;
  // Prompt for a choice 1. Add School 2. Load Schools 3. Delete School 4. Exit.
  while (running) {
    console.log("1. Add School");
    console.log("2. Load Schools");
    console.log("3. Delete School");
    console.log("4. Exit");
    const choice = await prompt("Select an option (1-4): ");

    // Check if the user has selected the choice.
    switch (choice) {
      case "1":
        await addSchoolPrompt();
        break;
      case "2":
        const schoolsData = await loadSchools();
        console.table(excludeColumn(schoolsData, "adminPass"));
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
