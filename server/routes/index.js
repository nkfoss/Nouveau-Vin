var express = require('express');
var router = express.Router();
const mysqlDb = require('../db/mysqlConn')

/* GET home page. */
router.get('/:browsingCriteria', function (req, res, next) {
  const criteria = req.params.browsingCriteria;
  let query = '';
  if(req.params.browsingCriteria === "country") {
    query = 'SELECT country AS value, COUNT(*) AS numReviews FROM wineReviews GROUP BY country'
  }
  else if(req.params.browsingCriteria === "variety") {
    query = 'SELECT variety AS value, COUNT(*) AS numReviews FROM wineReviews GROUP BY variety'
  }
  else if(req.params.browsingCriteria === "critic") {
    query = 'SELECT taster_name AS value, COUNT(*) AS numReviews FROM wineReviews WHERE taster_name != "" GROUP BY taster_name'
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

router.get('/:browsingCriteria/:selectedCriteria', function(req, res, next) {
  const browsingCriteria = req.params.browsingCriteria;
  const selectedCriteria = req.params.selectedCriteria;
  let query = '';
  if (browsingCriteria === 'country') {
    console.log('it is country')
    query = 'SELECT * FROM wineReviews WHERE country = ?'
  }
  else if (browsingCriteria === 'variety') {
    query = 'SELECT * FROM wineReviews WHERE variety = ?'
  }
  else if (browsingCriteria === 'critic') {
    query = 'SELECT * FROM winereviews WHERE taster_name = ?'
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
