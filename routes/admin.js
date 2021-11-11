var express = require('express');
var router = express.Router();

var brandhelpers = require('../helpers/brandhelpers');
var categoryhelpers = require('../helpers/categoryhelpers');


var brandExistError = "";
var categoryExistError = "";
var subcategoryExistError = "";

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('admin/dashboard', { admin:true});
});


/* GET category managment. */
router.get('/category-managment',(req,res)=>{
  categoryhelpers.getCategory().then((categoryData)=>{
    res.render('admin/category-managment', { admin:true,categoryExistError,categoryData,subcategoryExistError})
    categoryExistError = "";
    subcategoryExistError = "";
  })
 
});

/* POST category . */

router.post('/add-category', (req,res)=>{
 

  categoryhelpers.addCategory(req.body).then((response)=>{
if(response.exist){
  categoryExistError = "This category is already exist";
  res.redirect('/admin/category-managment')
}
else{
  res.redirect('/admin/category-managment');
}
  });


})



/* POST subcategory . */

router.post('/add-subcategory',(req,res)=>{
console.log(req.body);
categoryhelpers.addSubcategory(req.body).then((response)=>{
  if(response.exist){
    subcategoryExistError = "subcategory already exist";
    res.redirect('/admin/category-managment');
  }
  else{
    res.redirect('/admin/category-managment');
    
  }
})



})



/* GET brand managment. */
router.get('/brand-managment',(req,res)=>{
  res.render('admin/brand-managment', { admin:true,brandExistError });
  bannerExistError = "";
});



/* POST brand managment. */
router.post('/brand-managment',(req,res)=>{

brandhelpers.brandAdd(req.body).then((response,data)=>{
  
if(response.exist){
  brandExistError = "This brand is already exist";
  res.redirect('/admin/brand-managment')
}

else{

     console.log(response.data);
   brandId = response.data.insertedId;
let logo = req.files.logo;

 logo.mv('./public/images/brand-images/'+brandId+'.png',(err,done)=>{
   if(!err){
     res.redirect('/admin/brand-managment')
   }
   else{
     console.log(err);
   }
 })
}
})
});



/* GET view product. */
router.get('/view-product', function(req, res, next) {
  res.render('admin/view-product', { admin:true });
});


/* GET add product. */
router.get('/add-product', function(req, res, next) {
  res.render('admin/add-product', { admin:true });
});










/* GET admin logout. */
router.get('/adminlogin', function(req, res, next) {
  res.render('admin/adminlogin', { admin:true });
});





module.exports = router;
