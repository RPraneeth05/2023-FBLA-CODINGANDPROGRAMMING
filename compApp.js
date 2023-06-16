const readline = require("readline");
const admin = require("firebase-admin");

// Initialize Firebase Admin SDK
const serviceAccount = require("./eventhive-5be50-firebase-adminsdk-3sjtk-ef8b515325.json");
admin.initializeApp({
	credential: admin.credential.cert(serviceAccount),
});
const db = admin.firestore();

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

async function addSchool() {
	const state = await prompt("Enter the state: ");
	const school = await prompt("Enter the school name: ");

	try {
		const docRef = await db.collection("schools").add({
			school: school,
			state: state,
			dateCreated: new Date(),
			studentCount: 0,
		});

		console.log("Document written with ID:", docRef.id);
	} catch (error) {
		console.error("Error adding document:", error);
	}
}

async function loadSchools() {
	try {
		const snapshot = await db.collection("schools").get();
		const schoolsData = [];

		snapshot.forEach((doc) => {
			const schoolData = doc.data();
			schoolsData.push({
				State: schoolData.state,
				School: schoolData.school,
				"# of Students": schoolData.studentCount,
				"Date Added": schoolData.dateCreated
					.toDate()
					.toLocaleDateString(),
			});
		});

		console.table(schoolsData);
	} catch (error) {
		console.error("Error loading schools:", error);
	}
}

async function main() {
	console.log("School Tracker");

	let running = true;
	while (running) {
		console.log("1. Add School");
		console.log("2. Load Schools");
		console.log("3. Exit");
		const choice = await prompt("Select an option (1-3): ");

		switch (choice) {
			case "1":
				await addSchool();
				break;
			case "2":
				await loadSchools();
				break;
			case "3":
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
