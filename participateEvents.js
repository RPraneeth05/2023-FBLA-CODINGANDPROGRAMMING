const fb = require("./firebaseHelper");

const schoolId = "6loq9Vs0hZYdzFx2mrTH";
(async () => {
    let users = await fb.loadUsers(schoolId);
    const snapshot = await fb.db
        .collection("schools")
        .doc(schoolId)
        .collection("events")
        .get();

    const events = [];

    snapshot.forEach((doc) => {
        const eventData = doc.data();
        events.push({
            id: doc.id,
            ...eventData,
        });
    });
    for (let user of users) {
        let numEvents = 1 + Math.floor(Math.random() * events.length);
        let eventsToAdd = [];

        // Generate an array of unique random event indices
        let eventIndices = [];
        while (eventIndices.length < numEvents) {
            let randomIndex = Math.floor(Math.random() * events.length);
            if (!eventIndices.includes(randomIndex)) {
                eventIndices.push(randomIndex);
            }
        }

        // Add the selected events to eventsToAdd
        for (let index of eventIndices) {
            eventsToAdd.push(events[index]);
        }

        // Update the user with the selected events
        for (let e of eventsToAdd) {
            if (e.participants)
                e.participants.push(user.email);
            else
                e['participants'] = []
            await fb.updateEvent(schoolId, e.id, {
                participants: e.participants
            });
        }
        let points = 0;
        eventsToAdd.forEach(i => points += Number(i.prize));
        await fb.updateUser(schoolId, user.id, { events: eventsToAdd.map(i => i.id), points: points });
    }

})()