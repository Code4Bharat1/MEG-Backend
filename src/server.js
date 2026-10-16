import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import express, { json, urlencoded } from "express";
import connectDB from "./config/db.js";
import authRoutes from "./routes/member.route.js"

dotenv.config()
const app = express();

app.use(cors({
  origin: process.env.FRONTEND_URL,
  credentials: true
}));
app.use(json());
app.use(urlencoded({extended : true}));
app.use(cookieParser());


// auth related routes 

app.use("/api/v1/auth",authRoutes);


const port = process.env.PORT;
connectDB();
app.listen(port,() => {
  console.log(`Server is running on port ${port}`);
})
