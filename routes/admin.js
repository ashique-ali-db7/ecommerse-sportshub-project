const e = require('express');
const { response } = require('express');
var express = require('express');
var router = express.Router();
var fs = require('fs');

var brandhelpers = require('../helpers/brandhelpers');
var categoryhelpers = require('../helpers/categoryhelpers');
var producthelpers = require('../helpers/producthelpers');


var brandExistError = "";
var categoryExistError = "";
var subcategoryExistError = "";
var productExistError = "";

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


/* Delete category . */
router.post('/delete-category',(req,res)=>{

  categoryhelpers.deleteCategory(req.body).then((response)=>{
    res.redirect('/admin/category-managment');
  })
});



// select-category-for-form

router.get('/select-category-for-form',(req,res)=>{
 
 categoryhelpers.getSubcategoriesForForm(req.query).then((response)=>{
  
    res.send(response);
  })
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

});

/* Delete subcategory . */
router.get('/delete-subcategory',(req,res)=>{
  console.log(req.query);

   categoryhelpers.deletesubCategory(req.query).then(()=>{
     res.redirect('/admin/category-managment');
   });
});


/* GET brand managment. */
router.get('/brand-managment',(req,res)=>{

  brandhelpers.getBrand().then((response)=>{
    let brandData = response;
    res.render('admin/brand-managment', { admin:true,brandExistError,brandData});
  bannerExistError = "";
  })
  
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
  producthelpers.getProduct().then((products)=>{
    console.log(products)
    res.render('admin/view-product', { admin:true,products});
  })
  
});


/* GET add product. */
router.get('/add-product', function(req, res, next) {
  categoryhelpers.getCategory().then((categoryData)=>{
    brandhelpers.getBrand().then((brandData)=>{
      res.render('admin/add-product', { admin:true,categoryData,brandData,productExistError});
      productExistError = "";
    })
   
  })
 
});
/* post add product. */
router.post('/add-product',(req,res)=>{
producthelpers.addProduct(req.body).then((response)=>{
  if(response.exist){
    productExistError = "This product id is already exist";
    res.redirect('/admin/add-product');
  }else{

    let image1 = req.files.image1;
    let image2 = req.files.image2;
    let image3 = req.files.image3;
    let image4 = req.files.image4;
    productId = response.data.insertedId;
    image1.mv('./public/images/product-images/'+productId+'1.png',(err,done)=>{
      if(!err){
      
        image2.mv('./public/images/product-images/'+productId+'2.png',(err,done)=>{
          if(!err){
          
            image3.mv('./public/images/product-images/'+productId+'3.png',(err,done)=>{
              if(!err){

                image4.mv('./public/images/product-images/'+productId+'4.png',(err,done)=>{
                  if(!err){
                     res.redirect('/admin/add-product');
                  }
                  else{
                    console.log(err);
                  }
                })
              }
              else{
                console.log(err);
              }
            })

          }
          else{
            
            console.log(err);
          }
        })



      }
      else{
        console.log(err);
      }
    })
  }
})
})



// Get edit product
router.get('/edit-product',(req,res)=>{
  console.log(req.query);
  categoryhelpers.getCategory().then((categoryData)=>{
    brandhelpers.getBrand().then((brandData)=>{

      producthelpers.getSingleProductDetailsForEdit(req.query).then((response)=>{
        let data = response;
       
        
        res.render('admin/edit-product',{admin:true,data,categoryData,brandData});
      })
     
    })
   
  })



});

// post edit product
router.post('/edit-product',(req,res)=>{
  productid = req.query
  let id = req.query.id;

  let image1Path = './public/images/product-images/'+id+'1.png';
  let image2Path = './public/images/product-images/'+id+'2.png';
  let image3Path = './public/images/product-images/'+id+'3.png';
  let image4Path = './public/images/product-images/'+id+'4.png';
//Delete the file image.png:

  if (fs.existsSync(image1Path)) {
    fs.unlink('./public/images/product-images/'+id+'1.png', function (err) {
      if (err) throw err;
      console.log('File deleted!');
    });
  } else {
    console.log("File does not exist.")
  }


  if (fs.existsSync(image2Path)) {
    
fs.unlink('./public/images/product-images/'+id+'2.png', function (err) {
  if (err) throw err;
  console.log('File deleted!');
});
  } else {
    console.log("File does not exist.")
  }


  if (fs.existsSync(image3Path)) {
    
   
fs.unlink('./public/images/product-images/'+id+'3.png', function (err) {
  if (err) throw err;
  console.log('File deleted!');
});
      } else {
        console.log("File does not exist.")
      }

      if (fs.existsSync(image4Path)) {
    
   
       
fs.unlink('./public/images/product-images/'+id+'4.png', function (err) {
  if (err) throw err;
  console.log('File deleted!');
});
              } else {
                console.log("File does not exist.")
              }







  producthelpers.editProduct(req.body,productid).then((response)=>{
    
    let image1 = req.files.image1;
    let image2 = req.files.image2;
    let image3 = req.files.image3;
    let image4 = req.files.image4;
    image1.mv('./public/images/product-images/'+id+'1.png',(err,done)=>{
      if(!err){
        image2.mv('./public/images/product-images/'+id+'2.png',(err,done)=>{
          if(!err){
            image3.mv('./public/images/product-images/'+id+'3.png',(err,done)=>{
              if(!err){
                image4.mv('./public/images/product-images/'+id+'4.png',(err,done)=>{
                  if(!err){
                     res.redirect('/admin/view-product');
                  }
                  else{
                    console.log(err);
                  }
                })
              }
              else{
                console.log(err);
              }
            })
          }
          else{
            console.log(err);
          }
        })
      }
      else{
        console.log(err);
      }
    })

  });
})





/* GET admin logout. */
router.get('/adminlogin', function(req, res, next) {
  res.render('admin/adminlogin', { admin:true });
});





module.exports = router;
