import nc from "next-connect";

import db from "../../../utils/db/dbConnect";
import cloudinary from "cloudinary";
import User from "../../../Modal/userModel";
import Cors from "micro-cors";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_SECRET_KEY,
});

const handler = nc();
const cors = Cors({
  origin: "*",
  methods: ["GET", "HEAD", "POST", "PUT", "PATCH", "DELETE"],
});

handler.options(async (req, res) => {
  // Set the CORS headers
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, OPTIONS"
  );
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.setHeader("Access-Control-Allow-Credentials", true);

  await cors(req, res);
  res.status(200).end();
});

handler.post(async (req, res) => {
  await db();
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, OPTIONS"
  );
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.setHeader("Access-Control-Allow-Credentials", true);

  await cors(req, res);
  try {
    const myCloud = await cloudinary.v2.uploader.upload(req.body?.images[0], {
      folder: "avatars",
    });
    // ?recieve the info of user
    const { name, email, password, role } = req.body;
    // ?find the user to check if it exists before or not
    const existUser = await User.findOne({ email });
    // ?FIRST => "check email" case email already found
    if (existUser)
      return res.status(400).json({ message: "the email already exists" });

    // ?SECOND => "check password" case password less than 6ch
    // if (password.length < 6)
    //   return res
    //     .status(400)
    //     .json({ message: "password is at least 6 characters long" });
    // ?third => case the user is new -- we will collect its info in a constant
    console.log(req.body);
    // const user = await User.create(req.body);
    const user = await User.create({
      name,
      email,
      password,
      personalImage: {
        public_id: myCloud.public_id,
        url: myCloud.secure_url,
      },
    });
    res.status(200).json({
      user,
    });
  } catch (err) {
    // Handle validation errors
    if (err.name === "ValidationError") {
      const validationErrors = {};
      for (let field in err.errors) {
        validationErrors[field] = err.errors[field].message;
      }
      return res.status(400).json({
        success: false,
        message: "Validation error",
        errors: validationErrors,
      });
    }

    res.status(400).json({
      success: false,
      message: err?.message,
    });
  }
});
export default handler;
