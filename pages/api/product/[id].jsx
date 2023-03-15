import nc from "next-connect";
import cors from "micro-cors";
import db from "../../../utils/db/dbConnect";
import Product from "../../../Modal/ProductsModel";

const ErrorHandler = require("../../../utils/errorHandler");
const handler = nc();

// create product --> admin

handler.get(async (req, res) => {
  // Set the CORS headers
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST,PUT, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  await cors(req, res);

  await db();
  try {
    const product = await Product.findById(req.query.id);

    // status Error
    if (!product) {
      return next(new ErrorHandler("product not found", 404));
    }

    // status success
    res.status(200).json({
      success: true,
      product,
    });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
});

handler.delete(async (req, res) => {
  // Set the CORS headers
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST,PUT, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  await cors(req, res);

  await db();
  try {
    console.log("req.query", req.query.id);
    let product = await Product.findById(req.query.id);

    // status case error
    if (!product) {
      return res.status(500).json({
        success: false,
        message: "product not fount",
      });
    }

    // operator <- delete ->
    await product.remove();

    // status case success
    res.status(200).json({
      success: true,
      message: "product Deleted",
    });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
});
// update
handler.put(async (req, res) => {
  // Set the CORS headers
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST,PUT, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  await cors(req, res);

  await db();
  try {
    let product = await Product.findById(req.query.id); // get the product

    if (!product) {
      res.status(404).json({
        success: false,
        message: "product not found",
      });
    }
    if (req.body.images) {
      // Images Start Here
      let images = [];

      if (typeof req.body.images === "string") {
        images.push(req.body.images);
      } else {
        images = req.body.images;
      }

      if (images !== undefined) {
        // Deleting Images From Cloudinary
        for (let i = 0; i < product.images.length; i++) {
          await cloudinary.v2.uploader.destroy(product.images[i].public_id);
        }

        const imagesLinks = [];

        for (let i = 0; i < images.length; i++) {
          const result = await cloudinary.v2.uploader.upload(images[i], {
            folder: "products",
          });

          imagesLinks.push({
            public_id: result.public_id,
            url: result.secure_url,
          });
        }

        req.body.images = imagesLinks;
      }
    }

    product = await Product.findByIdAndUpdate(req.query.id, req.body, {
      new: true,
      runValidators: true,
      useFindAndModify: false,
    });

    res.status(200).json({
      success: true,
      product,
    });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
});

export default handler;
