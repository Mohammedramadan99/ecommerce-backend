import nc from "next-connect";
import Product from "../../../Modal/ProductsModel";
// import db from '../../../utils/db/dbConnect'
import { isAuth } from "../../../utils/auth";
import ReviewUs from "../../../Modal/reviewUs";
import Notification from "../../../Modal/NotificationsModal";
import dbConnect from "../../../utils/db/dbConnect";
import cors from "cors";
const handler = nc();

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
  // Set the CORS headers
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST,PUT, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  await cors(req, res);

  const { db } = await dbConnect();

  try {
    const user = req.user;
    const review = req.body;
    const reviewData = { user, ...review };
    const result = await ReviewUs.create(reviewData);
    const notificationData = {
      user,
      title: `${user.name} reviewed our website with ${review.rating} stars `,
      content: `${review.comment}`,
    };
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
