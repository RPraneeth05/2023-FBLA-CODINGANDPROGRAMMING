import json

# Load the users and events data from their respective files
with open("users.json", "r") as users_file:
    users = json.load(users_file)
with open("events.json", "r") as events_file:
    events = json.load(events_file)

# Loop through each user
for user in users:
    # Loop through each event
    for event in events:
        # Check if the user has the event in their events list
        if not user['admin']:
            if event["event_name"] in user["events"]:
                # If they do, add their username to the participants list for that event
                event["participants"].append(user["username"])

# Save the updated events data back to events.json
with open("events.json", "w") as events_file:
    json.dump(events, events_file)
