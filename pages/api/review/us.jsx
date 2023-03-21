import nc from "next-connect";
import Product from "../../../Modal/ProductsModel";
// import db from '../../../utils/db/dbConnect'
import { isAuth } from "../../../utils/auth";
import ReviewUs from "../../../Modal/reviewUs";
import Notification from "../../../Modal/NotificationsModal";
import dbConnect from "../../../utils/db/dbConnect";
import Cors from "cors";
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
handler.get(async (req, res) => {
  // Set the CORS headers
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST,PUT, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  await cors(req, res);

  await dbConnect();
  try {
    const reviews = await ReviewUs.find({});
    res.status(200).json({
      success: true,
      reviews,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

handler.use(isAuth).post(async (req, res) => {
  const { db } = await dbConnect();
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
    const user = req.user;
    const review = req.body;
    const reviewData = { user, ...review };
    const result = await ReviewUs.create(reviewData);
    // const notification = await Notification.create(notificationData)

    res.status(200).json({
      success: true,
      review: result,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

export default handler;
