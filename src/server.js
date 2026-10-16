import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import express, { json, urlencoded } from "express";
import connectDB from "./config/db.js";

dotenv.config()
const app = express();

app.use(cors());
app.use(json());
app.use(urlencoded({extended : true}));
app.use(cookieParser());


const port = process.env.PORT;
connectDB();
app.listen(port,() => {
  console.log(`Server is running on port ${port}`);
})
