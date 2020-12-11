const router = require('./routes/index');
const bodyParser = require('body-parser');
const express = require('express');

const app = express();

app.use(bodyParser.json());

app.use((req,res,next) => {
	res.setHeader('Access-Control-Allow-Origin', '*');  // Incoming requests can come from '*' aka ANYWHERE
	res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept'); // Incoming requests can have these headers
	res.setHeader('Acces-Control-Allow-Methods', 'OPTIONS, GET, POST, PUT, DELETE');
	next();
})
app.use('/', router);

app.use((req,res,next) => {
	res.send('Sent.')
})

module.exports = app; // This exports the app AND all the middlewares