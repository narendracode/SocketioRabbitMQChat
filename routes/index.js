var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
    //req.app.io.emit('message',{key:'value index'});
   res.redirect('/src/index.html');
});

module.exports = router;
