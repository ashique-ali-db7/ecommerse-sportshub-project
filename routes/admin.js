const e = require("express");
const { response } = require("express");
var express = require("express");
var router = express.Router();
var fs = require("fs");

var brandhelpers = require("../helpers/brandhelpers");
var categoryhelpers = require("../helpers/categoryhelpers");
var producthelpers = require("../helpers/producthelpers");
var userhelpers = require("../helpers/userhelpers");

var brandExistError = "";
var categoryExistError = "";
var subcategoryExistError = "";
var productExistError = "";
var varsubcategoryError = "";
var invalidusername = "";
let categoryofferExistError = "";
let productofferExistError = "";
let coupenCountError = "";
let coupenExistError = "";

const verifyLogin = (req, res, next) => {
  if (req.session.admin) {
    next();
  } else {
    res.redirect("/admin/adminlogin");
  }
};

/* GET home page. */
router.get("/", verifyLogin, async function (req, res, next) {
  res.header(
    "Cache-Control",
    "no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0"
  );

  let totalorders = await producthelpers.totalOrders();

  let revenue = await producthelpers.totalRevenue();

  let totalUsers = await producthelpers.totalUsers();

  let totalProducts = await producthelpers.totalProducts();

  let topSellingProducts = await producthelpers.topSellingProducts();

  let recenteOrders = await producthelpers.recenteOrders();

  let todayDate = new Date().toISOString().slice(0, 10);

  let todaySales = await producthelpers.todaySales(todayDate);

  let todayOrders = await producthelpers.todayOrders(todayDate);

  let result1 = await producthelpers.startCategoryOffers(todayDate);

  let result2 = await producthelpers.startProductOffers(todayDate);

  producthelpers.deleteExpiredproductoffers(todayDate).then(() => {
    producthelpers.deleteExpiredCategoryoffers(todayDate).then(() => {
      res.render("admin/dashboard", {
        admin: true,
        totalorders,
        revenue,
        totalUsers,
        totalProducts,
        topSellingProducts,
        recenteOrders,
        todaySales,
        todayOrders,
      });
    });
  });
});

// get chart data

router.get("/chartdata", async (req, res) => {
  let response = {};
  const orderstatus = [];
  let deliverdorders = await producthelpers.deliveredOrders();

  let placeddorders = await producthelpers.placedOrders();

  let pendingdorders = await producthelpers.pendingOrders();

  let canceleddorders = await producthelpers.canceledOrders();

  orderstatus.push(
    deliverdorders,
    placeddorders,
    pendingdorders,
    canceleddorders
  );

  let paymentCount = await producthelpers.paymentCount();

  let dailysalescount = await producthelpers.dailysalescount();

  let categorysalescount = await producthelpers.totalCategorysales();

  response.paymentCount = paymentCount;
  response.orderstatus = orderstatus;
  response.dailysalescount = dailysalescount;
  response.categorysalescount = categorysalescount;

  res.send(response);
});

/* GET category managment. */
router.get("/category-managment", verifyLogin, (req, res) => {
  res.header(
    "Cache-Control",
    "no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0"
  );
  categoryhelpers.getCategory().then((categoryData) => {
    res.render("admin/category-managment", {
      admin: true,
      categoryExistError,
      categoryData,
      subcategoryExistError,
    });
    categoryExistError = "";
    subcategoryExistError = "";
  });
});

/* POST category . */

router.post("/add-category", verifyLogin, (req, res) => {
  categoryhelpers.addCategory(req.body).then((response) => {
    if (response.exist) {
      categoryExistError = "This category is already exist";
      res.redirect("/admin/category-managment");
    } else {
      res.redirect("/admin/category-managment");
    }
  });
});

/* Delete category . */
router.post("/delete-category", verifyLogin, (req, res) => {
  categoryhelpers.deleteCategory(req.body).then((response) => {
    res.redirect("/admin/category-managment");
  });
});

// select-category-for-form

