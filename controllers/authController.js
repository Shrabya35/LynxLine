import userModel from "../models/userModel.js";
import { comparePassword, hashPassword } from "../helper/authHelper.js";
import JWT from "jsonwebtoken";
import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: "shrabyaraj@gmail.com",
    pass: "bumk ofjv ktrg urnx",
  },
  debug: true,
});

//register
export const registerController = async (req, res) => {
  try {
    const { name, email, password, phone } = req.body;

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
        role: user.role,
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

export const resetPasswordController = async (req, res) => {
  try {
    const { email, password, newPassword } = req.body;
    if (!email) {
      return res.status(400).send({ message: "Email is required" });
    }
    if (!password) {
      return res.status(400).send({
        success: false,
        message: "Invalid password ",
      });
    }
    if (!newPassword) {
      return res.status(400).send({
        success: false,
        message: "New password is required",
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
        message: "Password didn't match",
      });
    }

    const hashedNewPassword = await hashPassword(newPassword);

    user.password = hashedNewPassword;
    await user.save();

    res.status(200).send({
      success: true,
      message: "Password reset successful",
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Something went wrong",
      error,
    });
  }
};

let globalOTP;
export const generateOtpController = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await userModel.findOne({ email });

    if (!user) {
      return res.status(404).send({
        success: false,
        message: "Email is not registered",
      });
    }

    const OTP = Math.floor(100000 + Math.random() * 900000).toString();
    globalOTP = OTP;

    await sendMail(email, OTP);

    res.status(200).send({
      success: true,
      message: "OTP sent successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Something went wrong",
      error,
    });
  }
};

async function sendMail(email, OTP) {
  try {
    const info = await transporter.sendMail({
      from: '"LynxLine" <shrabyaraj@gmail.com>',
      to: email,
      subject: "OTP for Password Reset",
      html: `
        <html>
          <head>
            <style>
              body {
                font-family: Arial, sans-serif;
                background-color: #f4f4f4;
                color: #333;
                margin: 0;
                padding: 0;
                text-align: center;
              }
              .container {
                max-width: 600px;
                margin: 20px auto;
                padding: 20px;
                background-color: #fff;
                border-radius: 8px;
                box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
                text-align: center;
              }
              h1 {
                color: #333;
              }
              h3{
                margin-bottom: 20px;
              }
              p {
                margin-bottom: 20px;
              }
              .footer {
                margin-top: 20px;
                text-align: center;
                color: #666;
              }
            </style>
          </head>
          <body>
            <div class="container">
              <h1>OTP for Password Reset</h1>
              <h3>Your OTP is: <strong>${OTP}</strong></h3>
              <p>Please use this OTP to reset your password.</p>
            </div>
            <div class="footer">
              This email was sent by LynxLine. Please do not reply to this email.
            </div>
          </body>
        </html>
      `,
    });

    console.log("Email sent: ", info.messageId);
  } catch (error) {
    console.log("Error occurred while sending email: ", error);
    throw error;
  }
}
export const forgetPasswordController = async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;
    if (!email) {
      return res.status(400).send({
        success: false,
        message: "Email is required",
      });
    }
    if (!otp) {
      return res.status(400).send({
        success: false,
        message: "Enter Otp",
      });
    }
    if (!newPassword) {
      return res.status(400).send({
        success: false,
        message: "New password is required",
      });
    }

    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(404).send({
        success: false,
        message: "Email is not registered",
      });
    }

    if (otp !== globalOTP) {
      console.log(globalOTP);
      return res.status(404).send({
        success: false,
        message: "Incorrect OTP",
      });
    }

    const hashedNewPassword = await hashPassword(newPassword);

    user.password = hashedNewPassword;
    await user.save();

    res.status(200).send({
      success: true,
      message: "Password reset successful",
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Something went wrong",
      error,
    });
  }
};
