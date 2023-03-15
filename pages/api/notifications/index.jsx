import nc from "next-connect";
import db from "../../../utils/db/dbConnect";
import cors from "micro-cors";
import Notification from "../../../Modal/NotificationsModal";
const handler = nc();

handler.get(async (req, res) => {
  // Set the CORS headers
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST,PUT, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  await cors(req, res);

  await db();
  try {
    const notifications = await Notification.find()
      .populate("user")
      .sort("-createdAt");
    res.status(200).json({
      success: true,
      notifications,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});
handler.post(async (req, res) => {
  // Set the CORS headers
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST,PUT, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  await cors(req, res);

  await db();
  try {
    const data = req.body;
    const newNotification = await Notification.create(data);
    res.status(200).json({
      success: true,
      newNotification,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});
export default handler;