router.get("/select-category-for-form", verifyLogin, (req, res) => {
  res.header(
    "Cache-Control",
    "no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0"
  );
  categoryhelpers.getSubcategoriesForForm(req.query).then((response) => {
    res.send(response);
  });
});

/* POST subcategory . */

router.post("/add-subcategory", verifyLogin, (req, res) => {
  categoryhelpers.addSubcategory(req.body).then((response) => {
    if (response.exist) {
      subcategoryExistError = "subcategory already exist";
      res.redirect("/admin/category-managment");
    } else {
      res.redirect("/admin/category-managment");
    }
  });
});

/* Delete subcategory . */
router.get("/delete-subcategory", verifyLogin, (req, res) => {
  res.header(
    "Cache-Control",
    "no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0"
  );

  categoryhelpers.deletesubCategory(req.query).then(() => {
    res.redirect("/admin/category-managment");
  });
});

/* GET brand managment. */
router.get("/brand-managment", verifyLogin, (req, res) => {
  brandhelpers.getBrand().then((response) => {
    let brandData = response;
    res.render("admin/brand-managment", {
      admin: true,
      brandExistError,
      brandData,
    });
    brandExistError = "";
  });
});

/* POST brand managment. */
router.post("/brand-managment", verifyLogin, (req, res) => {
  brandhelpers.brandAdd(req.body).then((response, data) => {
    if (response.exist) {
      brandExistError = "This brand is already exist";
      res.redirect("/admin/brand-managment");
    } else {
      brandId = response.data.insertedId;
      let logo = req.files?.logo;

      logo.mv(
        "./public/images/brand-images/" + brandId + ".png",
        (err, done) => {
          if (!err) {
            res.redirect("/admin/brand-managment");
          } else {
            console.log(err);
          }
        }
      );
    }
  });
});

// get delete brand

router.get("/deletebrand", verifyLogin, (req, res) => {
  res.header(
    "Cache-Control",
    "no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0"
  );
  brandhelpers.deleteBrand(req.query).then(() => {
    res.redirect("/admin/brand-managment");
  });
});

// edit brand
router.get("/editbrand", verifyLogin, (req, res) => {
  brandhelpers.getSingleBrand(req.query).then((response) => {
    let singleBrand = response;

    res.render("admin/editbrand", {
      admin: true,
      singleBrand,
      brandExistError,
    });
    brandExistError = "";
  });
});

router.post("/editbrand", (req, res) => {
  let id = req.query.id;
  brandhelpers.updateBrand(req.body, id).then((response) => {
    let logo = req.files?.logo;

    if (logo) {
      if (fs.existsSync("./public/images/brand-images/" + id + ".png")) {
        fs.unlink(
          "./public/images/brand-images/" + id + ".png",
          function (err) {
            if (err) throw err;
            console.log("File deleted!");
          }
        );
      }
      logo.mv("./public/images/brand-images/" + id + ".png", (err, done) => {
        if (!err) {
          res.redirect("/admin/brand-managment");
        } else {
          console.log(err);
        }
      });
    } else {
      res.redirect("/admin//brand-managment");
    }
  });
});

/* GET view product. */
router.get("/view-product", verifyLogin, function (req, res, next) {
  res.header(
    "Cache-Control",
    "no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0"
  );
  producthelpers.getProduct().then((products) => {
    console.log(products);
    res.render("admin/view-product", { admin: true, products });
  });
});

