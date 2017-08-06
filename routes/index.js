var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Shahrin Nidzam' });
  console.log("Muhammad Shahrin Nidzam bin Effendy");
});

/* Get Employee Service. */
router.get('/getSoalan', function(req, res, next) {
    try {
     //    var roleId = req.param('roleId');
	    // var deptId = req.param('deptId');
	    /*var query = url.parse(req.url,true).query;
	    console.log(query);
        var roleId = query.roleId;
        var deptId = query.deptId;*/
        req.getConnection(function(err, conn) {
            if (err) {
                console.error('SQL Connection error: ', err);
                return next(err);
            } else {
            	var querySelect = 'SELECT * FROM section INNER JOIN question ON section.id = question.section_id';
                conn.query(querySelect, function(err, response) {
                    if (err) {
                        console.error('SQL error: ', err);
                        return next(err);
                    }
                    console.log(response);
                    // var resEmp = [];
                    // for (var empIndex in rows) {
                    //     var empObj = rows[empIndex ];
                    //     resEmp .push(empObj);
                    // }
                    res.json(response);
                });
            }
        });
    } catch (ex) {
        console.error("Internal error:" + ex);
        return next(ex);
    }
});

module.exports = router;
