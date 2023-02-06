import json
import random

# Load the events.json file
with open("events.json", "r") as f:
    events = json.load(f)

# Load the users.json file
with open("users.json", "r") as f:
    users = json.load(f)

# Loop through each user
for user in users:
    if not user["admin"]:
        # Choose a random number of events for the user to participate in
        num_events = random.randint(1, len(events))
        user_events = random.sample(events, num_events)
        for event in user_events:
            user["events"].append(event["event_name"])
            user["points"] += int(event["prize"])

# Save the updated users back to the users.json file
with open("users.json", "w") as f:
    json.dump(users, f)
