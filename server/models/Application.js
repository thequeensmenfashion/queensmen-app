import mongoose from "mongoose";

const applicationSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },

    phone: {
      type: String,
      required: true,
      trim: true,
    },

    location: {
      type: String,
      required: true,
      trim: true,
    },

    age: {
      type: Number,
      required: true,
      min: 18,
    },

    height: {
      type: String,
      trim: true,
    },

    experience: {
      type: String,
      experience: {
        type: String,
        default: "",
      },
     
      
    },

    instagram: {
      type: String,
      trim: true,
    },
    profileImage: {
      type: String,
      default: "",
    },

    message: {
      type: String,
      trim: true,
    },

    status: {
      type: String,
      enum: ["Pending", "Reviewed", "Accepted", "Rejected"],
      default: "Pending",
    },
  },
  {
    timestamps: true,
  },
);

const Application = mongoose.model("Application", applicationSchema);

export default Application;