/* GET add product. */
router.get("/add-product", verifyLogin, function (req, res, next) {
  res.header(
    "Cache-Control",
    "no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0"
  );
  categoryhelpers.getCategory().then((categoryData) => {
    brandhelpers.getBrand().then((brandData) => {
      res.render("admin/add-product", {
        admin: true,
        categoryData,
        brandData,
        productExistError,
        varsubcategoryError,
      });
      productExistError = "";
      varsubcategoryError = "";
    });
  });
});
/* post add product. */
router.post("/add-product", verifyLogin, (req, res) => {
  if (req.body.subcategory == 0) {
    varsubcategoryError = "This field is required";
    res.redirect("/admin/add-product");
  } else {
    producthelpers.addProduct(req.body).then((response) => {
      if (response.exist) {
        productExistError = "This product id is already exist";
        res.redirect("/admin/add-product");
      } else {
        let image1 = req.files.image1;
        let image2 = req.files.image2;
        let image3 = req.files.image3;
        let image4 = req.files.image4;
        productId = response.data.insertedId;
        image1.mv(
          "./public/images/product-images/" + productId + "1.png",
          (err, done) => {
            if (!err) {
              image2.mv(
                "./public/images/product-images/" + productId + "2.png",
                (err, done) => {
                  if (!err) {
                    image3.mv(
                      "./public/images/product-images/" + productId + "3.png",
                      (err, done) => {
                        if (!err) {
                          image4.mv(
                            "./public/images/product-images/" +
                              productId +
                              "4.png",
                            (err, done) => {
                              if (!err) {
                                res.redirect("/admin/add-product");
                              } else {
                                console.log(err);
                              }
                            }
                          );
                        } else {
                          console.log(err);
                        }
                      }
                    );
                  } else {
                    console.log(err);
                  }
                }
              );
            } else {
              console.log(err);
            }
          }
        );
      }
    });
  }
});

// Get edit product
router.get("/edit-product", verifyLogin, (req, res) => {
  res.header(
    "Cache-Control",
    "no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0"
  );

  let id = req.query.id;

  categoryhelpers.getCategory().then((categoryData) => {
    brandhelpers.getBrand().then((brandData) => {
      producthelpers
        .getSingleProductDetailsForEdit(req.query)
        .then((response) => {
          let data = response;
          let smallquantity = data.instock[0].quantity;
          let mediumquantity = data.instock[1].quantity;
          let largequantity = data.instock[2].quantity;

          res.render("admin/edit-product", {
            admin: true,
            data,
            categoryData,
            brandData,
            smallquantity,
            mediumquantity,
            largequantity,
          });
        });
    });
  });
});

