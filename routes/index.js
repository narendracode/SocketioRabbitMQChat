var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
   req.app.io.emit('message',{key:'value index'});
   res.redirect('/src/index.html');
});

//web socket test call
router.get('/test', function(req, res, next) {
    req.app.io.emit('test',{key:'value test'});
    res.json({'test':'test value return'});
});

module.exports = router;
