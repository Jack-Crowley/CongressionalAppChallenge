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

app.get("/opportunities", async (req, res) => {
    db.execute(getSQLQuery("getAllUpcomingEvents"), (error, results) => {
        if (error)
            res.status(500).send(error);
        else
            res.render('opportunities', { results: results })
    });
});

app.get('/logintest', (req, res) => {
    res.send(req.oidc.isAuthenticated() ? 'Logged in' : 'Logged out');
});

app.get('/profile', requiresAuth(), (req, res) => {
    res.send(JSON.stringify(req.oidc.user));
  });

app.get("/", async (req, res) => {
    res.render('index')
});

app.get("/groups", async (req, res) => {
    res.render('groups')
});

app.get("/dashboard", async (req, res) => {
    res.render('dashboard')
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