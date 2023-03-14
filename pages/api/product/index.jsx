import nc from "next-connect";
import Cors from "micro-cors";

const cors = Cors({
  origin: "*",
  methods: ["GET", "HEAD", "POST", "PUT", "PATCH", "DELETE"],
});
import dbConnect from "../../../utils/db/dbConnect";
import { disconnect } from "../../../utils/db/dbConnect";

import cloudinary from "cloudinary";

import Product from "../../../Modal/ProductsModel";
import APIFeatures from "../../../utils/ApiFeatures";
import mongoose from "mongoose";
// import AllProducts from '../../../components/db'
cloudinary.config({
  cloud_name: "dtmjc8y9z",
  api_secret: "a41LSvU3XXAJuQOLxorhOVFPauw",
});

export const config = {
  api: {
    bodyParser: {
      sizeLimit: "50mb",
    },
  },
};
const handler = nc();

// get all products
handler.get(async (req, res) => {
  // Set the CORS headers
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  await cors(req, res);
  try {
    const { db } = await dbConnect();
    const products = await Product.find();
    // await AllProducts[...products]
    res.status(201).json({
      success: true,
      products,
    });
  } catch (err) {
    res.status(404).json({
      message: err.message,
    });
  }
  // await disconnect();
});

// handler.post(async (req, res) => {
//   const { db } = await dbConnect();

//   console.log("pData", req.body);
//   try {
//     let images = [];

//     if (typeof req.body.images === "string") {
//       images.push(req.body.images);
//     } else {
//       images = req.body.images;
//     }

//     const imagesLinks = [];

//     for (let i = 0; i < images.length; i++) {
//       const result = await cloudinary.v2.uploader.upload(images[i], {
//         folder: "ecommerce",
//       });

//       imagesLinks.push({
//         public_id: result.public_id,
//         url: result.secure_url,
//       });
//     }

//     req.body.images = imagesLinks;
//     // req.body.user = req.user.id;
//     console.log(req.body);
//     const product = await Product.create(req.body);

//     res.status(201).json({
//       success: true,
//       product,
//     });
//   } catch (err) {
//     res.status(404).json({
//       message: err.message,
//     });
//   }
//   // await db.disconnect();
// });

// // create product --> admin
// handler.put(async (req, res) => {
//   // try
//   // {
//   const { db } = await dbConnect();
//   console.log(req.body);
//   const resPerPage = req.body.n ? req.body.n : 0;

//   const productsCount = await Product.countDocuments();
//   const apiFeatures = new APIFeatures(Product.find(), req.query)
//     .search()
//     .filter();
//   let products = await apiFeatures.query;
//   let filteredProductsCount = products.length;

//   apiFeatures.pagination(products.length);
//   products = await apiFeatures.query.clone();
//   const { query, paginationResult } = apiFeatures;

//   res.status(200).json({
//     success: true,
//     paginationResult,
//     // resPerPage,
//     products,
//     filteredProductsCount,
//     productsCount,
//   });
//   // } catch (err)
//   // {
//   //   return res.status(500).json({ message: err.message });
//   // }
//   // await db.disconnect();
// });

export default handler;
