var express = require('express');
var router = express.Router();
const mysqlDb = require('../db/mysqlConn');

const joinedTables =
  'wineReviews AS w ' +
  'JOIN countries AS c ON w.fkCountry = c.id ' +
  'JOIN varieties AS v ON w.fkVariety = v.id ' +
  'JOIN tasters AS t ON w.fkTaster = t.id ';

router.get('/reviews', function(req,res,next) {
  let bc = req.query['browsingCriteria'];
  let sc = req.query['selectedCriteria'];
  let page = req.query['page'];

  let query = "SELECT * FROM " + joinedTables;
  if      (bc === 'countries') { query += 'WHERE c.country = ? '; }
  else if (bc === 'varieties') { query += 'WHERE v.variety = ? '; }
  else if (bc === 'critics')   { query += 'WHERE t.taster_name = ? '; }

  let offset = (page - 1) * 18;
  query += `LIMIT 18 OFFSET ${offset} `
  
  mysqlDb.query(query, [sc], (error, results) => {
    if (error) { res.send(error); }
    else { res.send(results); }
  })
})

router.get('/count', function(req,res,next) {
  let bc = req.query['browsingCriteria'];
  let sc = req.query['selectedCriteria'];

  let query = "SELECT count(*) as count FROM " + joinedTables;
  if      (bc === 'countries') { query += 'WHERE c.country = ?'; }
  else if (bc === 'varieties') { query += 'WHERE v.variety = ?'; }
  else if (bc === 'critics')   { query += 'WHERE t.taster_name = ?'; }
  console.log("query is " + query)

  mysqlDb.query(query, [sc], (error, results) => {
    if (error) { res.send(error); }
    else { res.send(results); }
  })
})


router.post('/login', function (req, res, next) {
  let ip = req.header['x-forwarded-for'] || req.connection.remoteAddress;
  let username = req.body['username'];
  let password = req.body['password'];

  let query = 'INSERT INTO logins values (?, NOW(6), ?, ?)';
  console.log(query)
  mysqlDb.query(query, [ip, username, password], (error, results) => {
    if (error) { res.send(error) }
    else { res.status(500).send('There was an unknown error. Please check your input.') }
  })
})

router.get('/countReviews', function (req, res, next) {
  let query = 'SELECT count(*) AS count FROM wineReviews';
  mysqlDb.query(query, [], (error, results) => {

    if (error) { res.send(error); }
    else {
      let numRows = results[0].count;
      query = getRandomsQuery(numRows);
      mysqlDb.query(query, [], (error, results) => {
        if (error) { res.send(error); }
        else { res.send(results); }
      })
    }
  })
})

function getRandomsQuery(numRows) {
  let idList = "("; let count = 0;
  while (count < 18) {
    let rand = Math.floor(Math.random() * numRows);
    idList = idList.concat(rand);
    idList = idList.concat(', ');
    count++;
  }
  idList = idList.replace(/,[ ]$/, ')')
  let query = "SELECT * FROM " + joinedTables + 'WHERE w.id IN ' + idList;
  return query;
}

router.get('/search/:searchTerm', function (req, res, next) {
  let query = "SELECT * FROM " + 
    joinedTables + 'WHERE w.description LIKE ? OR ' +
    'w.designation LIKE ? OR ' + 'w.winery LIKE ? OR ' +
    'c.country LIKE ? OR ' + 'w.province LIKE ? OR ' +
    'w.region_1 LIKE ? OR ' + 't.taster_name LIKE ? OR ' +
    't.taster_twitter LIKE ?';
    paramsArray = createParamsArray(req.params.searchTerm);
    mysqlDb.query(query, paramsArray, (error, results) => {
      if (error) { res.send(error); }
      else { res.send(results); }
    });
})

function createParamsArray(param) {
  var arr = [];
  for (var i = 0; i <= 8; i++) { arr = arr.concat(`%` + param + `%`); }
  return arr;
}

router.get('/:browsingCriteria', function (req, res, next) {
  let query = '';
  if (req.params.browsingCriteria === "countries") { query = 'SELECT country AS value, numReviews FROM countries'; }
  else if (req.params.browsingCriteria === "varieties") { query = `SELECT variety AS value, numReviews FROM varieties WHERE numReviews > 1000 ORDER BY value`; }
  else if (req.params.browsingCriteria === "critics") { query = 'SELECT taster_name AS value, numReviews FROM tasters'; }

  mysqlDb.query(query, [], (error, results) => {
    if (error) { res.send(error); }
    else { res.send(results); }
  })
});

router.get('/variety/all', function (req, res, next) {
  let query = "SELECT variety as value FROM varieties"
  mysqlDb.query(query, [], (error, results) => {
    if (error) { res.send(error); }
    else { res.send(results); }
  })
})

//=======================================================================================
module.exports = router;
