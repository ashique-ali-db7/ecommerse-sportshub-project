var db = require("../config/connection");

var collections = require("../config/collection");
const { response } = require("express");

module.exports = {
  addCategory: (data) => {
    return new Promise(async (resolve, reject) => {
      let response = {};

      let categoryCheck = await db
        .get()
        .collection(collections.CATEGORY_DETAILS_COLLECTION)
        .findOne({ category: data.category });

      if (categoryCheck) {
        response.exist = true;
        resolve(response);
      } else {
        await db
          .get()
          .collection(collections.CATEGORY_DETAILS_COLLECTION)
          .insertOne(data);
        response.exist = false;
        resolve(response);
      }
    });
  },

  getCategory: () => {
    return new Promise(async (resolve, reject) => {
      let allCategory = await db
        .get()
        .collection(collections.CATEGORY_DETAILS_COLLECTION)
        .find()
        .toArray();
      resolve(allCategory);
    });
  },

  addSubcategory: (data) => {
    return new Promise(async (resolve, reject) => {
      let response = {};
      let subcategoryexist = await db
        .get()
        .collection(collections.CATEGORY_DETAILS_COLLECTION)
        .findOne({
          $and: [
            { category: data.categorySubcategory },
            { subcategory: data.subcategory },
          ],
        });

      if (subcategoryexist) {
        response.exist = true;
        resolve(response);
      } else {
        await db
          .get()
          .collection(collections.CATEGORY_DETAILS_COLLECTION)
          .updateOne(
            { category: data.categorySubcategory },
            { $push: { subcategory: data.subcategory } }
          );
        response.exist = false;
        resolve(response);
      }
    });
  },
  deleteCategory: (data) => {
    return new Promise(async (resolve, reject) => {
      await db
        .get()
        .collection(collections.CATEGORY_DETAILS_COLLECTION)
        .deleteOne({ category: data.category })
        .then((result) => {
          resolve();
        });
    });
  },

  deletesubCategory: (data) => {
    return new Promise(async (resolve, reject) => {
      await db
        .get()
        .collection(collections.CATEGORY_DETAILS_COLLECTION)
        .updateOne(
          { category: data.category },
          { $pull: { subcategory: data.subcategory } }
        )
        .then((data) => {
          resolve();
        });
    });
  },
  getSubcategoriesForForm: (data) => {
    return new Promise(async (resolve, reject) => {
      let result = await db
        .get()
        .collection(collections.CATEGORY_DETAILS_COLLECTION)
        .findOne({ category: data.category });
      resolve(result);
    });
  },
  addBannerone: (data) => {
    console.log(data);
    return new Promise(async (resolve, reject) => {
      let response = {};
      let bannerOne = await db
        .get()
        .collection(collections.BANNER_DETAILS_COLLECTION)
        .findOne({ banner: "one" });
      if (bannerOne) {
        db.get()
          .collection(collections.BANNER_DETAILS_COLLECTION)
          .updateOne(
            { banner: "one" },
            {
              $set: {
                bannerOneHeading: data.banner1heading,
                bannerOneDescription: data.banner1description,
                category: data.firstmainbannercategory,
              },
            }
          );

        response.id = bannerOne._id;
        response.exist = true;
        resolve(response);
      } else {
        db.get()
          .collection(collections.BANNER_DETAILS_COLLECTION)
          .insertOne({
            banner: "one",
            bannerOneHeading: data.banner1heading,
            bannerOneDescription: data.banner1description,
            category: data.firstmainbannercategory,
          })
          .then((response) => {
            response.id = response.insertedId;
            response.exist = false;
            resolve(response);
          });
      }
    });
  },

  addBannertwo: (data) => {
    return new Promise(async (resolve, reject) => {
      let response = {};
      let bannerTwo = await db
        .get()
        .collection(collections.BANNER_DETAILS_COLLECTION)
        .findOne({ banner: "two" });
      if (bannerTwo) {
        db.get()
          .collection(collections.BANNER_DETAILS_COLLECTION)
          .updateOne(
            { banner: "two" },
            {
              $set: {
                bannerTwoHeading: data.banner2heading,
                bannerTwoDescription: data.banner2description,
                category: data.secondmainbannercategory,
              },
            }
          );

        response.id = bannerTwo._id;
        response.exist = true;
        resolve(response);
      } else {
        db.get()
          .collection(collections.BANNER_DETAILS_COLLECTION)
          .insertOne({
            banner: "two",
            bannerTwoHeading: data.banner2heading,
            bannerTwoDescription: data.banner2description,
            category: data.secondmainbannercategory,
          })
          .then((response) => {
            response.id = response.insertedId;
            response.exist = false;
            resolve(response);
          });
      }
    });
  },

  getBannerOne: () => {
    return new Promise(async (resolve, reject) => {
      let bannerOne = await db
        .get()
        .collection(collections.BANNER_DETAILS_COLLECTION)
        .findOne({ banner: "one" });
      resolve(bannerOne);
    });
  },
  getBannerTwo: () => {
    return new Promise(async (resolve, reject) => {
      let bannerTwo = await db
        .get()
        .collection(collections.BANNER_DETAILS_COLLECTION)
        .findOne({ banner: "two" });
      resolve(bannerTwo);
    });
  },
  categoryBannerOneadds: (category) => {
    return new Promise(async (resolve, reject) => {
      let categoryBannerOnedata = await db
        .get()
        .collection(collections.BANNER_DETAILS_COLLECTION)
        .findOne({ categorybanner: "one" });
      if (categoryBannerOnedata) {
        db.get()
          .collection(collections.BANNER_DETAILS_COLLECTION)
          .updateOne(
            { categorybanner: "one" },
            { $set: { category: category } }
          );
        response.id = categoryBannerOnedata._id;
        response.exist = true;
        resolve(response);
      } else {
        db.get()
          .collection(collections.BANNER_DETAILS_COLLECTION)
          .insertOne({ categorybanner: "one", category: category })
          .then((response) => {
            response.id = response.insertedId;
            response.exist = false;
            resolve(response);
          });
      }
    });
  },
  categoryBannerTwoadds: (category) => {
    console.log("hihihihihhihihi");
    console.log(category);
    return new Promise(async (resolve, reject) => {
      let categoryBannerTwodata = await db
        .get()
        .collection(collections.BANNER_DETAILS_COLLECTION)
        .findOne({ categorybanner: "two" });
      if (categoryBannerTwodata) {
        db.get()
          .collection(collections.BANNER_DETAILS_COLLECTION)
          .updateOne(
            { categorybanner: "two" },
            { $set: { category: category } }
          );
        response.id = categoryBannerTwodata._id;
        response.exist = true;
        resolve(response);
      } else {
        db.get()
          .collection(collections.BANNER_DETAILS_COLLECTION)
          .insertOne({ categorybanner: "two", category: category })
          .then((response) => {
            response.id = response.insertedId;
            response.exist = false;
            resolve(response);
          });
      }
    });
  },
  categoryBannerThreeadds: (category) => {
    return new Promise(async (resolve, reject) => {
      let categoryBannerThreedata = await db
        .get()
        .collection(collections.BANNER_DETAILS_COLLECTION)
        .findOne({ categorybanner: "three" });
      if (categoryBannerThreedata) {
        db.get()
          .collection(collections.BANNER_DETAILS_COLLECTION)
          .updateOne(
            { categorybanner: "three" },
            { $set: { category: category } }
          );
        response.id = categoryBannerThreedata._id;
        response.exist = true;
        resolve(response);
      } else {
        db.get()
          .collection(collections.BANNER_DETAILS_COLLECTION)
          .insertOne({ categorybanner: "three", category: category })
          .then((response) => {
            response.id = response.insertedId;
            response.exist = false;
            resolve(response);
          });
      }
    });
  },
  getCategoryBannerOne: () => {
    return new Promise(async (resolve, reject) => {
      let categoryBannerOne = await db
        .get()
        .collection(collections.BANNER_DETAILS_COLLECTION)
        .findOne({ categorybanner: "one" });
      resolve(categoryBannerOne);
    });
  },
  getCategoryBannerTwo: () => {
    console.log("noivide");
    return new Promise(async (resolve, reject) => {
      let categoryBannerTwo = await db
        .get()
        .collection(collections.BANNER_DETAILS_COLLECTION)
        .findOne({ categorybanner: "two" });
      resolve(categoryBannerTwo);
    });
  },
  getCategoryBannerThree: () => {
    return new Promise(async (resolve, reject) => {
      let categoryBannerThree = await db
        .get()
        .collection(collections.BANNER_DETAILS_COLLECTION)
        .findOne({ categorybanner: "three" });
      resolve(categoryBannerThree);
    });
  },
  allSubCategories: (categoryname) => {
    return new Promise(async (resolve, reject) => {
      let subcategories = await db
        .get()
        .collection(collections.CATEGORY_DETAILS_COLLECTION)
        .aggregate([
          { $match: { category: categoryname } },
          { $unwind: "$subcategory" },
        ])
        .toArray();
      resolve(subcategories);
    });
  },
  homepageproductsone: (category) => {
    return new Promise(async (resolve, reject) => {
      let categoryhomeproductsone = await db
        .get()
        .collection(collections.BANNER_DETAILS_COLLECTION)
        .findOne({ homeproducts: "one" });
      if (categoryhomeproductsone) {
        db.get()
          .collection(collections.BANNER_DETAILS_COLLECTION)
          .updateOne({ homeproducts: "one" }, { $set: { category: category } });
        response.id = categoryhomeproductsone._id;
        response.exist = true;
        resolve(response);
      } else {
        db.get()
          .collection(collections.BANNER_DETAILS_COLLECTION)
          .insertOne({ homeproducts: "one", category: category })
          .then((response) => {
            response.id = response.insertedId;
            response.exist = false;
            resolve(response);
          });
      }
    });
  },
  homepageproductstwo: (category) => {
    return new Promise(async (resolve, reject) => {
      let categoryhomeproductstwo = await db
        .get()
        .collection(collections.BANNER_DETAILS_COLLECTION)
        .findOne({ homeproducts: "two" });
      if (categoryhomeproductstwo) {
        db.get()
          .collection(collections.BANNER_DETAILS_COLLECTION)
          .updateOne({ homeproducts: "two" }, { $set: { category: category } });
        response.id = categoryhomeproductstwo._id;
        response.exist = true;
        resolve(response);
      } else {
        db.get()
          .collection(collections.BANNER_DETAILS_COLLECTION)
          .insertOne({ homeproducts: "two", category: category })
          .then((response) => {
            response.id = response.insertedId;
            response.exist = false;
            resolve(response);
          });
      }
    });
  },
  categoryProductOneForHome: () => {
    return new Promise(async (resolve, reject) => {
      let productcategoryOne = await db
        .get()
        .collection(collections.BANNER_DETAILS_COLLECTION)
        .findOne({ homeproducts: "one" });
      resolve(productcategoryOne);
    });
  },
  categoryProductTwoForHome: () => {
    return new Promise(async (resolve, reject) => {
      let productcategoryTwo = await db
        .get()
        .collection(collections.BANNER_DETAILS_COLLECTION)
        .findOne({ homeproducts: "two" });
      resolve(productcategoryTwo);
    });
  },

  categoryBannerOne: () => {
    return new Promise(async (resolve, reject) => {
      let categorybannerone = await db
        .get()
        .collection(collections.BANNER_DETAILS_COLLECTION)
        .findOne({ categorybanner: "one" });

      resolve(categorybannerone);
    });
  },

  categoryBannerTwo: () => {
    console.log("ivade");
    return new Promise(async (resolve, reject) => {
      let categorybannertwo = await db
        .get()
        .collection(collections.BANNER_DETAILS_COLLECTION)
        .findOne({ categorybanner: "two" });

      resolve(categorybannertwo);
    });
  },

  categoryBannerThree: () => {
    return new Promise(async (resolve, reject) => {
      let categorybannerthree = await db
        .get()
        .collection(collections.BANNER_DETAILS_COLLECTION)
        .findOne({ categorybanner: "three" });
      resolve(categorybannerthree);
    });
  },

  homeProductsOne: () => {
    return new Promise(async (resolve, reject) => {
      let homeProductsOne = await db
        .get()
        .collection(collections.BANNER_DETAILS_COLLECTION)
        .findOne({ homeproducts: "one" });
      resolve(homeProductsOne);
    });
  },

  homeProductsTwo: () => {
    return new Promise(async (resolve, reject) => {
      let homeProductsTwo = await db
        .get()
        .collection(collections.BANNER_DETAILS_COLLECTION)
        .findOne({ homeproducts: "two" });
      resolve(homeProductsTwo);
    });
  },

  addCoupen: (data) => {
    data.coupenIsoStartDate = new Date(data.coupenstartdate);
    data.coupenIsoEndDate = new Date(data.coupenenddate);
    return new Promise(async (resolve, reject) => {
      let response = {};
      let result = await db
        .get()
        .collection(collections.COUPEN_DETAILS_COLLECTION)
        .findOne({ coupencode: data.coupencode });

      if (result) {
        response.exist = true;

        resolve(response);
      } else {
        db.get()
          .collection(collections.COUPEN_DETAILS_COLLECTION)
          .insertOne(data);
        response.added = true;
        resolve(response);
      }
    });
  },

  getCoupenDetails: () => {
    return new Promise(async (resolve, reject) => {
      let details = await db
        .get()
        .collection(collections.COUPEN_DETAILS_COLLECTION)
        .find()
        .toArray();

      resolve(details);
    });
  },

  deleteCoupen: (coupencode) => {
    return new Promise(async (resolve, reject) => {
      db.get()
        .collection(collections.COUPEN_DETAILS_COLLECTION)
        .deleteOne({ coupencode: coupencode });
      resolve();
    });
  },
};
