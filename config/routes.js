var index = require('../routes/index');
//var auth = require('../routes/auth')
//var chat = require('../routes/chat');
var users = require('../routes/users');

module.exports = function (app){
    app.use('/', index);
  //  app.use('/auth',auth);
    //app.use('/chat',chat);
    app.use('/users', users);
}
