import nc from "next-connect";
import db from "../../../../utils/db/dbConnect";
import moment from "moment";
import Order from "../../../../Modal/orderModel";
import cors from "micro-cors";
const handler = nc();

handler.get(async (req, res) => {
  // Set the CORS headers
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST,PUT, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  await cors(req, res);
  await db();
  try {
    const prevMonth = moment()
      .month(moment().month() - 1)
      .set("date", 1)
      .format("YYYY-MM-DD HH:mm:ss");
    // const allUsers = await User.find({});
    const income = await Order.aggregate([
      {
        $match: { createdAt: { $gte: new Date(prevMonth) } },
      },
      {
        $project: {
          month: { $month: "$createdAt" },
          sales: "$subtotal",
        },
      },
      {
        $group: {
          _id: "$month", // month
          total: { $sum: "$sales" },
        },
      },
    ]);
    res.status(200).json({
      success: true,
      income,
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
