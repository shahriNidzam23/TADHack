var express = require('express');
var mysql = require('mysql');
var router = express.Router();

// var pool  = mysql.createPool({
//   connectionLimit : 100,
//   host            : 'us-cdbr-iron-east-05.cleardb.net',
//   user            : 'bc0936390aaab1',
//   password        : 'd31642b4',
//   database        : 'heroku_14f0a351e76bfd4'
// });

///For Development
var pool = mysql.createPool({
    connectionLimit: 100,
    host: '127.0.0.1',
    user: 'root',
    password: '',
    database: 'mada'
});

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
            connection.query(querySelect, function(error, results, fields) {


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

/* Get Response_Lookup Service. */
router.get('/getResponseLookup', function(req, res, next) {
    try {
        pool.getConnection(function(err, connection) {
            // Use the connection
            connection.query('SELECT * FROM question INNER JOIN response_lookup ON question.id = response_lookup.question_id', function(error, results, fields) {

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

router.post('/getId', function(req, res, next) {
    try {
        pool.getConnection(function(err, connection) {
            // Use the connection
            var user = { remote_ip: req.body.ip, status: 10 };
            connection.query('INSERT INTO user SET ?', user, function(error, results, fields) {

                // Handle error after the release.
                if (error) throw error;
                console.log(results)
                res.json(results.insertId);
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

router.post('/sendResponse/:id', function(req, res, next) {
    try {
        pool.getConnection(function(err, connection) {
            for (var i = 0; i < req.body.length; i++) {

                var sql = 'SELECT * FROM response WHERE question_id = ? AND user_id = ?';
                var ans = req.body[i].ans;
                var condition = [req.body[i].quesId, req.params.id];
                connection.query(sql, condition, function(index, error, results, fields) {

                    // Handle error after the release.
                    if (error) throw error;

                    var type = '';
                    console.log(index);
                    if (results.length > 0) {
                        type = "update";
                    } else {
                        type = "insert";
                    }

                    insertResponse(req.params.id, req.body[index].quesId, req.body[index].ans, type, res);

                }.bind(connection, i));

                if (i == (req.body.length - 1)) {
                    // And done with the connection.
                    res.json("OK");
                    connection.release();
                }

            }
        });
    } catch (ex) {
        console.error("Internal error:" + ex);
        return next(ex);
    }
});

function insertResponse(id, quesId, ans, type, res) {
    try {
        pool.getConnection(function(err, connection) {
            // Use the connection
            var response;
            var sql = '';

            if (type == "insert") {
                response = { user_id: id, question_id: quesId, response: ans, status: 10 };
                sql = 'INSERT INTO response SET ?';
            } else {
                response = [ans, quesId, id];
                sql = 'UPDATE response SET response = ? WHERE question_id = ? AND user_id = ?';

            }

            connection.query(sql, response, function(error, results, fields) {

                // Handle error after the release.
                if (error) throw error;
                // And done with the connection.
                connection.release();

                // Don't use the connection here, it has been returned to the pool.
            });
        });
    } catch (ex) {
        console.error("Internal error:" + ex);
        return next(ex);
    }
}

router.get('/getResponse/:id', function(req, res, next) {
    try {
        pool.getConnection(function(err, connection) {
            // Use the connection
            var sql = 'SELECT section.name, response.question_id, question.question, response.response AS response_id, response_lookup.response FROM response' + 
            ' LEFT JOIN response_lookup ' +
            'ON response.question_id = response_lookup.question_id AND response.response = response_lookup.id ' + 
            'LEFT JOIN question ON response.question_id = question.id ' + 
            'LEFT JOIN section ON question.section_id = section.id ' + 
            'WHERE user_id = ? ';
            connection.query(sql, [req.params.id],function(error, results, fields) {

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