// post edit product
router.post("/edit-product", (req, res) => {
  productid = req.query;
  let id = req.query.id;

  //   let image1Path = './public/images/product-images/'+id+'1.png';
  //   let image2Path = './public/images/product-images/'+id+'2.png';
  //   let image3Path = './public/images/product-images/'+id+'3.png';
  //   let image4Path = './public/images/product-images/'+id+'4.png';
  // //Delete the file image.png:

  //   if (fs.existsSync(image1Path)) {
  //     fs.unlink('./public/images/product-images/'+id+'1.png', function (err) {
  //       if (err) throw err;
  //       console.log('File deleted!');
  //     });
  //   } else {
  //     console.log("File does not exist.")
  //   }

  //   if (fs.existsSync(image2Path)) {

  // fs.unlink('./public/images/product-images/'+id+'2.png', function (err) {
  //   if (err) throw err;
  //   console.log('File deleted!');
  // });
  //   } else {
  //     console.log("File does not exist.")
  //   }

  //   if (fs.existsSync(image3Path)) {

  // fs.unlink('./public/images/product-images/'+id+'3.png', function (err) {
  //   if (err) throw err;
  //   console.log('File deleted!');
  // });
  //       } else {
  //         console.log("File does not exist.")
  //       }

  //       if (fs.existsSync(image4Path)) {

  // fs.unlink('./public/images/product-images/'+id+'4.png', function (err) {
  //   if (err) throw err;
  //   console.log('File deleted!');
  // });
  //               } else {
  //                 console.log("File does not exist.")
  //               }

  producthelpers.editProduct(req.body, productid).then((response) => {
    let image1 = req.files?.image1;
    let image2 = req.files?.image2;
    let image3 = req.files?.image3;
    let image4 = req.files?.image4;
    if (image1) {
      if (fs.existsSync("./public/images/product-images/" + id + "1.png")) {
        fs.unlink(
          "./public/images/product-images/" + id + "1.png",
          function (err) {
            if (err) throw err;
            console.log("File deleted!");
          }
        );
      }
      image1.mv(
        "./public/images/product-images/" + id + "1.png",
        (err, done) => {
          if (!err) {
          } else {
            console.log(err);
          }
        }
      );
    }
    if (image2) {
      if (fs.existsSync("./public/images/product-images/" + id + "2.png")) {
        fs.unlink(
          "./public/images/product-images/" + id + "2.png",
          function (err) {
            if (err) throw err;
            console.log("File deleted!");
          }
        );
      }
      image2.mv(
        "./public/images/product-images/" + id + "2.png",
        (err, done) => {
          if (!err) {
          } else {
            console.log(err);
          }
        }
      );
    }
    if (image3) {
      if (fs.existsSync("./public/images/product-images/" + id + "3.png")) {
        fs.unlink(
          "./public/images/product-images/" + id + "3.png",
          function (err) {
            if (err) throw err;
            console.log("File deleted!");
          }
        );
      }
      image3.mv(
        "./public/images/product-images/" + id + "3.png",
        (err, done) => {
          if (!err) {
          } else {
            console.log(err);
          }
        }
      );
    }
    if (image4) {
      if (fs.existsSync("./public/images/product-images/" + id + "4.png")) {
        fs.unlink(
          "./public/images/product-images/" + id + "4.png",
          function (err) {
            if (err) throw err;
            console.log("File deleted!");
          }
        );
      }
      image4.mv(
        "./public/images/product-images/" + id + "4.png",
        (err, done) => {
          if (!err) {
            res.redirect("/admin/view-product");
          } else {
            console.log(err);
          }
        }
      );
    } else {
      res.redirect("/admin/view-product");
    }
    // image1.mv('./public/images/product-images/'+id+'1.png',(err,done)=>{
    //   if(!err){
    //     image2.mv('./public/images/product-images/'+id+'2.png',(err,done)=>{
    //       if(!err){
    //         image3.mv('./public/images/product-images/'+id+'3.png',(err,done)=>{
    //           if(!err){
    //             image4.mv('./public/images/product-images/'+id+'4.png',(err,done)=>{
    //               if(!err){
    //                  res.redirect('/admin/view-product');
    //               }
    //               else{
    //                 console.log(err);
    //               }
    //             })
    //           }
    //           else{
    //             console.log(err);
    //           }
    //         })
    //       }
    //       else{
    //         console.log(err);
    //       }
    //     })
    //   }
    //   else{
    //     console.log(err);
    //   }
    // })
  });
});

// get delete product

router.get("/deleteproduct", verifyLogin, (req, res) => {
  res.header(
    "Cache-Control",
    "no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0"
  );
  producthelpers.deleteProduct(req.query).then((response) => {
    res.redirect("/admin/view-product");
  });
});

// user managment

router.get("/usermanagment", verifyLogin, (req, res) => {
  userhelpers.getAllUsers().then((response) => {
    let allusers = response;
    res.render("admin/user-managment", { admin: true, allusers });
  });
});

//block user

router.get("/blockuser", (req, res) => {
  let phonenumber = req.query.phonenumber;
  userhelpers.blockUser(phonenumber).then((response) => {
    res.redirect("/admin/usermanagment");
  });
});

router.get("/unblockuser", (req, res) => {
  let phonenumber = req.query.phonenumber;
  userhelpers.unblockUser(phonenumber).then((response) => {
    res.redirect("/admin/usermanagment");
  });
});

/* GET admin login. */
router.get("/adminlogin", function (req, res, next) {
  res.header(
    "Cache-Control",
    "no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0"
  );
  if (req.session.admin) {
    res.redirect("/admin");
  } else {
    res.render("admin/adminlogin", {
      admin: true,
      login: true,
      invalidusername,
    });
    invalidusername = "";
  }
});

