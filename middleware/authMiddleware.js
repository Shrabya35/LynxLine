import JWT from "jsonwebtoken";
import userModel from "../models/userModel.js";

export const requireSignIn = async (req, res, next) => {
  try {
    const decode = JWT.verify(
      req.headers.authorization,
      process.env.JWT_SECRET
    );
    req.user = decode;
    next();
  } catch (error) {
    console.log(error);
  }
};

//admin
export const isAdmin = async (req, res, next) => {
  try {
    if (!req.user || !req.user._id) {
      console.log("User not authenticated");
      return res.status(401).send({
        success: false,
        message: "Unauthorized access",
      });
    }

    const user = await userModel.findById(req.user._id);

    if (!user) {
      console.log("User not found");
      return res.status(401).send({
        success: false,
        message: "Unauthorized access",
      });
    }

    if (user.role === 0) {
      return res.status(403).send({
        success: false,
        message: "Access forbidden",
      });
    } else {
      next();
    }
  } catch (error) {
    console.error("Error in isAdmin middleware:", error);
    return res.status(500).send({
      success: false,
      error: error.message,
      message: "Internal server error",
    });
  }
};
