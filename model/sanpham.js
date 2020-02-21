var mongoose = require('mongoose');

var sanpham = new mongoose.Schema({ name: 'string', price: 'number',des: 'string',anhsp:'array' },{collection:'sanpham'});
module.exports = mongoose.model('sanpham', sanpham);