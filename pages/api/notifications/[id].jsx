import nc from "next-connect";
import db from "../../../utils/db/dbConnect";
import cors from "micro-cors";
import Notification from "../../../Modal/NotificationsModal";
const handler = nc();

handler.delete(async (req, res) => {
  // Set the CORS headers
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST,PUT, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  await cors(req, res);

  await db();
  try {
    const notification = await Notification.findByIdAndDelete(req.query.id);

    res.status(200).json({
      success: true,
      deleted: true,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
  await db.disconnect();
});
export default handler;
