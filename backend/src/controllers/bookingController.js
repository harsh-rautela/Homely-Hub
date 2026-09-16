import { Property } from "../Models/propertyModel.js";
import {Booking} from "../Models/bookingModel.js"
import razorpay from "../utils/razorpay.js";
import crypto from "crypto"
import dotenv from "dotenv" 
dotenv.config()

const createOrder = async (req, res) => {
    try {
        const { propertyId, fromDate, toDate, guests } = req.body;

        const property = await Property.findById(propertyId);

        if (!property) {
            return res.status(404).json({
                success: false,
                message: "Property not found"
            });
        }

        if (Number(guests) < 1 || Number(guests) > property.maximumGuest) {
            return res.status(400).json({
                success: false,
                message: `Guests must be between 1 and ${property.maximumGuest}`
            });
        }

        const checkIn = new Date(fromDate);
        const checkOut = new Date(toDate);

        const nights = Math.ceil(
            (checkOut - checkIn) / (1000 * 60 * 60 * 24)
        );

        if (nights <= 0) {
            return res.status(400).json({
                success: false,
                message: "Invalid booking dates"
            });
        }

        // Check existing bookings
        const overlappingBooking = property.currentBookings.some(
            (booking) =>
                checkIn <= new Date(booking.toDate) &&
                checkOut >= new Date(booking.fromDate)
        );

        if (overlappingBooking) {
            return res.status(400).json({
                success: false,
                message: "Property is already booked for these dates"
            });
        }

        // Calculate price on backend
        const amount = property.price * nights;

        const razorpayOrder = await razorpay.orders.create({
            amount: Math.round(amount * 100),
            currency: "INR",
            receipt: `booking_${Date.now()}`
        });

        res.status(200).json({
            success: true,
            order: razorpayOrder,
            key: process.env.RAZORPAY_KEY_ID,

            bookingDetails: {
                propertyId,
                fromDate,
                toDate,
                guests: Number(guests),
                nights,
                price: amount
            }
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

const verifyPayement = async (req, res) => {
    try {
        const {
            razorpay_order_id,
            razorpay_payment_id,
            razorpay_signature,
            bookingDetails
        } = req.body;

        const generatedSignature = crypto
            .createHmac(
                "sha256",
                process.env.RAZORPAY_SECRET_KEY
            )
            .update(
                `${razorpay_order_id}|${razorpay_payment_id}`
            )
            .digest("hex");

        if (generatedSignature !== razorpay_signature) {
            return res.status(400).json({
                success: false,
                message: "Payment verification failed"
            });
        }

        // Get property again
        const property = await Property.findById(
            bookingDetails.propertyId
        );

        if (!property) {
            return res.status(404).json({
                success: false,
                message: "Property not found"
            });
        }

        // Check availability AGAIN
        const overlappingBooking =
            property.currentBookings.some(
                (booking) =>
                    new Date(bookingDetails.fromDate) <=
                        new Date(booking.toDate) &&
                    new Date(bookingDetails.toDate) >=
                        new Date(booking.fromDate)
            );

        if (overlappingBooking) {
            return res.status(400).json({
                success: false,
                message: "Property is no longer available for these dates"
            });
        }

        const newBooking = await Booking.create({
            user: req.user._id,
            property: bookingDetails.propertyId,
            price: property.price * bookingDetails.nights,
            fromDate: bookingDetails.fromDate,
            toDate: bookingDetails.toDate,
            guests: bookingDetails.guests,
            numberOfnights: bookingDetails.nights,
            paid: true
        });

        await Property.findByIdAndUpdate(
            bookingDetails.propertyId,
            {
                $push: {
                    currentBookings: {
                        bookingId: newBooking._id,
                        fromDate: bookingDetails.fromDate,
                        toDate: bookingDetails.toDate,
                        userId: req.user._id
                    }
                }
            }
        );

        res.status(200).json({
            success: true,
            message: "Payment successful, booking confirmed!",
            paymentId: razorpay_payment_id,
            orderId: razorpay_order_id,
            booking: newBooking
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};

const getUserBookings = async (req,res)=>{
  try {
    const bookings = await Booking.find({user:req.user._id});
    res.status(200).json({
        status:"success",
        bookings
        
    });

  } catch(error){
    res.status(401).json({
        status:"fail",
        message:error.message
    });

  }
}

const getBookingDetails = async (req,res)=>{
    try{
        const bookings = await Booking.findById(req.params.bookingId);
        res.status(200).json({
        status:"success",
         bookings
        
    });

    } catch(error){
        res.status(401).json({
        status:"fail",
        message:error.message
    });
    }
}

export { getBookingDetails,getUserBookings,createOrder,verifyPayement}