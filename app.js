const express = require('express');
const bodyParser = require('body-parser')

const app = express();
const PORT = 3000;

app.use(bodyParser.urlencoded({ extended: false, limit: '10mb' }));
app.use(bodyParser.json());

app.use(express.static('public'));

app.set("views", __dirname + "/views");
app.set("view engine", "ejs");

app.get("/opportunities", async (req, res) => {
    res.render('opportunities')
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

app.get("/event/:eventid", async (req, res) => {
    res.render('event')
});

app.listen(PORT, () => {
    console.log(`App server listening on ${PORT}. (Go to http://localhost:${PORT})`);
});