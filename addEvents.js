const fb = require("./firebaseHelper");
const events =[
    {
      "eventName": "Basketball Game",
      "eventDesc": "AHS vs South Forsyth",
      "startDate": "2023-03-02",
      "endDate": "2023-03-03",
      "prize": 500,
      "code": "000000"
    },
    {
      "eventName": "Soccer Match",
      "eventDesc": "AHS vs Rival High School",
      "startDate": "2023-04-10",
      "endDate": "2023-04-10",
      "prize": 600,
      "code": "000000"
    },
    {
      "eventName": "Football Game",
      "eventDesc": "AHS vs North Forsyth",
      "startDate": "2023-05-15",
      "endDate": "2023-05-15",
      "prize": 800,
      "code": "000000"
    },
    {
      "eventName": "Volleyball Tournament",
      "eventDesc": "Inter-School Volleyball Competition",
      "startDate": "2023-06-10",
      "endDate": "2023-06-12",
      "prize": 1000,
      "code": "000000"
    },
    {
      "eventName": "Track and Field Meet",
      "eventDesc": "District Level Athletics Championship",
      "startDate": "2023-07-20",
      "endDate": "2023-07-21",
      "prize": 1200,
      "code": "000000"
    },
    // Add more sport events...
  
    {
      "eventName": "Science Fair",
      "eventDesc": "Showcasing students' science projects",
      "startDate": "2023-03-05",
      "endDate": "2023-03-06",
      "prize": 300,
      "code": "000000"
    },
    {
      "eventName": "Art Exhibition",
      "eventDesc": "Displaying artworks created by students",
      "startDate": "2023-04-15",
      "endDate": "2023-04-16",
      "prize": 200,
      "code": "000000"
    },
    {
      "eventName": "Mathematics Olympiad",
      "eventDesc": "Competition for mathematical problem-solving",
      "startDate": "2023-05-20",
      "endDate": "2023-05-20",
      "prize": 400,
      "code": "000000"
    },
    {
      "eventName": "Debate Tournament",
      "eventDesc": "Inter-School Debate Championship",
      "startDate": "2023-06-25",
      "endDate": "2023-06-26",
      "prize": 500,
      "code": "000000"
    },
    {
      "eventName": "Drama Production",
      "eventDesc": "Stage play performed by students",
      "startDate": "2023-07-30",
      "endDate": "2023-07-30",
      "prize": 300,
      "code": "000000"
    },
    // Add more non-sport events...
  ]

  
  for (let e of events) {
    fb.addEventToSchool(
        "6loq9Vs0hZYdzFx2mrTH",
        e.eventName,
        e.eventDesc,
        new Date(e.startDate),
        new Date(e.endDate),
        e.prize,
        e.code
    )
  }