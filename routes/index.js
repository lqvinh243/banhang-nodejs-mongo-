var express = require('express');
var router = express.Router();
var multer  = require('multer');
var sanpham = require('../model/sanpham');

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './imgsp')
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
    cb(null, uniqueSuffix  + '-' + file.originalname)
  }
})

var anhsp = [];

var upload = multer({ storage: storage })

/* GET home page. */
router.get('/', function(req, res, next) {
  sanpham.find({})
  .then(rel => {
    console.log(rel);
    res.render('index', { title: 'Trang chủ', data : rel });
  })
  .catch(err => console.log(err));
  
});

router.post('/upload',upload.any(),function(req,res,next){
  var filename = req.files[0].path;
  anhsp.push(filename);
  res.status(200).send(req.files);
})

router.get('/uploadsp',function(req,res,next){
  anhsp = [];
  res.render('uploadsp',{title:'Đăng sản phẩm cần bán!!'})
})
router.post('/uploadsp',function(req,res,next){
  var name = req.body.name,price = req.body.price,des = req.body.des;
  if(anhsp.length <= 0){
    res.render('spthatbai',{title:'Đăng bán sản phẩm thất bại'});
  }
  else{
    var newsp ={
    "name":name,
    "price":price,
    "des":des,
    "anhsp":anhsp
  }
  sanpham.collection.insertOne(newsp).then(rel => { res.render('spthanhcong',{title:'Đăng bán sản phẩm mới thành công'})})
}
})

router.get('/sanpham/:id',function(req,res,next){
  var id = req.params.id;
  sanpham.find({'_id':id})
  .then(rel => {  res.render('sanpham',{title:'Chi tiết sản phẩm',sp:rel});  })
  .catch(err => console.log(err));
})




module.exports = router;
