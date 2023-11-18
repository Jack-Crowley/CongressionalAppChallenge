const express = require('express');
const bodyParser = require('body-parser')
const fs = require("fs");
const db = require('./db/db_connection');
const { auth, requiresAuth } = require('express-openid-connect');
require("dotenv").config()

const config = {
    authRequired: false,
    auth0Logout: true,
    secret: process.env.AUTH_SECRET,
    baseURL: 'http://localhost:3000',
    clientID: 'xFcg2M5WA23acnOfo8OvdWSA6BaED0GH',
    issuerBaseURL: 'https://dev-vs0v5722j8irc2o0.us.auth0.com'
};


const app = express();
const PORT = 3000;

app.use(auth(config));

app.use(bodyParser.urlencoded({ extended: false, limit: '10mb' }));
app.use(bodyParser.json());

app.use(express.static('public'));

app.set("views", __dirname + "/views");
app.set("view engine", "ejs");

function getSQLQuery(fileName) {
    return fs.readFileSync(__dirname + `/db/queries/${fileName}.sql`, { encoding: "UTF-8" });
}

async function getStudentID(email) {
    return await new Promise((resolve, reject) => {
        db.execute(getSQLQuery("getStudentIDFromEmail"), [email], async (error, results) => {
            if (error) {
                console.log(error);
                resolve(null);
            }
            else
                resolve(results[0].studentID)
        });
    });
}

async function accountRegister(req, res, next) {
    if (!req.oidc.isAuthenticated()) {
        req.redirect("/register")
    }
    else {
        await new Promise((resolve, reject) => {
            db.execute(getSQLQuery("findIfNewUser"), [req.oidc.user.email], (error, results) => {
                console.log("Test1")
                if (error)
                    res.status(500).send(error);
                else {
                    if (results.length >= 1) {
                        console.log("Test")
                        next()
                    }
                    else {
                        console.log("Test")
                        res.redirect("/register")
                    }
                }
            });
        });
    }
}

app.get("/opportunities", async (req, res) => {
    db.execute(getSQLQuery("getAllUpcomingEvents"), (error, results) => {
        if (error)
            res.status(500).send(error);
        res.render('opportunities', { results: results })
    });
});

app.post("/opportunities", async (req, res) => {
    console.log(req.body)
    console.log(req.body.keyword)

    let date = req.body.date
    if (date != '') {
        console.log("VALID DATE")
        date = new Date(`20${date.replace(/(\d{2})\/(\d{2})\/(\d{2})/, '$3-$1-$2')}`)
        date = date.toISOString().split('T')[0]
    }
    else {
        date = ''
    }

    let zipcode = req.body.zipcode
    let word = `%`+req.body.keyword+`%`

    console.log(date)
    console.log(zipcode)
    console.log(word)


    db.execute(getSQLQuery("searchOpportunity"), [word,word,word,date,date,zipcode,zipcode], (error, results) => {
        if (error) {
            console.log(error)
            res.status(500).send(error); }
        else
            res.send(results)
    });
});

app.post("/opportunities/:eventID", async (req, res) => {
    db.execute(getSQLQuery("registerStudent"), (error, results) => {
        if (error)
            res.status(500).send(error);
        else
            db.execute(getSQLQuery("getStudentIDFromEmail"), [req.oidc.user.email], (error, results) => {
                if (error)
                    res.status(500).send(error);
                else
                    res.send(results)
            });
    });
})

app.get("/", async (req, res) => {
    res.render(req.oidc.isAuthenticated() ? 'index' : 'index-loggedOut');
});

app.get("/groups", async (req, res) => {
    let studentID = await getStudentID(req.oidc.user.email)

    db.execute(getSQLQuery("getStudentGroups"), [studentID], (error, results) => {
        if (error)
            res.status(500).send(error);
        else
            res.render('groups', { results: results })
    });

});

app.get("/dashboard", async (req, res) => {
    let totalHours = 0
    let pastEvents;
    let upcomingEvents;
    let studentID = await getStudentID(req.oidc.user.email);

    // Total hours
    await new Promise((resolve, reject) => {
        db.execute(getSQLQuery("getHours"), [studentID], (error, results) => {
            if (error) {
                console.log(error)
                res.status(500).send(error);
            }
            else {
                totalHours = (results[0].totalHours == null) ? 0 : results[0].totalHours
            }
            resolve(0)
        });
    });

    // Upcoming events
    await new Promise((resolve, reject) => {
        db.execute(getSQLQuery("getUpcomingEvents"), [studentID], (error, results) => {
            if (error) {
                console.log(error)
                res.status(500).send(error);
            }
            else {
                upcomingEvents = results
            }
            resolve(0)
        });
    });

    // Past events
    await new Promise((resolve, reject) => {
        db.execute(getSQLQuery("getPastEvents"), [studentID], (error, results) => {
            if (error) {
                console.log(error)
                res.status(500).send(error);
            }
            else {
                console.log(results)
                pastEvents = results
            }
            resolve(0)
        });
    });

    console.log(upcomingEvents[0])

    res.render("dashboard", { totalHours: totalHours, upcomingEvents: upcomingEvents, pastEvents: pastEvents })
});

app.get("/account", async (req, res) => {
    res.render('account')
});

app.get("/registration", async (req, res) => {
    res.render('registration')
});

app.get("/company", async (req, res) => {
    res.render('company')
});

