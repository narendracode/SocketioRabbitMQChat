var mongoose = require('mongoose');
var bcrypt   = require('bcrypt-nodejs');

// define the schema for our user model
var InfoSchema = mongoose.Schema({
    profilePic : {
        type: String,
        default: '/files/profile.png'
    },
    name: {type: String, default:null},
    address: {type: String, default:null},
    email:{type:String, default: null},
    dob:{type:Date, default:null}
});

module.exports = mongoose.model('Info', InfoSchema);