var express = require('express');
var router = express.Router();
const mysqlDb = require('../db/mysqlConn');

let query = "";
let params = [];

/**
 * Record all attempts to login to the site.
 */
router.post('/login', function (req, res, next) {
  params = [
    req.header['x-forwarded-for'] || req.connection.remoteAddress, //IP address
    req.body['username'],
    req.body['password']
  ];
  query = "CALL usp_InsertLogin(?, ?, ?)";
  mysqlDb.query(query, params, (error, results) => {
    if (error) { res.send(error); }
    else       { res.send(results); }
  })
})

/**
 *  Fetch all the reviews with a search term, or with a browsing criteria.
 * */ 
router.get('/reviews', function(req,res,next) {
  let page = +req.query['page'];   // Add page/offset to params array
  let reviewsPerPage =  18;
  params = [page, reviewsPerPage]
  if (req.query['searchTerm']) {  // Get reviews by search term 
      params = [...params, req.query['searchTerm'] ]; 
      query = "CALL usp_SearchReviews(?, ?, ?)"
  }
  else {                          // Get reviews by selected criteria 
    params = [...params, req.query['browsingCriteria'], req.query['selectedCriteria']];
    query = "CALL usp_SelectedCriteria(?, ?, ?, ?)"
  }
  mysqlDb.query(query, params, (error, results) => {
    if (error) { res.send(error); }
    else       { res.send(results); }
  })
})

/**
 * Fetch 18 random reviews.
 */
router.get('/fetchRandoms', function (req, res, next) {
  console.log('fetching randoms')
  query = 'CALL usp_SelectRandoms()';
  mysqlDb.query(query, params, (error, results) => {
    if (error) { res.send(error); }
    else       { res.send(results); }
  })
})

/**
 * Fetch reviews matching a search-term.
 */
router.get('/search/:searchTerm', function (req, res, next) {
  query = "CALL usp_SearchReviews(?)";
  params = req.query['searchTerm'];
  mysqlDb.query(query, params, (error, results) => {
    if (error) { res.send(error); }
    else       { res.send(results); }
  })
})

/**
 * Get a list of all possible browsing criteria, and the number of reviews.
 */
router.get('/:browsingCriteria', function (req, res, next) {
  query = "CALL usp_SelectBrowsingCriteria(?)";
  params = req.params.browsingCriteria;
  mysqlDb.query(query, params, (error, results) => {
    if (error) { res.send(error); }
    else       { res.send(results); }
  })
});

router.use( (req, res, next) => {
  console.log(params);
  console.log(query);
  mysqlDb.query(query, params, (error, results) => {
    if (error) { res.send(error); }
    else       { res.send(results); }
  })
})

// /**
//  * Make a call to the database.
//  * @param {*} query The query that the database will call. Probably a procedure.
//  * @param {*} params Parameters to give to the procedure/query.
//  */
// function queryDatabase(query, params = []) {
//   return mysqlDb.query(query, params, (error, results) => {
//     if (error) { error ; }
//     else { results; }
//   })
// }


//=======================================================================================
module.exports = router;
