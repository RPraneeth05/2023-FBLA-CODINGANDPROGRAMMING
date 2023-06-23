const admin = require("firebase-admin");
const nodemailer = require("nodemailer");
const bcrypt = require("bcryptjs");

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

const loadSchools = async () => {
	try {
		const snapshot = await db.collection("schools").get();
		const schoolsData = [];

		snapshot.forEach(async (doc) => {
			const schoolData = doc.data();
			console.log();
			schoolsData.push({
				ID: doc.id,
				State: schoolData.state,
				School: schoolData.school,
				adminEmail: schoolData.adminEmail,
				adminPass: schoolData.adminPass,
				"Date Added": schoolData.dateCreated
					.toDate()
					.toLocaleDateString(),
			});
		});

		return schoolsData;
	} catch (error) {
		console.error("Error loading schools:", error);
		return [];
	}
};

const addSchool = async (school, state, adminEmail) => {
	if (
		!String(adminEmail)
			.toLowerCase()
			.match(
				/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
			)
	) {
		console.log("Invalid Email!");
		return null;
	}
	const adminPass = String(
		Math.floor(Math.random() * 90_000_000) + 10_000_000
	);

	bcrypt.genSalt(10, async (err, salt) => {
		if (err) {
			console.error("Error generating salt:", err);
			return;
		}

		bcrypt.hash(adminPass, salt, async (err, hash) => {
			if (err) {
				console.error("Error hashing password:", err);
				return;
			}

			const hashPass = hash;

			try {
				const docRef = await db.collection("schools").add({
					school: school,
					state: state,
					adminEmail: adminEmail,
					adminPass: hashPass,
					dateCreated: new Date(),
					prizes: {},
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

				transporter.sendMail(mailLoad, function (error, info) {
					if (error) {
						console.log(error);
					} else {
						//   console.log('Email sent: ' + info.response);
					}
				});

				return {
					id: docRef.id,
					school: school,
					state: state,
					adminEmail: adminEmail,
				};
			} catch (error) {
				console.error("Error adding document:", error);
				return null;
			}
		});
	});
};

const deleteSchoolById = async (schoolId) => {
	try {
		await db.collection("schools").doc(schoolId).delete();
	} catch (error) {
		console.error("Error deleting school:", error);
	}
};

const updateSchool = async (schoolId, updatedFields) => {
	try {
		await db.collection("schools").doc(schoolId).update(updatedFields);
		return true;
	} catch (error) {
		console.error("Error updating school:", error);
		return false;
	}
}
const addEventToSchool = async (
	schoolId,
	eventName,
	eventDesc,
	startDate,
	endDate,
	prize,
	code
) => {
	try {
		const eventRef = await db
			.collection("schools")
			.doc(schoolId)
			.collection("events")
			.add({
				eventName: eventName,
				eventDesc: eventDesc,
				startDate: startDate,
				endDate: endDate,
				prize: prize,
				code: code,
				participants: [],
			});

		return {
			id: eventRef.id,
			eventName: eventName,
			eventDesc: eventDesc,
			startDate: startDate,
			endDate: endDate,
			prize: prize,
			code: code,
			participants: [],
		};
	} catch (error) {
		console.error("Error adding event:", error);
		return null;
	}
};


const updateEvent = async (schoolId, eventId, updatedFields) => {
	try {
		await db
			.collection("schools")
			.doc(schoolId)
			.collection("events")
			.doc(eventId)
			.update(updatedFields);
		return true;
	} catch (error) {
		console.error("Error trying to update event", error);
		return false;
	}
};

const addUserToSchool = async (
	schoolId,
	fname,
	lname,
	grade,
	email,
	password
) => {
	try {
		const userRef = await db
			.collection("schools")
			.doc(schoolId)
			.collection("users")
			.add({
				fname: fname,
				lname: lname,
				grade: grade,
				email: email,
				password: password,
				points: 0,
				events: [],
			});
		await updateSchool(schoolId, {
			studentCount: (await db.collection("schools").doc(schoolId).collection("users").count().get()).data().count
		})
		return {
			id: userRef.id,
			fname: fname,
			lname: lname,
			grade: grade,
			email: email,
			points: 0,
			events: [],
		};
	} catch (error) {
		console.error("Error adding user:", error);
		return null;
	}
};

const changeAdminPassword = async (schoolId, newAdminPass) => {
	try {
		await db.collection("schools").doc(schoolId).update({
			adminPass: newAdminPass,
		});

		return true;
	} catch (error) {
		console.error("Error changing admin password:", error);
		return false;
	}
};

const getSchoolById = async (schoolId) => {
	try {
		const docRef = await db.collection("schools").doc(schoolId).get();
		if (docRef.exists) {
			const schoolData = docRef.data();
			return {
				ID: docRef.id,
				...schoolData,	
				
			};
		} else {
			console.log("School not found");
			return null;
		}
	} catch (error) {
		console.error("Error retrieving school:", error);
		return null;
	}
};

const getUserByEmail = async (schoolId, email) => {
	try {
		const snapshot = await db
			.collection("schools")
			.doc(schoolId)
			.collection("users")
			.where("email", "==", email)
			.limit(1)
			.get();

		if (snapshot.empty) {
			console.log(snapshot);
			return null;
		}

		const userDoc = snapshot.docs[0];
		const userData = userDoc.data();
		return {
			id: userDoc.id,
			...userData,
		};
	} catch (error) {
		console.error("Error getting user by email:", error);
		return null;
	}
};

const loadUsers = async (schoolId) => {
	try {
		const snapshot = await db
			.collection("schools")
			.doc(schoolId)
			.collection("users")
			.get();

		const usersData = [];

		snapshot.forEach((doc) => {
			const userData = doc.data();
			usersData.push({
				id: doc.id,
				...userData,
			});
		});

		return usersData;
	} catch (error) {
		console.error("Error loading users:", error);
		return [];
	}
};

const updateUser = async (schoolId, userId, updatedFields) => {
	try {
		await db
			.collection("schools")
			.doc(schoolId)
			.collection("users")
			.doc(userId)
			.update(updatedFields);
		return true;
	} catch (error) {
		console.error("Error trying to update user", error);
		return false;
	}
};

const loadEvents = async (schoolId) => {
	try {
		const snapshot = await db
			.collection("schools")
			.doc(schoolId)
			.collection("events")
			.get();

		const eventsData = [];

		snapshot.forEach((doc) => {
			const eventData = doc.data();
			eventsData.push({
				id: doc.id,
				...eventData,
			});
		});

		return eventsData;
	} catch (error) {
		console.error("Error loading events:", error);
		return [];
	}
};
const getEventById = async (schoolId, eventId) => {
	try {
		const docRef = await db
			.collection("schools")
			.doc(schoolId)
			.collection("events")
			.doc(eventId)
			.get();

		if (docRef.exists) {
			const eventData = docRef.data();
			return {
				id: docRef.id,
				...eventData,
			};
		} else {
			console.log("Event not found");
			return null;
		}
	} catch (error) {
		console.error("Error retrieving event:", error);
		return null;
	}
};

const deleteEvent = async (schoolId, eventId) => {
	try {
		const eventDocRef = db
			.collection("schools")
			.doc(schoolId)
			.collection("events")
			.doc(eventId);

		// Get the event data
		const eventDoc = await eventDocRef.get();
		const eventData = eventDoc.data();

		// Delete the event document
		await eventDocRef.delete();

		// Remove eventId from users' events array
		const usersSnapshot = await db
			.collection("schools")
			.doc(schoolId)
			.collection("users")
			.where("events", "array-contains", eventId)
			.get();

		const batch = db.batch();

		usersSnapshot.forEach((userDoc) => {
			const userRef = db
				.collection("schools")
				.doc(schoolId)
				.collection("users")
				.doc(userDoc.id);
			let points = userDoc.data().points - eventData.prize;
			console.log(eventData.points);
			batch.update(userRef, {
				events: admin.firestore.FieldValue.arrayRemove(eventId),
				points: points
			});
		});

		await batch.commit();

		return true;
	} catch (error) {
		console.error("Error deleting event:", error);
		return false;
	}
};

const deleteUser = async (schoolId, userId) => {
	try {
		const userDocRef = db
			.collection("schools")
			.doc(schoolId)
			.collection("users")
			.doc(userId);

		// Get the user's email
		const userDoc = await userDocRef.get();
		const userData = userDoc.data();
		const userEmail = userData.email;

		// Delete the user document
		await userDocRef.delete();

		// Remove user's email from participants key in each event
		const eventsSnapshot = await db
			.collection("schools")
			.doc(schoolId)
			.collection("events")
			.where("participants", "array-contains", userEmail)
			.get();

		const batch = db.batch();

		eventsSnapshot.forEach((eventDoc) => {
			const eventRef = db
				.collection("schools")
				.doc(schoolId)
				.collection("events")
				.doc(eventDoc.id);

			batch.update(eventRef, {
				participants: admin.firestore.FieldValue.arrayRemove(userEmail),
			});
		});

		await batch.commit();

		return true;
	} catch (error) {
		console.error("Error deleting user:", error);
		return false;
	}
};
module.exports = {
	loadSchools,
	addSchool,
	deleteSchoolById,
	updateSchool,
	addEventToSchool,
	addUserToSchool,
	changeAdminPassword,
	getSchoolById,
	getUserByEmail,
	loadUsers,
	updateUser,
	deleteUser,
	loadEvents,
	getEventById,
	updateEvent,
	deleteEvent,
	transporter,
	db
};