// post admin login
router.post("/adminlogin", (req, res) => {
  userhelpers.adminLogin(req.body).then((response) => {
    if (response.exist) {
      req.session.admin = response;

      res.redirect("/admin");
    } else {
      invalidusername = "Invalid user name or password";
      res.redirect("/admin/adminlogin");
    }
  });
}),
  // get order managment
  router.get("/ordermanagment", verifyLogin, (req, res) => {
    res.header(
      "Cache-Control",
      "no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0"
    );
    if (req.session.admin) {
      userhelpers.getOrderDetails().then((response) => {
        let allOrders = response;

        res.render("admin/order-managment", { admin: true, allOrders });
      });
    } else {
      res.redirect("/admin/adminlogin");
    }
  });

// change order status
router.get("/changeorderstatus", (req, res) => {
  let orderid = req.query.orderid;
  let orderstatus = req.query.orderstatus;
  let proId = req.query.proId;
  let size = req.query.size;

  userhelpers.changeOrderStatus(orderid, orderstatus, proId, size).then(() => {
    res.json({ orderstatus: orderstatus });
  });
});

//view orderd products
router.get("/orderproductsview", verifyLogin, (req, res) => {
  let orderid = req.query.orderid;
  userhelpers.getorderedproditdetils(orderid).then((response) => {
    res.render("admin/view-ordered-products", { admin: true, response });
  });
});

router.get("/bannermanagment", verifyLogin, async (req, res) => {
  if (req.session.admin) {
    let categoryData = await categoryhelpers.getCategory();
    let bannerOne = await categoryhelpers.getBannerOne();
    let bannerTwo = await categoryhelpers.getBannerTwo();
    let categoryBannerOne = await categoryhelpers.categoryBannerOne();
    let categoryBannerTwo = await categoryhelpers.categoryBannerTwo();
    let categoryBannerThree = await categoryhelpers.categoryBannerThree();
    let homeProductsOne = await categoryhelpers.homeProductsOne();
    let homeProductsTwo = await categoryhelpers.homeProductsTwo();

    res.render("admin/bannermanagment", {
      admin: true,
      categoryData,
      bannerOne,
      bannerTwo,
      categoryBannerOne,
      categoryBannerTwo,
      categoryBannerThree,
      homeProductsOne,
      homeProductsTwo,
    });
  } else {
    res.redirect("/admin/adminlogin");
  }
});

// post main banner 1
router.post("/firstmainbanner", (req, res) => {
  console.log(req.body);
  let banner1image = req.files?.banner1image;

  categoryhelpers.addBannerone(req.body).then((response) => {
    let id = response.id;
    if (response.exist) {
      if (banner1image) {
        if (fs.existsSync("./public/images/banner-images/" + id + ".png")) {
          fs.unlink(
            "./public/images/banner-images/" + id + ".png",
            function (err) {
              if (err) throw err;
              console.log("File deleted!");
            }
          );
        }
        banner1image.mv(
          "./public/images/banner-images/" + id + ".png",
          (err, done) => {
            if (!err) {
              res.redirect("/admin/bannermanagment");
            } else {
              console.log(err);
            }
          }
        );
      }
    } else {
      banner1image.mv(
        "./public/images/banner-images/" + id + ".png",
        (err, done) => {
          if (!err) {
            res.redirect("/admin/bannermanagment");
          } else {
            console.log(err);
          }
        }
      );
    }
  });
});

// post banner 2
router.post("/secondmainbanner", (req, res) => {
  let banner2image = req.files?.banner2image;

  categoryhelpers.addBannertwo(req.body).then((response) => {
    let id = response.id;
    if (response.exist) {
      if (banner2image) {
        if (fs.existsSync("./public/images/banner-images/" + id + ".png")) {
          fs.unlink(
            "./public/images/banner-images/" + id + ".png",
            function (err) {
              if (err) throw err;
              console.log("File deleted!");
            }
          );
        }
        banner2image.mv(
          "./public/images/banner-images/" + id + ".png",
          (err, done) => {
            if (!err) {
              res.redirect("/admin/bannermanagment");
            } else {
              console.log(err);
            }
          }
        );
      }
    } else {
      banner2image.mv(
        "./public/images/banner-images/" + id + ".png",
        (err, done) => {
          if (!err) {
            res.redirect("/admin/bannermanagment");
          } else {
            console.log(err);
          }
        }
      );
    }
  });
});

