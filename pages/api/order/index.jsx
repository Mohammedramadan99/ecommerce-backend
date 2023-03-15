import nc from "next-connect";
import db from "../../../utils/db/dbConnect";
import User from "../../../Modal/userModel";
import Order from "../../../Modal/orderModel";
import Notification from "../../../Modal/NotificationsModal";
import cors from "micro-cors";
const handler = nc();

handler.post(async (req, res) => {
  // Set the CORS headers
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST,PUT, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  await cors(req, res);
  await db();
  const {
    userId,
    customer,
    payment_intent,
    products,
    amount_subtotal,
    amount_total,
    customer_details,
    payment_status,
  } = req.body;
  try {
    const user = await User.findById(userId);
    const newOrder = {
      user,
      customerId: customer,
      products,
      paymentIntentId: payment_intent,
      subtotal: amount_subtotal,
      total: amount_total,
      shipping: customer_details,
      payment_status: payment_status,
    };
    const { paymentIntentId } = newOrder;
    console.log(newOrder);
    const checkOrder = await Order.findOne({ paymentIntentId });

    if (checkOrder) {
      res.status(500).json("order added before");
    } else {
      const savedOrder = await Order.create(newOrder);
      const notificationData = {
        user,
        title: `${user.name} ordered (${products?.length}) products`,
        content: `(${products?.length}) products, the total is ${total}, payment status is ${payment_status}`,
      };
      const notification = await Notification.create(notificationData);
      res.status(200).json({
        success: true,
        order: newOrder,
      });
    }
    // const savedOrder = await newOrder.save()
    // if (paymentIntentId)
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});
handler.get(async (req, res) => {
  // Set the CORS headers
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST,PUT, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  await cors(req, res);
  await db();
  try {
    const orders = await Order.find({});
    res.status(200).json({
      success: true,
      orders,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

export default handler;
