# Overall, this code assigns random events to each user, calculates their points based on the event prizes, and updates the participants list for each event accordingly. 
import json
import random

#  It reads the contents of two JSON files, "users.json" and "events.json", and stores the data in the variables users and events, respectively.
with open("users.json") as f:
    users = json.load(f)
with open("events.json") as f:
    events = json.load(f)



# Loop through each user in the list of users
for user in users:
    # Initialize empty lists and points for each user
    user["events"] = []
    user["points"] = 0
    
    # Randomly select a number of events for the user
    user_events = random.sample(events, random.randint(1, 4))
    
    # Add the names of the selected events to the user's events list
    user["events"].extend([i['event_name'] for i in user_events])
    
    # Calculate the total points for the user based on the prizes of the selected events
    user["points"] = sum([int(i["prize"]) for i in user_events])
    
    # Iterate through each event in the selected events
    for event in user_events:
        # Find the corresponding event in the list of events
        for j in events:
            # Check if the event names match
            if j['event_name'] == event['event_name']:
                # Add the user's username to the participants list of the event
                event['participants'].append(user["username"])
                break


# It writes the updated users and events lists back to their respective JSON files, overwriting the existing contents.
with open("users.json", "w") as f:
    json.dump(users, f)
with open('events.json', 'w') as f:
    json.dump(events, f)