# Overall, this code assigns random events to each user, calculates their points based on the event prizes, and updates the participants list for each event accordingly. 
# The updated data is then saved back to the JSON files.
# It imports the necessary modules, json for JSON file handling and random for generating random values.
import json
import random

#  It reads the contents of two JSON files, "users.json" and "events.json", and stores the data in the variables users and events, respectively.
with open("users.json") as f:
    users = json.load(f)
with open("events.json") as f:
    events = json.load(f)


#  It iterates over each user in the users list and performs the following actions:
#  1. Initializes empty lists for the user's events and points.
#  2. Randomly selects a subset of events from the events list, with the number of events chosen between 1 and 4 (inclusive).
#  3. Extends the user's event list with the names of the selected events.
#  4. Calculates the total points for the user by summing the "prize" values of the selected events.
#  5. Updates the "participants" field of the selected events to include the current user's username.
for user in users:
    user["events"] = []
    user["points"] = 0
    user_events = random.sample(events, random.randint(1, 4))

    user["events"].extend([i['event_name'] for i in user_events])
    user["points"] = sum([int(i["prize"]) for i in user_events])
    for event in user_events:
        for j in events:
            if j['event_name'] == event['event_name']:
                event['participants'].append(user["username"])
                break

# It writes the updated users and events lists back to their respective JSON files, overwriting the existing contents.
with open("users.json", "w") as f:
    json.dump(users, f)
with open('events.json', 'w') as f:
    json.dump(events, f)