import userModel from "../models/userModel.js";
import { comparePassword, hashPassword } from "../helper/authHelper.js";
import JWT from "jsonwebtoken";

//register
export const registerController = async (req, res) => {
  try {
    const { name, email, password, phone } = req.body;

    //validation check
    if (!name) {
      return res.send({ error: "name is required" });
    }
    if (!email) {
      return res.send({ error: "email is required" });
    }
    if (!password) {
      return res.send({ error: "password is required" });
    }
    if (!phone) {
      return res.send({ error: "phone num is required" });
    }

    //no multiple user
    const exitingUser = await userModel.findOne({ email });
    if (exitingUser) {
      return res.status(200).send({
        success: true,
        message: "Email already registered",
      });
    }

    //register
    const hashedPassword = await hashPassword(password);
    const user = await new userModel({
      name,
      email,
      password: hashedPassword,
      phone,
    }).save();

    res.status(201).send({
      success: true,
      message: "Registration successful!",
      user,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in registration",
      error,
    });
  }
};

//login
export const loginController = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).send({
        success: false,
        message: "Invalid email or password",
      });
    }

    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(404).send({
        success: false,
        message: "Email is not registered",
      });
    }

    const match = await comparePassword(password, user.password);
    if (!match) {
      return res.status(404).send({
        success: false,
        message: "Invalid password",
      });
    }

    // Token creation
    const token = JWT.sign({ _id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.status(200).send({
      success: true,
      message: "Login successful",
      user: {
        name: user.name,
        email: user.email,
        phone: user.phone,
      },
      token,
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Error in login",
      error,
    });
  }
};

//middleware
export const testController = (req, res) => {
  res.send("protected route");
};
