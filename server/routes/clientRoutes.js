import express from "express";
import Booking from "../models/Booking.js";

const router = express.Router();

// @route   GET /api/client/bookings/:email
// @desc    Get bookings by client email
// @access  Public
router.get("/bookings/:email", async (req, res) => {
  try {
    const email = req.params.email?.toLowerCase().trim();

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email is required.",
      });
    }

    const bookings = await Booking.find({ email })
      .populate("assignedModels")
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      bookings,
    });
  } catch (error) {
    console.error("Client bookings error:", error);

    res.status(500).json({
      success: false,
      message: "Server error while loading client bookings.",
    });
  }
});

export default router;
