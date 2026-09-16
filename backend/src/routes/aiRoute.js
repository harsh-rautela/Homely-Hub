import express from "express";
import {generateTripPlan} from "../controllers/tripController.js";
const aiRouter = express.Router();
aiRouter.route("/").post(generateTripPlan)
export {aiRouter};