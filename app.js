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
        else
            res.render('opportunities', { results: results })
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

app.get('/logintest', (req, res) => {
    res.send(req.oidc.isAuthenticated() ? 'Logged in' : 'Logged out');
});

app.get('/profile', requiresAuth(), accountRegister, (req, res) => {
    res.send(JSON.stringify(req.oidc.user));
});

app.get("/", async (req, res) => {
    res.render(req.oidc.isAuthenticated() ? 'index' : 'index-loggedOut');
});

app.get("/groups", async (req, res) => {
    res.render('groups')
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
                console.log(results)
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

    res.render("dashboard", {totalHours:totalHours, upcomingEvents:upcomingEvents, pastEvents:pastEvents})
});

app.get("/account", async (req, res) => {
    res.render('account')
});

app.get("/registration", async (req, res) => {
    res.render('registration')
});

app.get("/event/:eventid", async (req, res) => {
    res.render('event')
});

app.get("/group/:groupid", async (req, res) => {
    res.render('group')
});

app.listen(PORT, () => {
    console.log(`App server listening on ${PORT}. (Go to http://localhost:${PORT})`);
});