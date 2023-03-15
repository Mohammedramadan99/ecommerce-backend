import nc from "next-connect";
import { isAuth } from "../../../utils/auth";
import dbConnect, { disconnect } from "../../../utils/db/dbConnect";

import Product from "../../../Modal/ProductsModel";
import data from "../../../utils/db/products.json";

const handler = nc();

handler.get(async (req, res) => {
  try {
    const { db } = await dbConnect();
    const products = await Product.insertMany(data);
    res.status(200).json(products);
    console.log("data inserted");
  } catch (error) {
    res.status(500).json(error.message);
  }
});
export default handler;
