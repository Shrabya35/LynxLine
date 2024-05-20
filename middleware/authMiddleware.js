import JWT from "jsonwebtoken";
import userModel from "../models/userModel.js";

export const requireSignIn = async (req, res, next) => {
  try {
    const token = req.headers.authorization;
    if (!token) {
      return res.status(401).send({
        success: false,
        message: "No token provided",
      });
    }

    const decode = JWT.verify(token, process.env.JWT_SECRET);
    req.user = decode;
    next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res.status(401).send({
        success: false,
        message: "Token expired",
      });
    } else if (error.name === "JsonWebTokenError") {
      return res.status(401).send({
        success: false,
        message: "Invalid token",
      });
    } else {
      console.error("Error in requireSignIn middleware:", error);
      return res.status(500).send({
        success: false,
        message: "Internal server error",
      });
    }
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
