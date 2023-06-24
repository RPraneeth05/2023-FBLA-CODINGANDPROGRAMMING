// This file is part of firebase - core. The firebase - core is free software : you can redistribute it and / or modify it under the terms of the GNU General Public License as published by the Free Software Foundation either version 3 of the License or ( at your option ) any later version. Further the content of this file is subject to the Mozilla Public License Version 1. 1 ( the " License " ) ; you may not use this file except in compliance with the License. You may obtain a copy of the License at Unless required by applicable law or agreed to in writing software distributed under
// Import the firebaseHelper module
const fb = require("./firebaseHelper");
// default events- Additional events can be added
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

  
  // Iterate over each event and add it to the school in Firebase
  for (let e of events) {
    // Call the addEventToSchool function from the firebaseHelper module
    fb.addEventToSchool(
      "6loq9Vs0hZYdzFx2mrTH", // School ID
      e.eventName, // Event name
      e.eventDesc, // Event description
      new Date(e.startDate), // Convert start date string to Date object
      new Date(e.endDate), // Convert end date string to Date object
      e.prize, // Prize amount
      e.code // Event code
    );
  }