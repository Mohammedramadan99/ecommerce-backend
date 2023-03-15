import nc from "next-connect";
import db from "../../../../utils/db/dbConnect";

import User from "../../../../Modal/userModel";
import Order from "../../../../Modal/orderModel";
import Product from "../../../../Modal/ProductsModel";
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
    const query = req.query.numbers;

    let income = await Order.aggregate([
      {
        $project: {
          month: { $month: "$createdAt" }, // month from created at
          sales: "$subtotal", // subtotal of the order
        },
      },
    ]);
    let users = await User.find({});
    let orders = await Order.find({});
    let products = await Product.find({});
    let earnings = query ? 0 : income;
    if (query) {
      income = income.map((item) => (earnings += item.sales));
      users = users.length;
      orders = orders.length;
      products = products.length;
    }
    const data = [
      { title: "earnings", num: earnings },
      { title: "users", num: users },
      { title: "orders", num: orders },
      { title: "products", num: products },
    ];
    res.status(200).json({
      success: true,
      data,
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
