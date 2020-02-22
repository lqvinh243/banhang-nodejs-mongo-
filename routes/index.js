var express = require('express');
var router = express.Router();
var multer = require('multer');
var sanpham = require('../model/sanpham');
var user = require('../model/user');
const bcrypt = require('bcrypt');
const saltRounds = 10;

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './imgsp')
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
    cb(null, uniqueSuffix + '-' + file.originalname)
  }
})

var anhsp = [];

var upload = multer({ storage: storage })

/* GET home page. */
router.get('/', function (req, res, next) {
  sanpham.find({})
    .then(rel => {
      console.log(rel);
      res.render('index', { title: 'Trang chủ', data: rel });
    })
    .catch(err => console.log(err));

});

router.post('/upload', upload.any(), function (req, res, next) {
  var filename = req.files[0].path;
  anhsp.push(filename);
  res.status(200).send(req.files);
})

router.get('/uploadsp', function (req, res, next) {
  anhsp = [];
  res.render('uploadsp', { title: 'Đăng sản phẩm cần bán!!' })
})
router.post('/uploadsp', function (req, res, next) {
  var name = req.body.name, price = req.body.price, des = req.body.des;
  if (anhsp.length <= 0) {
    res.render('spthatbai', { title: 'Đăng bán sản phẩm thất bại' });
  }
  else {
    var newsp = {
      "name": name,
      "price": price,
      "des": des,
      "anhsp": anhsp
    }
    sanpham.collection.insertOne(newsp).then(rel => { res.render('spthanhcong', { title: 'Đăng bán sản phẩm mới thành công' }) })
  }
})

router.get('/sanpham/:id', function (req, res, next) {
  var id = req.params.id;
  sanpham.find({ '_id': id })
    .then(rel => { res.render('sanpham', { title: 'Chi tiết sản phẩm', sp: rel }); })
    .catch(err => console.log(err));
})

router.get('/dangky', function (req, res, next) {
  res.render('dangky', { title: 'Đăng ký tài khoản mới' });
})

router.get('/dkthanhcong',function(req,res,next){
  res.render('dkthanhcong', { title: 'Đăng ký thành công!!' });
})

router.post('/dangky', function (req, res, next) {
  let username = req.body.username;
  let password = req.body.password;
  user.find({ "username": username })
    .then(rel => {
      if (rel.length > 0) {
        res.send('Tên tài khoản đã tồn tại, vui lòng chọn tên khác');
      }
      else {
        bcrypt.hash(password,saltRounds,function(err,hash){
          var newUs = {
            username: username,
            password: hash
          }
          user.collection.insertOne(newUs)
            .then(rel => {
              res.render('dkthanhcong', { title: 'Đăng ký thành công!!' });
            })
            .catch(err => { console.log(err) });
        })
      }
    })
    .catch(err => { console.log(err) });
})






module.exports = router;
