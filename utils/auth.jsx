import jwt from "jsonwebtoken";
import User from "../Modal/userModel";
import dbConnect from "../utils/db/dbConnect";

export const isAuth = async (req, res, next) => {
  try {
    console.log(req.headers);
    // Set the CORS headers
    const { db } = await dbConnect();
    let token = req.headers.authorization.split(" ")[1];

    if (!token) {
      return res.status(403).send("Access Denied");
    }

    if (token.startsWith("Bearer ")) {
      token = token.slice(7, token.length).trimLeft();
    }

    const verified = jwt.verify(token, process.env.JWT_KEY);
    const user = await User.findById(verified?.id).select("-password");
    console.log("user", user);
    req.user = user;
    next();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
  // finally
  // {
  //   // await db.disconnect();
  // }
};
