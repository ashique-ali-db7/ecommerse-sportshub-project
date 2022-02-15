var db = require("../config/connection");

var collections = require("../config/collection");

var objectId = require("mongodb").ObjectId;
const { response } = require("express");

module.exports = {
  brandAdd: (brandData) => {
    return new Promise(async (resolve, reject) => {
      let response = {};

      let brandCheck = await db
        .get()
        .collection(collections.BRAND_DETAILS_COLLECTION)
        .findOne({ brandName: brandData.brandName });

      if (brandCheck) {
        console.log("mone");
        response.exist = true;
        resolve(response);
      } else {
        await db
          .get()
          .collection(collections.BRAND_DETAILS_COLLECTION)
          .insertOne(brandData)
          .then((data) => {
            response.exist = false;
            response.data = data;
            resolve(response);
          });
      }
    });
  },
  getBrand: () => {
    return new Promise(async (resolve, reject) => {
      let allBrand = await db
        .get()
        .collection(collections.BRAND_DETAILS_COLLECTION)
        .find()
        .toArray();
      resolve(allBrand);
    });
  },
  deleteBrand: (id) => {
    return new Promise(async (resolve, reject) => {
      await db
        .get()
        .collection(collections.BRAND_DETAILS_COLLECTION)
        .deleteOne({ _id: objectId(id.id) })
        .then((data) => {
          resolve();
        });
    });
  },

  getSingleBrand: (data) => {
    return new Promise(async (resolve, reject) => {
      let singleBrand = await db
        .get()
        .collection(collections.BRAND_DETAILS_COLLECTION)
        .findOne({ _id: objectId(data.id) });
      resolve(singleBrand);
    });
  },

  updateBrand: (data, id) => {
    console.log(data);
    return new Promise(async (resolve, reject) => {
      let response = {};

      await db
        .get()
        .collection(collections.BRAND_DETAILS_COLLECTION)
        .updateOne({ _id: objectId(id) }, { $set: data })
        .then((status) => {
          response.exist = false;
          resolve(response);
        });
    });
  },
};
