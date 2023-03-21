import nc from "next-connect";
import bcrypt from "bcryptjs";
import db from "../../../utils/db/dbConnect";
import cloudinary from "cloudinary";
import User from "../../../Modal/userModel";
import generateToken from "../../../utils/generateToken";
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
  // Set the CORS headers
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, OPTIONS"
  );
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.setHeader("Access-Control-Allow-Credentials", true);

  await cors(req, res);
  try {
    const { email, password } = req.body;
    //check if user exists
    console.log("password", password);
    const userFound = await User.findOne({ email }).select("+password");
    if (!userFound) {
      res.status(403).json({
        message: "email or password not found",
      });
    }
    const comparedPassword = await bcrypt.compare(
      password,
      userFound?.password
    );
    if (!comparedPassword) {
      res.status(403).json({
        message: "email or password not found",
      });
    }
    //check if blocked
    if (userFound && comparedPassword) {
      //Check if password is match
      res.json({
        _id: userFound?._id,
        name: userFound?.name,
        email: userFound?.email,
        personalImage: userFound?.personalImage,
        isAdmin: userFound?.isAdmin,
        token: generateToken(userFound?._id),
        isVerified: userFound?.isAccountVerified,
        role: userFound?.role,
      });
    } else {
      res.status(401);
      throw new Error("Invalid Login Credentials");
    }
  } catch (err) {
    res.status(404).json({
      message: err.message,
    });
  }
});
export default handler;