app.post("/registration", async (req, res) => {
    let name = req.body.name.split(" ");
    console.log(req.body.name)
    console.log(name)
    db.execute(getSQLQuery("addStudent"), [req.body.email, 1, name[0], name[1], 2025, 2], (error, results) => {
        if (error) {
            console.log(error)
            res.status(500).send(error);
        }
        else {
            res.send({data:'works'})
        }
    });
});

app.get("/event/:eventID", async (req, res) => {
    let eventID = req.params.eventID;
    let studentID = await getStudentID(req.oidc.user.email)
    let eventName;
    let date;
    let eventDescription;
    let company;
    let count;
    let location;
    let inEvent;

    // name and description
    await new Promise((resolve, reject) => {
        db.execute(getSQLQuery("getEventInfo"), [eventID], (error, results) => {
            if (error) {
                console.log(error)
                res.status(500).send(error);
            }
            else {
                eventName = results[0].name
                eventDescription = results[0].description
                date = results[0].date
            }
            resolve(0)
        });
    });

    // Company     
    await new Promise((resolve, reject) => {
        db.execute(getSQLQuery("getEventCompany"), [eventID], (error, results) => {
            if (error) {
                console.log(error)
                res.status(500).send(error);
            }
            else {
                company = results[0].name
            }
            resolve(0)
        });
    });

    // Location
    await new Promise((resolve, reject) => {
        db.execute(getSQLQuery("getEventLocation"), [eventID], (error, results) => {
            if (error) {
                console.log(error)
                res.status(500).send(error);
            }
            else {
                location = results[0].address
            }
            resolve(0)
        });
    });

    // Member Count
    await new Promise((resolve, reject) => {
        db.execute(getSQLQuery("getMemberCount"), [eventID], (error, results) => {
            if (error) {
                console.log(error)
                res.status(500).send(error);
            }
            else {
                count = results[0].count
            }
            resolve(0)
        });
    });

    // Check in group
    await new Promise((resolve, reject) => {
        db.execute(getSQLQuery("checkIfEvent"), [eventID, studentID], (error, results) => {
            if (error) {
                console.log(error)
                res.status(500).send(error);
            }
            else {
                inEvent = results.length == 1;
            }
            resolve(0)
        });
    });

    res.render('event', { id: eventID, name: eventName, description: eventDescription, company: company, location: location, count: count, date: date, inEvent:inEvent })
});

app.get("/group/join/:joincode", async (req, res) => {
    let joinCode = req.params.joincode;
    db.execute(getSQLQuery("findGroupFromJoinCode"), [joinCode], async (error, results) => {
        let studentID = await getStudentID(req.oidc.user.email);
        if (results.length == 0) {
            res.redirect("/groups")
            return
        }

        let groupID = results[0].groupID

        if (error) {
            console.log(error)
            res.status(500).send(error);
        }
        else {
            db.execute(getSQLQuery("checkIfGroup"), [groupID, studentID], (error, results) => {
                if (error) {
                    console.log(error)
                    res.status(500).send(error);
                }
                else {
                    if (results.length == 0) {
                        db.execute(getSQLQuery("addToGroup"), [groupID, studentID], (error, results) => {
                            if (error) {
                                console.log(error)
                                res.status(500).send(error);
                            }
                            else {
                                res.redirect("/groups")
                            }
                        });
                    }
                    else {
                        res.redirect("/groups")
                    }
                }
            });
        }
    });
})

app.get("/event/register/:eventID", async (req, res) => {
    let eventID = req.params.eventID;
    let studentID = await getStudentID(req.oidc.user.email);

    db.execute(getSQLQuery("addToEvent"), [eventID, studentID], (error, results) => {
        if (error) {
            console.log(error)
            res.status(500).send(error);
        }
        else {
            res.redirect("/event/"+eventID)
        }
    });
});

app.get("/group/:groupid", async (req, res) => {
    let studentID = await getStudentID(req.oidc.user.email)
    let groupID = req.params.groupid;
    let groupName;
    let groupEmail;
    let members;
    let events;
    let inGroup;

    // Name and email
    await new Promise((resolve, reject) => {
        db.execute(getSQLQuery("getGroupFromID"), [groupID], (error, results) => {
            if (error) {
                console.log(error)
                res.status(500).send(error);
            }
            else {
                groupName = results[0].name
                groupEmail = results[0].email

            }
            resolve(0)
        });
    });

    // Members
    await new Promise((resolve, reject) => {
        db.execute(getSQLQuery("getMemberFromGroup"), [groupID], (error, results) => {
            if (error) {
                console.log(error)
                res.status(500).send(error);
            }
            else {
                members = results
            }
            resolve(0)
        });
    });

    // Events
    await new Promise((resolve, reject) => {
        db.execute(getSQLQuery("getGroupEvents"), [groupID], (error, results) => {
            if (error) {
                console.log(error)
                res.status(500).send(error);
            }
            else {
                events = results;
            }
            resolve(0)
        });
    });

    // Check in group
    await new Promise((resolve, reject) => {
        db.execute(getSQLQuery("checkIfGroup"), [groupID, studentID], (error, results) => {
            if (error) {
                console.log(error)
                res.status(500).send(error);
            }
            else {
                inGroup = results.length == 1;
            }
            resolve(0)
        });
    });

    console.log(events)

    res.render('group', { groupName: groupName, groupEmail: groupEmail, members: members, events: events, inGroup: inGroup })
});

app.listen(PORT, () => {
    console.log(`App server listening on ${PORT}. (Go to http://localhost:${PORT})`);
});