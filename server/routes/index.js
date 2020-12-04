const e = require('express');
var express = require('express');
var router = express.Router();
const mysqlDb = require('../db/mysqlConn')

/* GET home page. */
router.get('/countries', function (req, res, next) {
  // res.render('index', { title: 'Express' });
  const query = 'SELECT country, COUNT(*) AS numReviews FROM wineReviews GROUP  BY country';

  // Here we have our query, with 3 things:
  //  1) A SQL statement to execute (exluding data from the web), with a '?' placeholder for scrubbed data (see #2)
  //  2) any data from the web stored in AN ARRAY. This allows the data to be scrubbed. IMPORTANT.
  //  3) A callback function to execute containing a possible error, the fetched results, and 'fields
  mysqlDb.query(query, [], (error, results) => {
    if (error) {
      console.log(error);
      res.send(error);
    } else {
      console.log(results)
      res.send(results);
    }
  })
});


module.exports = router;
