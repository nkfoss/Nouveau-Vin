var express = require('express');
var router = express.Router();
const mysqlDb = require('../db/mysqlConn')

/* GET home page. */
router.get('/:browsingCriteria', function (req, res, next) {
  const criteria = req.params.browsingCriteria;
  let query = '';
  if(req.params.browsingCriteria === "country") {
    query = 'SELECT country AS value, numReviews FROM countries'
  }
  else if(req.params.browsingCriteria === "variety") {
    query = `SELECT variety AS value, numReviews FROM varieties WHERE numReviews > 1000 ORDER BY value`
  }
  else if(req.params.browsingCriteria === "critic") {
    query = 'SELECT taster_name AS value, numReviews FROM tasters'
  }

  mysqlDb.query(query, [], (error, results) => {
    if (error) {
      console.log(error);
      res.send(error);
    } else {
      // console.log(results)
      res.send(results);
    }
  })
});

router.get('/variety/all', function(req,res,next) {
  query = "SELECT variety as value FROM varieties"
  mysqlDb.query(query, [], (error, results) => {
    if (error) {
      console.log(error);
      res.send(error);
    } else {
      // console.log(results)
      res.send(results);
    }
  })
})

router.get('/:browsingCriteria/:selectedCriteria', function(req, res, next) {
  const browsingCriteria = req.params.browsingCriteria;
  const selectedCriteria = req.params.selectedCriteria;
  let query = '';
  if (browsingCriteria === 'country') {
    console.log('it is country')
    query = 'select * from wineReviews as w join countries as c on w.fkCountry = c.id where c.country = ?'
  }
  else if (browsingCriteria === 'variety') {
    query = 'SELECT * FROM winereviews AS w JOIN varieties AS v ON w.fkVariety = v.id WHERE v.variety = ?'
  }
  else if (browsingCriteria === 'critic') {
    query = 'SELECT * FROM winereviews AS w JOIN tasters AS t ON w.fkTaster = t.id WHERE t.taster_name = ?'
  }

  mysqlDb.query(query, [selectedCriteria], (error, results) => {
    if (error) {
      console.log(error);
      res.send(error);
    } else {
      // console.log(results)
      res.send(results);
    }
  })
})




module.exports = router;
