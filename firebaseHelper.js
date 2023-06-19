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

const loadSchools = async () => {
  try {
    const snapshot = await db.collection("schools").get();
    const schoolsData = [];

    snapshot.forEach((doc) => {
      const schoolData = doc.data();
      schoolsData.push({
        ID: doc.id,
        State: schoolData.state,
        School: schoolData.school,
        adminEmail: schoolData.adminEmail,
        adminPass: schoolData.adminPass,
        "# of Students": schoolData.studentCount,
        "Date Added": schoolData.dateCreated.toDate().toLocaleDateString(),
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
};

const deleteSchoolById = async (schoolId) => {
  try {
    await db.collection("schools").doc(schoolId).delete();
  } catch (error) {
    console.error("Error deleting school:", error);
  }
};

const addEventToSchool = async (schoolId, eventName, eventDesc, startDate, endDate, code) => {
  try {
    const eventRef = await db.collection("schools").doc(schoolId).collection("events").add({
      eventName: eventName,
      eventDesc: eventDesc,
      startDate: startDate,
      endDate: endDate,
      code: code,
      participants: [],
    });

    return {
      id: eventRef.id,
      eventName: eventName,
      eventDesc: eventDesc,
      startDate: startDate,
      endDate: endDate,
      code: code,
      participants: [],
    };
  } catch (error) {
    console.error("Error adding event:", error);
    return null;
  }
};

const addUserToSchool = async (schoolId, fname, lname, grade, email) => {
  try {
    const userRef = await db.collection("schools").doc(schoolId).collection("users").add({
      fname: fname,
      lname: lname,
      grade: grade,
      email: email,
      events: [],
    });

    return {
      id: userRef.id,
      fname: fname,
      lname: lname,
      grade: grade,
      email: email,
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
        State: schoolData.state,
        School: schoolData.school,
        adminEmail: schoolData.adminEmail,
        adminPass: schoolData.adminPass,
        "# of Students": schoolData.studentCount,
        "Date Added": schoolData.dateCreated.toDate().toLocaleDateString(),
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

// Function to get a user by their email within a school
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
      return null;
    }

    const userDoc = snapshot.docs[0];
    const userData = userDoc.data();

    return {
      id: userDoc.id,
      ...userData
    };
  } catch (error) {
    console.error("Error getting user by email:", error);
    return null;
  }
};

// Function to load all users within a school
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
        ...userData
      });
    });

    return usersData;
  } catch (error) {
    console.error("Error loading users:", error);
    return [];
  }
};

module.exports = {
  loadSchools,
  addSchool,
  deleteSchoolById,
  addEventToSchool,
  addUserToSchool,
  changeAdminPassword,
  getSchoolById,
  getUserByEmail,
  loadUsers
};
