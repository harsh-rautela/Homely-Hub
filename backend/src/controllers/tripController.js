import {Property} from "../Models/propertyModel.js";
import { planTrip } from "../ai/tripPlanner.js";
import { generateDescription } from "../ai/generateDescription.js";

const cleanCity = (text)=> text.toLowerCase().replaceAll(" ","")
export const generateTripPlan = async (req, res) => {
  try {
    // 1. Receive user's information
    const { destination, budget, days, people, interests } = req.body;

    // 2. Validate required information
    if (!destination || !budget || !days || !people || !interests) {
      return res.status(400).json({
        success: false,
        message:
          "Destination, budget, days, people and interests are required",
      });
    }

    if (budget <= 0 || days <= 0 || people <= 0) {
      return res.status(400).json({
        success: false,
        message: "Budget, days and number of people must be greater than 0",
      });
    }

    

    // 3. Send user's information to AI trip planner
    

    const aiTripPlan = await planTrip({destination,
      budget,
      days,
      people,
      interests:interests || [],});

    // 4. Calculate budget per night
    const budgetPerNight = Number(budget) / Number(days);

    // 5. Search MongoDB for suitable properties
    const city=cleanCity(destination)

    const properties = await Property.find({
      $or: [
        {"address.city":city},
        {"address.state":city},
        {"address.area":city}
      ],

      // Property price should be within user's
      // calculated nightly budget
      price: {
        $lte: budgetPerNight,
      },

      // Property should have enough capacity
      maximumGuest: {
        $gte: Number(people),
      },
    }).limit(6);
    console.log(properties)

    // 6. Send AI trip plan + matching properties
    return res.status(200).json({
      success: true,
      data: {aiTripPlan,properties,budgetPerNight},

      properties,
    });
  } catch (error) {
    console.error("Trip planning error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to generate trip plan",
    });
  }
};


export const writeDescription = async (req, res) => {
  try {
    const {
      propertyName,
      extraInfo,
      propertyType,
      roomType,
      maximumGuest,
      amenities,
      price,
      address,
    } = req.body;

    // Validate required fields
    if (
      !propertyName ||
      !propertyType ||
      !roomType ||
      !maximumGuest ||
      !price ||
      !address
    ) {
      return res.status(400).json({
        success: false,
        message: "Required property information is missing",
      });
    }

    // Object expected by generateDescription()
    const property = {
      propertyName,
      extraInfo,
      propertyType,
      roomType,
      maximumGuest,
      amenities,
      price,
      address,
    };

    // Generate AI description
    const description = await generateDescription(property);

    return res.status(200).json({
      success: true,
      data: {
        description,
      },
    });
  } catch (error) {
    console.error("Error generating property description:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to generate property description",
    });
  }
};
