const path = require('path')
const router = require('./routes/controller');
const bodyParser = require('body-parser');
const express = require('express');
const mysqlDb = require('./db/mysqlConn');

const app = express();

app.use(bodyParser.json());

app.use("/", express.static(path.join(__dirname, "build")))

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*"); // Incoming requests can come from '*' aka ANYWHERE
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, X-Forwarded-For, X-Real-IP, Content-Type, Accept"
  ); // Incoming requests can have these headers
  res.setHeader(
    "Acces-Control-Allow-Methods",
    "OPTIONS, GET, POST, PUT, DELETE"
  );
  next();
});

// Record the ip/timestamp of all requests
app.use((req, res, next) => {
  const ip = req.headers["x-forwarded-for"] || req.connection.remoteAddress;
  const query = `INSERT INTO requests values (?, NOW(6), ?)`;
  mysqlDb.query(query, [ip, req.url], (error, results) => {
	if (error) { res.send(error); } 
	else { next(); }
  });
});

app.use("/robots.txt", function (req, res) {
  res.type("text/plain");
  res.sendFile(path.join(__dirname, "robots.txt"));
});

app.use("/contact", (req, res, next) => {

  let name = req.body["name"];
  let email = req.body["email"];
  let message = req.body["message"];

  if ((name == null) | (message == null)) { res.sendStatus(200); } 
  else {
    const query = `INSERT INTO contact values (?, ?, ?, NOW(6))`;
    mysqlDb.query(query, [name, email, message], (error, results) => {
	  if (error) {
      console.log(error); 
      res.sendStatus(500); 
    } 
	  else { res.send(results); }
    });





module.exports = app; // This exports the app AND all the middlewares