// post category banner one
router.post("/categorybannerone", (req, res) => {
  let category = req.body.subbannercategoryone;
  console.log("hehhehe");
  console.log(category);
  let categorybanner1image = req.files?.categorybannerimage1;
  categoryhelpers
    .categoryBannerOneadds(req.body.subbannercategoryone)
    .then((response) => {
      let id = response.id;

      if (response.exist) {
        if (categorybanner1image) {
          if (fs.existsSync("./public/images/banner-images/" + id + ".png")) {
            fs.unlink(
              "./public/images/banner-images/" + id + ".png",
              function (err) {
                if (err) throw err;
                console.log("File deleted!");
              }
            );
          }

          categorybanner1image.mv(
            "./public/images/banner-images/" + id + ".png",
            (err, done) => {
              if (!err) {
                res.redirect("/admin/bannermanagment");
              } else {
                console.log(err);
              }
            }
          );
        }
      } else {
        categorybanner1image.mv(
          "./public/images/banner-images/" + id + ".png",
          (err, done) => {
            if (!err) {
              res.redirect("/admin/bannermanagment");
            } else {
              console.log(err);
            }
          }
        );
      }
    });
});

//post category banner 2

router.post("/categorybannertwo", (req, res) => {
  let category = req.body.subbannercategorytwo;
  let categorybanner2image = req.files?.categorybannerimage2;
  categoryhelpers.categoryBannerTwoadds(category).then((response) => {
    let id = response.id;
    if (response.exist) {
      if (categorybanner2image) {
        if (fs.existsSync("./public/images/banner-images/" + id + ".png")) {
          fs.unlink(
            "./public/images/banner-images/" + id + ".png",
            function (err) {
              if (err) throw err;
              console.log("File deleted!");
            }
          );
        }

        categorybanner2image.mv(
          "./public/images/banner-images/" + id + ".png",
          (err, done) => {
            if (!err) {
              res.redirect("/admin/bannermanagment");
            } else {
              console.log(err);
            }
          }
        );
      }
    } else {
      categorybanner2image.mv(
        "./public/images/banner-images/" + id + ".png",
        (err, done) => {
          if (!err) {
            res.redirect("/admin/bannermanagment");
          } else {
            console.log(err);
          }
        }
      );
    }
  });
});

// post category banner three
router.post("/categorybannerthree", (req, res) => {
  let category = req.body.subbannercategorythree;
  let categorybanner3image = req.files?.categorybannerimage3;
  categoryhelpers.categoryBannerThreeadds(category).then((response) => {
    let id = response.id;
    if (response.exist) {
      if (categorybanner3image) {
        if (fs.existsSync("./public/images/banner-images/" + id + ".png")) {
          fs.unlink(
            "./public/images/banner-images/" + id + ".png",
            function (err) {
              if (err) throw err;
              console.log("File deleted!");
            }
          );
        }

        categorybanner3image.mv(
          "./public/images/banner-images/" + id + ".png",
          (err, done) => {
            if (!err) {
              res.redirect("/admin/bannermanagment");
            } else {
              console.log(err);
            }
          }
        );
      }
    } else {
      categorybanner3image.mv(
        "./public/images/banner-images/" + id + ".png",
        (err, done) => {
          if (!err) {
            res.redirect("/admin/bannermanagment");
          } else {
            console.log(err);
          }
        }
      );
    }
  });
});

// Post home page first category products
router.post("/homepageproductsone", (req, res) => {
  let category = req.body.category;
  let productBannerOneImage = req.files?.productbanner1image;
  categoryhelpers.homepageproductsone(category).then((response) => {
    let id = response.id;

    if (response.exist) {
      if (productBannerOneImage) {
        if (fs.existsSync("./public/images/banner-images/" + id + ".png")) {
          fs.unlink(
            "./public/images/banner-images/" + id + ".png",
            function (err) {
              if (err) throw err;
              console.log("File deleted!");
            }
          );
        }
        productBannerOneImage.mv(
          "./public/images/banner-images/" + id + ".png",
          (err, done) => {
            if (!err) {
              res.redirect("/admin/bannermanagment");
            } else {
              console.log(err);
            }
          }
        );
      }
    } else {
      productBannerOneImage.mv(
        "./public/images/banner-images/" + id + ".png",
        (err, done) => {
          if (!err) {
            res.redirect("/admin/bannermanagment");
          } else {
            console.log(err);
          }
        }
      );
    }
  });
});

