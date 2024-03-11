import express from "express";
import dotenv from "dotenv";
import colors from "colors";
import morgan from "morgan";
import connectDB from "./config/connectDB.js";
import authRoute from "./routes/authRoute.js";
import categoryRoute from "./routes/categoryRoute.js";
import productRoute from "./routes/productRoute.js";
import cors from "cors";

//env config
dotenv.config();

//db config
connectDB();

//rest obj
const app = express();

//middlewares
app.use(express.json());
app.use(morgan("dev"));

app.use(cors());

app.use("/api/v1/auth", authRoute);
app.use("/api/v1/category", categoryRoute);
app.use("/api/v1/product", productRoute);

app.get("/", (req, res) => {
  res.send("<h1>Welcome to my app</h1>");
});

const PORT = process.env.PORT || 9080;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`.bgBlue.white);
});
