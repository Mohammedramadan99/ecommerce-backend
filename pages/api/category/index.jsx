import nc from "next-connect";
import { isAuth } from "../../../utils/auth";
import dbConnect, { disconnect } from "../../../utils/db/dbConnect";
import cors from "micro-cors";
import Category from "../../../Modal/CategoryModal";
import cloudinary from "cloudinary";

cloudinary.config({
  cloud_name: "dtmjc8y9z",
  api_key: "379966828288349",
  api_secret: "a41LSvU3XXAJuQOLxorhOVFPauw",
});
const handler = nc();

handler.get(async (req, res) => {
  // Set the CORS headers
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST,PUT, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  await cors(req, res);

  try {
    const { db } = await dbConnect();
    const categories = await Category.find();
    res.status(200).json({
      success: true,
      categories,
    });
  } catch (error) {
    res.status(500).json(error.message);
  }
});
handler.post(async (req, res) => {
  const { db } = await dbConnect();

  try {
    let images = [];

    if (typeof req.body.images === "string") {
      images.push(req.body.images);
    } else {
      images = req.body.images;
    }

    const imagesLinks = [];

    for (let i = 0; i < images.length; i++) {
      const result = await cloudinary.v2.uploader.upload(images[i], {
        folder: "ecommerce",
      });

      imagesLinks.push({
        public_id: result.public_id,
        url: result.secure_url,
      });
    }

    req.body.images = imagesLinks;
    const category = await Category.create({
      title: req.body.title,
      images: req.body.images,
    });
    res.status(200).json({
      success: true,
      created: `category ${category.title} created successfully`,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
export default handler;