// Post home page second category products
router.post("/homepageproductstwo", (req, res) => {
  let category = req.body.category;
  let productBannerTwoImage = req.files?.productbanner2image;
  categoryhelpers.homepageproductstwo(category).then((response) => {
    let id = response.id;

    if (response.exist) {
      if (productBannerTwoImage) {
        if (fs.existsSync("./public/images/banner-images/" + id + ".png")) {
          fs.unlink(
            "./public/images/banner-images/" + id + ".png",
            function (err) {
              if (err) throw err;
              console.log("File deleted!");
            }
          );
        }
        productBannerTwoImage.mv(
          "./public/images/banner-images/" + id + ".png",
          (err, done) => {
            if (!err) {
              res.redirect("/admin/bannermanagment");
            } else {
              console.log(err);
            }
          }
        );
      }
    } else {
      productBannerTwoImage.mv(
        "./public/images/banner-images/" + id + ".png",
        (err, done) => {
          if (!err) {
            res.redirect("/admin/bannermanagment");
          } else {
            console.log(err);
          }
        }
      );
    }
  });
});

// get category offer managment

router.get("/categoryoffermanagment", async (req, res) => {
  let categoryData = await categoryhelpers.getCategory();
  let categoryOffers = await producthelpers.getAllCategoryOffers();
  let todayDate = new Date().toISOString().slice(0, 10);

  let result1 = await producthelpers.startCategoryOffers(todayDate);

  let result2 = await producthelpers.startProductOffers(todayDate);

  producthelpers.deleteExpiredproductoffers(todayDate).then(() => {
    producthelpers.deleteExpiredCategoryoffers(todayDate).then(() => {
      res.render("admin/categoryoffermanagment", {
        admin: true,
        categoryData,
        categoryofferExistError,
        categoryOffers,
      });
      categoryofferExistError = "";
    });
  });

  categoryofferExistError = "";
});

router.post("/categoryoffer", (req, res) => {
  producthelpers.addCategoryOffer(req.body).then((response) => {
    if (response.exist) {
      categoryofferExistError = "This category already have a offer";
      res.redirect("/admin/categoryoffermanagment");
    } else {
      res.redirect("/admin/categoryoffermanagment");
    }
  });
});

router.get("/categoryoffereditdata", (req, res) => {
  producthelpers
    .categoryoffereditdataForEdit(req.query.categoryofferid)
    .then((response) => {
      res.send(response);
    });
});

router.get("/coupenoffereditdata", (req, res) => {
  producthelpers
    .coupenoffereditdataForEdit(req.query.coupenofferid)
    .then((response) => {
      res.send(response);
    });
});

router.post("/editcategoryoffer", (req, res) => {
  producthelpers.editCategoryOffer(req.body).then(() => {
    res.redirect("/admin/categoryoffermanagment");
  });
});

router.post("/editcouponoffer", (req, res) => {
  producthelpers.editCouponOffer(req.body).then(() => {
    let todayDate = new Date().toISOString().slice(0, 10);
    producthelpers.coupendelete(todayDate).then(() => {
      res.redirect("/admin/coupenmanagment");
    });
  });
});

router.get("/deletecategoryoffer", (req, res) => {
  producthelpers.deleteCategoryOffers(req.query).then(() => {
    res.json({ status: true });
  });
});

// get product offer managment

