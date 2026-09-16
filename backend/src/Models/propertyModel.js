import slugify from 'slugify';
import mongoose from 'mongoose';

const propertySchema = new mongoose.Schema({
    propertyName: {
        type: String,
        required: [true, "Please enter your property name"]  
    },
    description:{
        type:String,
        required:[true,"Please add information about your property"]
    },
    extraInfo:{
      type:String,
      default:"No extra information provided"  
    },
    propertyType:{
        type:String,
        enum:["House","Flat","Guest House","Hotel"],
        default:"House"
    },
    roomType:{
        type:String,
        enum:["Anytype","Room","Entire Home"],
        default:"Anytype"
    },
    maximumGuest:{
        type:Number,
        required:[true,"Please enter maximum number of guests allowed"] 
    },
    amenities:[
        {
            name:{
                type:String,
                required:[true,"Please enter the name of the amenity"],
                enum:["Wifi","Kitchen","Ac","Washing Machine","Tv","Pool","Free Parking"]
            },
            icon:{
                type:String,
                required:[true,"Please enter the icon of the amenity"],

            }
        }
    ],
    images:{
          type:[{
            public_id:{type:String},
            url:{
                type:String,
                required:true,
            }
          }],
          validate:{
            validator:function(arr){
                return arr.length>5;

            },
            message:"The images must contain atleast 6 images "
          }
    },
    price:{
        type:Number,
        required:[true,"Please enter the price per night value"],
        default:500
    },
    address:{
        area:String,
        city:String,
        state:String,
        pincode:Number,
    },
    currentBookings:[
        {
            bookingId:{
                type:mongoose.Schema.Types.ObjectId,
                ref:"Booking"
            },
            fromDate:{
                type:Date

            },
            toDate:{
                type:Date

            },
            userId:{
                type:mongoose.Schema.Types.ObjectId,
                ref:"User"
            }
        }
    ],
    userId:{
       type:mongoose.Schema.Types.ObjectId,
       ref:"User",
    },
    slug:String,
    checkInTime:{type:String,default:"11:00"},
    checkOutTime:{type:String,default:"13:00"}
});

propertySchema.pre("save",function(){
    this.slug=slugify(this.propertyName,{lower:true});
    
})

propertySchema.pre("save",function(){
    this.address.city = this.address.city.toLowerCase().replaceAll(" ","");
    
})

const Property =mongoose.models.Property || mongoose.model("Property",propertySchema);
export {Property}
