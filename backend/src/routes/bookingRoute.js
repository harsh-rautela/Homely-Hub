import express from "express";
const bookingRouter = express.Router();
import {getBookingDetails,getUserBookings,createOrder,verifyPayement} from "../controllers/bookingController.js"

import {protect} from "../controllers/authController.js"
bookingRouter.get("/",protect,getUserBookings);
bookingRouter.get("/:bookingId",protect,getBookingDetails);

bookingRouter.post("/create-order",protect,createOrder)
bookingRouter.post("/verify-payment",protect,verifyPayement);

export {bookingRouter}
