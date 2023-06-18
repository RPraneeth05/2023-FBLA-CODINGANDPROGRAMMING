const readline = require("readline");
const admin = require("firebase-admin");
const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
	service: "gmail",
	auth: {
		user: "eventhivefbla@gmail.com",
		pass: "wxwgdguxcowmapvg",
	},
});
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
	const adminEmail = await prompt("Enter the admin email: ");
	if (
		!String(adminEmail)
			.toLowerCase()
			.match(
				/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
			)
	) {
		console.log("Invalid Email!");
		return;
	}
	const adminPass = Math.floor(Math.random() * 90000000) + 10000000;
	try {
		const docRef = await db.collection("schools").add({
			school: school,
			state: state,
			adminEmail: adminEmail,
			adminPass: adminPass,
			dateCreated: new Date(),
			studentCount: 0,
		});
		docRef.collection("events");
		docRef.collection("users");
		const mailLoad = {
			from: "eventhivefbla@gmail.com",
			to: adminEmail,
			subject: `EventHive Admin Credentials For ${school}.`,
			text: `Username: ${adminEmail}\nPassword: ${adminPass}`,
		};

		transporter.sendMail(mailLoad, function(error, info){
			if (error) {
			  console.log(error);
			} else {
			//   console.log('Email sent: ' + info.response);
			}
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

async function deleteSchool() {
	try {
		const snapshot = await db.collection("schools").get();
		const schoolsData = [];

		snapshot.forEach((doc) => {
			const schoolData = doc.data();
			schoolsData.push({
				ID: doc.id,
				State: schoolData.state,
				School: schoolData.school,
			});
		});

		console.table(schoolsData);
		const index = await prompt("Enter the index of the school to delete: ");

		if (index >= 0 && index < schoolsData.length) {
			const schoolId = schoolsData[index].ID;
			await db.collection("schools").doc(schoolId).delete();
			console.log("School deleted successfully.");
		} else {
			console.log("Invalid index.");
		}
	} catch (error) {
		console.error("Error deleting school:", error);
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
				await addSchool();
				break;
			case "2":
				await loadSchools();
				break;
			case "3":
				await deleteSchool();
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
