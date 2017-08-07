var express = require('express');
var router = express.Router();

var pool  = mysql.createPool({
  connectionLimit : 10,
  host            : 'us-cdbr-iron-east-05.cleardb.net',
  user            : 'bc0936390aaab1',
  password        : 'd31642b4',
  database        : 'heroku_14f0a351e76bfd4'
});

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Shahrin Nidzam' });
  console.log("Muhammad Shahrin Nidzam bin Effendy");
});

/* Get soalan Service. */
router.get('/getSoalan', function(req, res, next) {
    try {
    	pool.query('SELECT * FROM section INNER JOIN question ON section.id = question.section_id', function(err, rows, fields) {
		  if (err) throw err;
		  res.json(rows);
		});
     //    var roleId = req.param('roleId');
	    // var deptId = req.param('deptId');
	    /*var query = url.parse(req.url,true).query;
	    console.log(query);
        var roleId = query.roleId;
        var deptId = query.deptId;*/
        // req.getConnection(function(err, conn) {
        // 	//var d = q.defer();
        //     if (err) {
        //         console.error('SQL Connection error: ', err);
        //         return next(err);
        //     } else {
        //     	var querySelect = 'SELECT * FROM section INNER JOIN question ON section.id = question.section_id';
        //         conn.query(querySelect, function(err, response) {
        //             if (err) {
        //                 console.error('SQL error: ', err);
        //                 return next(err);
        //             }
        //             console.log(response);
        //             // var resEmp = [];
        //             // for (var empIndex in rows) {
        //             //     var empObj = rows[empIndex ];
        //             //     resEmp .push(empObj);
        //             // }
        //             res.json(response);
    				// conn.end();
        //         });
        //     }
        // });
    } catch (ex) {
        console.error("Internal error:" + ex);
        return next(ex);
    }
});

/* Get Response_Lookup Service. */
router.get('/getResponseLookup', function(req, res, next) {
    try {
    	pool.query('SELECT * FROM response_lookup', function(err, rows, fields) {
		  if (err) throw err;
		  res.json(rows);
		});
    } catch (ex) {
        console.error("Internal error:" + ex);
        return next(ex);
    }
});

module.exports = router;
