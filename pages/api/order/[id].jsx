import nc from "next-connect";
import db from "../../../utils/db/dbConnect";
import Order from "../../../Modal/orderModel";
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
    const order = await Order.findById(req.query.id);
    res.status(200).json({
      success: true,
      order,
    });
    // const savedOrder = await newOrder.save()
    // if (paymentIntentId)
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});
handler.put(async (req, res) => {
  // Set the CORS headers
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST,PUT, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  await cors(req, res);

  await dn();
  try {
    const updatedOrders = await Order.findByIdAndUpdate(
      req.query?.id,
      {
        $set: req.body,
      },
      { new: true }
    );
    res.status(200).json(updatedOrders);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
  await db.disconnect();
});

export default handler;
