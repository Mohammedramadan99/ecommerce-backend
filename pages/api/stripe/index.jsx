import Stripe from "stripe";
import nc from "next-connect";
import Cors from "micro-cors";
import db from "../../../utils/db/dbConnect";

const handler = nc();
const cors = Cors({
  origin: "*",
  methods: ["GET", "HEAD", "POST", "PUT", "PATCH", "DELETE"],
});

handler.options(async (req, res) => {
  // const { db } = await dbConnect();
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

const stripe = new Stripe(process.env.NEXT_PUBLIC_STRIPE_SECRET_KEY);

handler.post(async (req, res) => {
  // Set the CORS headers
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST,PUT, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  await cors(req, res);
  await db();
  try {
    const products = req?.body?.orderData?.products.toString();
    const customer = await stripe.customers.create({
      metadata: {
        userId: req.body.userId,
        cart: products,
      },
    });
    // console.log('first', customer.metadata.cart.map(p => p))
    const params = {
      submit_type: "pay",
      mode: "payment",
      payment_method_types: ["card"],
      billing_address_collection: "auto",
      shipping_options: [
        {
          shipping_rate: "shr_1M18wEChQsYHEZthq3uy6uP2",
        },
      ],
      customer: customer.id,
      line_items: req?.body?.orderData?.products?.map((item) => {
        return {
          price_data: {
            currency: "usd",
            product_data: {
              name: item.name,
              images: [item?.images[0]?.url],
              metadata: {
                id: item._id,
              },
            },
            unit_amount: item.price * 100,
          },
          adjustable_quantity: {
            enabled: true,
            minimum: 1,
          },
          quantity: item.quantity,
        };
      }),
      success_url: `${req.headers.origin}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${req.headers.origin}/cart`,
    };
    // Create Checkout Sessions from body params.
    const session = await stripe.checkout.sessions.create(params);
    // res.redirect(303, session.url);
    res.status(200).json({
      session,
    });
  } catch (err) {
    res.status(err.statusCode || 500).json({
      success: false,
      msg: err.message,
    });
  }
});

export default handler;
