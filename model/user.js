var mongoose = require('mongoose');

var user = new mongoose.Schema({ username: 'string', password: 'number',name: 'string'},{collection:'user'});

module.exports = mongoose.model('user', user);