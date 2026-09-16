import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import connectDB from "./utils/db.js";
import {router} from "./routes/userRoutes.js";
import {propertyRouter} from "./routes/propertyRouter.js"; 
import {bookingRouter} from "./routes/bookingRoute.js"
import morgan from "morgan"
import { aiRouter } from "./routes/aiRoute.js";
dotenv.config();
const app = express();
app.use(express.json({limit:"100mb"}));
app.use(express.urlencoded({limit:"100mb",extended:true}));
app.use(cookieParser());


const port = process.env.PORT || 3000;
app.use(morgan("dev"))
app.get("/",(req,res)=>{
    res.send("Hello World");
});

app.use("/api/v1/rent/user",router);
app.use("/api/v1/rent/listing",propertyRouter);
app.use("/api/v1/rent/user/booking",bookingRouter);
app.use("/api/v1/rent/trip",aiRouter)

app.listen(port,()=>{
    connectDB();
    console.log(`Server is running on port`);
})