var express = require('express');
var router = express.Router();
const mysqlDb = require('../db/mysqlConn')

/* GET home page. */
router.get('/:browsingCriteria', function (req, res, next) {
  // res.render('index', { title: 'Express' });
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

  // Here we have our query, with 3 things:
  //  1) A SQL statement to execute (exluding data from the web), with a '?' placeholder for scrubbed data (see #2)
  //  2) any data from the web stored in AN ARRAY. This allows the data to be scrubbed. IMPORTANT.
  //  3) A callback function to execute containing a possible error, the fetched results, and 'fields
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


module.exports = router;