router.get("/productoffermanagment", verifyLogin, async (req, res) => {
  let categoryData = await categoryhelpers.getCategory();
  let allproducts = await producthelpers.getProduct();
  let productOffers = await producthelpers.getAllProductsOffers();
  let todayDate = new Date().toISOString().slice(0, 10);
  let result1 = await producthelpers.startCategoryOffers(todayDate);

  let result2 = await producthelpers.startProductOffers(todayDate);

  producthelpers.deleteExpiredproductoffers(todayDate).then(() => {
    producthelpers.deleteExpiredCategoryoffers(todayDate).then(() => {
      res.render("admin/productoffermanagment", {
        admin: true,
        categoryData,
        allproducts,
        productofferExistError,
        productOffers,
      });
      productofferExistError = "";
    });
  });
});

router.post("/productoffer", (req, res) => {
  producthelpers.addProductOffer(req.body).then((response) => {
    if (response.exist) {
      productofferExistError = "This product already have a offer";

      res.redirect("/admin/productoffermanagment");
    } else {
      res.redirect("/admin/productoffermanagment");
    }
  });
});

router.get("/productOfferEdit", (req, res) => {
  producthelpers.getEditOfferProduct(req.query).then((response) => {
    res.send(response);
  });
});

router.post("/editproductoffer", (req, res) => {
  producthelpers.editProductOffer(req.body).then(() => {
    res.redirect("/admin/productoffermanagment");
  });
});

router.get("/deleteproductoffer", (req, res) => {
  producthelpers.deleteProductOffers(req.query).then(() => {
    res.json({ status: true });
  });
});
//coupen managment

router.get("/coupenmanagment", verifyLogin, async (req, res) => {
  let categoryData = await categoryhelpers.getCategory();
  let coupendetails = await categoryhelpers.getCoupenDetails();
  let todayDate = new Date().toISOString().slice(0, 10);
  let result3 = await producthelpers.startCoupenOffers(todayDate);

  producthelpers.coupendelete(todayDate).then(() => {
    res.render("admin/coupenmanagment", {
      admin: true,
      categoryData,
      coupenCountError,
      coupenExistError,
      coupendetails,
    });
    coupenCountError = "";
    coupenExistError = "";
  });
});

// post coupen offer
router.post("/coupenoffer", (req, res) => {
  if (req.body.coupencount <= 0) {
    coupenCountError = "coupen count should be greater than one";
    res.redirect("/admin/coupenmanagment");
  } else {
    categoryhelpers.addCoupen(req.body).then((response) => {
      if (response.exist) {
        coupenExistError = "This coupen already exist";
        res.redirect("/admin/coupenmanagment");
      } else {
        res.redirect("/admin/coupenmanagment");
      }
    });
  }
});

// get delete single coupen

router.get("/deletecoupenoffer", (req, res) => {
  categoryhelpers.deleteCoupen(req.query.coupencode).then(() => {
    res.json({ status: true });
  });
});

let allProductdetails;
let checkallProductdetails = false;
let orderReport;
let checkorderReport = false;

// get sales report

router.get("/report", verifyLogin, async (req, res) => {
  if (req.session.admin) {
    res.render("admin/report", { admin: true, orderReport, checkorderReport });
    checkorderReport = false;
    checkallProductdetails = false;
  } else {
    res.redirect("/admin/adminlogin");
  }
});
router.get("/getreport", verifyLogin, async (req, res) => {
  let startDate = new Date(req.query.startDate);
  let endDate = new Date(req.query.endDate);

  orderReport = await producthelpers.orderReport(
    req.query.startDate,
    req.query.endDate
  );
  checkorderReport = true;

  res.json({ status: true });
});

// get product report

router.get("/productreport", verifyLogin, async (req, res) => {
  if (req.session.admin) {
    allProductdetails = await producthelpers.allProductsDetails();

    res.render("admin/productreport", {
      admin: true,
      allProductdetails,
      checkallProductdetails,
    });

    checkallProductdetails = false;
  } else {
    res.redirect("/admin/adminlogin");
  }
});

/* GET admin logout. */
router.get("/adminlogout", function (req, res, next) {
  res.header(
    "Cache-Control",
    "no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0"
  );

  req.session.admin = null;
  res.redirect("/admin/adminlogin");
});

module.exports = router;
