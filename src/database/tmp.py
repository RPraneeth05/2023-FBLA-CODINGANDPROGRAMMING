import json
import random

with open("users.json") as f:
    users = json.load(f)
with open("events.json") as f:
    events = json.load(f)


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

with open("users.json", "w") as f:
    json.dump(users, f)
with open('events.json', 'w') as f:
    json.dump(events, f)