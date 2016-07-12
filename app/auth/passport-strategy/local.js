var LocalStrategy   = require('passport-local').Strategy;
var User  = require('../models/UserModel.js');
var jwt   = require("jsonwebtoken");
var config = require('../../../config/config');
var fs = require('fs');


// parse a date in yyyy-mm-dd format
function parseDate(input) {
    var parts = input.split('-');
    // new Date(year, month [, day [, hours[, minutes[, seconds[, ms]]]]])
    return new Date(parts[0], parts[1]-1, parts[2]); // Note: months are 0-based
}

exports.signupStrategy = new LocalStrategy({
    usernameField : 'username',
    passwordField : 'password',
    passReqToCallback : true 
},
  function(req, username, password, done) {
    process.nextTick(function() {
        User.findOne({ 'local.username' :  username }, function(err, user) {
            if (err){
                return done(err);
            }
            if (user) {
                return done(null, {type : false,err: 'Account already registered with '+username+'.',data:{}});
            } else {
                    var newUser  = new User();
                    newUser.role =  'user';
                    newUser.local.username = username;
                    newUser.local.password = newUser.generateHash(password);
                    newUser.save(function(err,user1) {
                        if (err){
                            return done(null,{
                                type:false,
                                data: 'error occured '+ err
                            });
                        }
                        var cert = fs.readFileSync('key.pem');
                        var token = jwt.sign({
                            role : user1.role,
                            username:user1.local.username
                        }, cert, { algorithm: 'HS512'});
                        return done(null, {type : true,err:'', data:{'token' : token}});
                    }); 
            }
        });    
    });
});

exports.loginStrategy = new LocalStrategy({
    usernameField : 'username',
    passwordField : 'password',
    passReqToCallback : true 
},
function(req, username, password, done) {
    process.nextTick(function() {
        var mUser = new User();
        User.findOne({'local.username': username})
            .populate('info')
            .populate('')
            .exec(function(err,user){
            if (err){
                return done(err);
            }
            if (!user) {
                return done(null, {type: false, 'data': {},'err':"Account doesn't exists with the username provided."});
            }
            if(!user.validPassword(password)){
                return done(null, {type: false, data:{},'err': 'Password is wrong.'}); 
            }
            var cert = fs.readFileSync('key.pem');
            var token = jwt.sign({
                role : user.role,
                username:user.local.username
            }, cert, { algorithm: 'HS512' });
            return done(null, {type : true, data:{'token':token },err:''});   
        });  
    });
});