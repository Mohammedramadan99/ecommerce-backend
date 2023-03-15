import nc from "next-connect";
import { isAuth } from "../../../utils/auth";
import dbConnect, { disconnect } from "../../../utils/db/dbConnect";

import Category from "../../../Modal/CategoryModal";
import data from "../../../utils/db/cat.json";
import cors from "micro-cors";
const handler = nc();

handler.get(async (req, res) => {
  // Set the CORS headers
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST,PUT, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  await cors(req, res);

  try {
    const { db } = await dbConnect();
    const categories = await Category.insertMany(data);
    res.status(200).json(categories);
    console.log("data inserted");
  } catch (error) {
    res.status(500).json(error.message);
  }
});
export default handler;
