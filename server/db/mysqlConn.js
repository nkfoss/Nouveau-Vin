var mysql = require('mysql');
var fs = require('fs');

configPath = './db/dbConfig.json';
var parsed = JSON.parse(fs.readFileSync(configPath, 'utf-8'));
var pool = mysql.createPool({
	connectionLimit: 10,
	host: parsed.host,
	user: parsed.user,
	password: parsed.password,
	database: parsed.database
});

// Pool.query takes 3 args. 
//  1) A SQL statement to execute (exluding data from the web), with a '?' placeholder for scrubbed data (see #2)
//  2) any data from the web stored in AN ARRAY. This allows the data to be scrubbed. IMPORTANT.
//  3) A callback function to execute containing a possible error, the fetched results, and 'fields'
module.exports = {
	query: (queryText, params, callback) => {
		return pool.query(queryText, params, callback);
	}
}
// pool.query("SELECT * from users WHERE id > ?", [dataFromWeb], function (error,results,fields) {
//   if (error) throw error;
//   console.log('We got this: ', results);
// });
