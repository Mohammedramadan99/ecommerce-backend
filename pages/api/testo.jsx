import nc from "next-connect";

import db from "../../utils/db/dbConnect";

const handler = nc();

// get all products
handler.get(async (req, res) => {
  await db();
  try {
    console.log("hello mo");
    res.status(201).json({
      success: true,
      msg: "good",
    });
  } catch (err) {
    res.status(404).json({
      message: err.message,
    });
  }
});

export default handler;
