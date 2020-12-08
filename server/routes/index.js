const { query } = require('express');
var express = require('express');
var router = express.Router();
const mysqlDb = require('../db/mysqlConn');

router.get('/countReviews', function (req, res, next) {
  let query = 'select count(*) as count from winereviews';
  mysqlDb.query(query, [], (error, results) => {
    if (error) { console.log(error); res.send(error); }
    else {
      let numRows = results[0].count;
      query = getRandomsQuery(numRows);
      mysqlDb.query(query, [], (error, results) => {
        if (error) { console.log(error); res.send(error); }
        else { res.send(results); }
      })
    }
  })
})

function getRandomsQuery(numRows) {
  console.log(numRows);
  let idList = "("; let count = 0;
  while (count < 18) {
    let rand = Math.floor(Math.random() * numRows);
    idList = idList.concat(rand);
    idList = idList.concat(', ');
    count++;
  }
  idList = idList.replace(/,[ ]$/, ')')
  let joinedTables =
    'select * from wineReviews as w ' +
    'join countries as c on w.fkCountry = c.id ' +
    'join varieties as v on w.fkVariety = v.id ' +
    'join tasters as t on w.fkTaster = t.id ';
  let query = joinedTables + 'WHERE w.id in ' + idList;
  console.log(query);
  return query;
}

/* GET home page. */
router.get('/:browsingCriteria', function (req, res, next) {
  const criteria = req.params.browsingCriteria;
  let query = '';
  if (req.params.browsingCriteria === "country") {
    query = 'SELECT country AS value, numReviews FROM countries';
  }
  else if (req.params.browsingCriteria === "variety") {
    query = `SELECT variety AS value, numReviews FROM varieties WHERE numReviews > 1000 ORDER BY value`;
  }
  else if (req.params.browsingCriteria === "critic") {
    query = 'SELECT taster_name AS value, numReviews FROM tasters';
  }

  mysqlDb.query(query, [], (error, results) => {
    if (error) { console.log(error); res.send(error); }
    else { res.send(results); }
  })
});

router.get('/variety/all', function (req, res, next) {
  query = "SELECT variety as value FROM varieties"
  mysqlDb.query(query, [], (error, results) => {
    if (error) { console.log(error); res.send(error); }
    else { res.send(results); }
  })
})

router.get('/:browsingCriteria/:selectedCriteria', function (req, res, next) {
  const browsingCriteria = req.params.browsingCriteria;
  const selectedCriteria = req.params.selectedCriteria;
  let query = '';
  let joinedTables =
    'select * from wineReviews as w ' +
    'join countries as c on w.fkCountry = c.id ' +
    'join varieties as v on w.fkVariety = v.id ' +
    'join tasters as t on w.fkTaster = t.id ';

  if (browsingCriteria === 'country') { query = joinedTables + 'WHERE c.country = ?'; }
  else if (browsingCriteria === 'variety') { query = joinedTables + 'WHERE v.variety = ?'; }
  else if (browsingCriteria === 'critic') { query = joinedTables + 'WHERE t.taster_name = ?'; }

  mysqlDb.query(query, [selectedCriteria], (error, results) => {
    if (error) { console.log(error); res.send(error); }
    else { res.send(results); }
  })
})




module.exports = router;
