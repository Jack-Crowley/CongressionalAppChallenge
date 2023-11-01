const db = require("./db_connection.js")

const location = `INSERT INTO Location
(zipcode, address) 
VALUES 
(?,?);`

const company = `INSERT INTO Company
(name, email) 
VALUES 
(?,?);`

function insertIntoLocation(zipcode, address) {
    db.execute(location, [zipcode, address], (error, results) => {
        if (error) {
            console.log(error)
            res.status(500).send(error);
        }
        else {
            console.log("Added")
        }
    });
}

function insertIntoCompany(zipcode, address) {
    db.execute(company, [zipcode, address], (error, results) => {
        if (error) {
            console.log(error)
            res.status(500).send(error);
        }
        else {
            console.log("Added")
        }
    });
}

const event = `INSERT INTO \`Upcoming Event\`
(date, location, name, companyID) 
VALUES 
(?,?,?,?);`

function insertIntoUpcomingEvents(date, location, name, companyID) {
    db.execute(event, [date, location, name, companyID], (error, results) => {
        if (error) {
            console.log(error)
            res.status(500).send(error);
        }
        else {
            console.log("Added")
        }
    });
}

insertIntoUpcomingEvents('2023-11-02 10:30:00', 5, 'Trash Pickup', 12);
insertIntoUpcomingEvents('2023-11-02 14:45:00', 10, 'Cancer Research Fundraiser', 28);
insertIntoUpcomingEvents('2023-11-03 18:30:00', 15, 'Food Drive', 4);
insertIntoUpcomingEvents('2023-11-04 12:00:00', 3, 'Environmental Cleanup', 1);
insertIntoUpcomingEvents('2023-11-04 13:45:00', 23, 'Homeless Shelter Volunteer', 27);
insertIntoUpcomingEvents('2023-11-05 15:30:00', 30, 'Community Garden Planting', 16);
insertIntoUpcomingEvents('2023-11-05 12:15:00', 18, 'Youth Mentoring Program', 7);
insertIntoUpcomingEvents('2023-11-06 14:00:00', 2, 'Senior Center Visitation', 6);
insertIntoUpcomingEvents('2023-11-06 17:30:00', 25, 'Literacy Workshop', 13);
insertIntoUpcomingEvents('2023-11-07 18:00:00', 9, 'Animal Shelter Volunteering', 26);
insertIntoUpcomingEvents('2023-11-07 16:45:00', 29, 'Clothing Drive', 20);
insertIntoUpcomingEvents('2023-11-08 16:30:00', 11, 'Habitat for Humanity Build', 22);
insertIntoUpcomingEvents('2023-11-08 14:15:00', 17, 'Blood Donation Drive', 24);
insertIntoUpcomingEvents('2023-11-09 11:45:00', 14, 'Elderly Care Program', 21);
insertIntoUpcomingEvents('2023-11-09 15:45:00', 12, 'Park Cleanup', 5);
insertIntoUpcomingEvents('2023-11-09 19:00:00', 7, 'School Supplies Drive', 8);
insertIntoUpcomingEvents('2023-11-02 11:15:00', 1, 'Community Meal Service', 30);
insertIntoUpcomingEvents('2023-11-03 13:00:00', 27, 'Nature Conservation Project', 2);
insertIntoUpcomingEvents('2023-11-04 17:00:00', 6, 'Health and Wellness Fair', 3);