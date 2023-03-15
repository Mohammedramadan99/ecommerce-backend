import nc from "next-connect";
import { isAuth } from "../../../utils/auth";
import db from "../../../utils/db/dbConnect";
import cors from "cors";
const handler = nc();
const stripe = require("stripe")(
  "sk_test_51M0i4WChQsYHEZthWWcjuWbGOn1d4jYJAp8c3ArO0ykGv2AYG4zSdR4byJqkhFGhK2OGru3UETykCsnbXZzeQMX000KdgJAcQd"
);

handler.use(isAuth).post(async (req, res) => {
  // Set the CORS headers
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST,PUT, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  await cors(req, res);

  await db();
  const myPayment = await stripe.paymentIntents.create({
    amount: req.body.amount,
    currency: "usd",
    metadata: {
      company: "Ecommerce",
    },
  });

  res
    .status(200)
    .json({ success: true, client_secret: myPayment.client_secret });
});

export default handler;
