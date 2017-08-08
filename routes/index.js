var express = require('express');
var mysql = require('mysql');
var router = express.Router();

var pool  = mysql.createPool({
  connectionLimit : 10,
  host            : 'us-cdbr-iron-east-05.cleardb.net',
  user            : 'bc0936390aaab1',
  password        : 'd31642b4',
  database        : 'heroku_14f0a351e76bfd4'
});

/////For Development
// var pool  = mysql.createPool({
//   connectionLimit : 10,
//   host            : '127.0.0.1',
//   user            : 'root',
//   password        : '',
//   database        : 'mada'
// });

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Shahrin Nidzam' });
  console.log("Muhammad Shahrin Nidzam bin Effendy");
});

/* Get soalan Service. */
router.get('/getSoalan', function(req, res, next) {
    try {
    	pool.getConnection(function(err, connection) {
		  var querySelect = 'SELECT * FROM section INNER JOIN question ON section.id = question.section_id';
		  connection.query(querySelect, function (error, results, fields) {
		  	

		    // Handle error after the release.
		    if (error) throw error;
			res.json(results);
		    // And done with the connection.
		    connection.release();
		    // Don't use the connection here, it has been returned to the pool.
		  });
		});
     //    var roleId = req.param('roleId');
	    // var deptId = req.param('deptId');
	    /*var query = url.parse(req.url,true).query;
	    console.log(query);
        var roleId = query.roleId;
        var deptId = query.deptId;*/
    } catch (ex) {
        console.error("Internal error:" + ex);
        return next(ex);
    }
});

/* Get Response_Lookup Service. */
router.get('/getResponseLookup', function(req, res, next) {
    try {
		pool.getConnection(function(err, connection) {
		  // Use the connection
		  connection.query('SELECT * FROM question INNER JOIN response_lookup ON question.id = response_lookup.question_id', function (error, results, fields) {
		  	
		    // Handle error after the release.
		    if (error) throw error;

		    res.json(results);
		    // And done with the connection.
		    connection.release();

		    // Don't use the connection here, it has been returned to the pool.
		  });
		});
    } catch (ex) {
        console.error("Internal error:" + ex);
        return next(ex);
    }
});

module.exports = router;
