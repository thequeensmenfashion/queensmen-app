import express from "express";
import Booking from "../models/Booking.js";
import adminProtect from "../middleware/adminProtect.js";
import sendEmail from "../utils/sendEmail.js";

const router = express.Router();

// @route   POST /api/booking
// @desc    Submit booking request
// @access  Public
router.post("/", async (req, res) => {
  try {
    const {
      fullName,
      company,
      email,
      phone,
      eventType,
      eventDate,
      location,
      numberOfModels,
      budget,
      message,
    } = req.body;

    if (
      !fullName ||
      !email ||
      !phone ||
      !eventType ||
      !eventDate ||
      !location ||
      !numberOfModels
    ) {
      return res.status(400).json({
        success: false,
        message: "Please fill in all required booking fields.",
      });
    }

    const booking = await Booking.create({
      fullName,
      company,
      email,
      phone,
      eventType,
      eventDate,
      location,
      numberOfModels,
      budget,
      message,
    });

    try {
      await sendEmail({
        to: process.env.OWNER_EMAIL,
        subject: "New QueensMen Booking Request",
        html: `
          <h2>New Booking Request</h2>
          <p><strong>Name:</strong> ${booking.fullName}</p>
          <p><strong>Company:</strong> ${booking.company || "N/A"}</p>
          <p><strong>Email:</strong> ${booking.email}</p>
          <p><strong>Phone:</strong> ${booking.phone}</p>
          <p><strong>Event Type:</strong> ${booking.eventType}</p>
          <p><strong>Event Date:</strong> ${
            booking.eventDate
              ? new Date(booking.eventDate).toLocaleDateString()
              : "N/A"
          }</p>
          <p><strong>Location:</strong> ${booking.location}</p>
          <p><strong>Models Needed:</strong> ${booking.numberOfModels}</p>
          <p><strong>Budget:</strong> ${booking.budget || "N/A"}</p>
          <p><strong>Message:</strong></p>
          <p>${booking.message || "No message provided."}</p>
        `,
      });
    } catch (emailError) {
      console.error("Booking email failed:", emailError);
    }
try {
  await sendEmail({
    to: booking.email,
    subject: "We received your booking request - The QueensMen",
    html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.6;">
        <h2>Thank you for your booking request</h2>

        <p>Hi ${booking.fullName},</p>

        <p>
          We received your booking request for The QueensMen.
          Our team will review the details and follow up with you soon.
        </p>

        <h3>Booking Details</h3>
        <p><strong>Event Type:</strong> ${booking.eventType}</p>
        <p><strong>Event Date:</strong> ${
          booking.eventDate
            ? new Date(booking.eventDate).toLocaleDateString()
            : "N/A"
        }</p>
        <p><strong>Location:</strong> ${booking.location}</p>
        <p><strong>Models Needed:</strong> ${booking.numberOfModels}</p>
        <p><strong>Budget:</strong> ${booking.budget || "N/A"}</p>

        <p style="margin-top: 24px;">
          Thank you,<br />
          <strong>The QueensMen Team</strong>
        </p>
      </div>
    `,
  });
} catch (emailError) {
  console.error("Booking confirmation email failed:", emailError);
}
    res.status(201).json({
      success: true,
      message: "Booking request submitted successfully.",
      booking,
    });
  } catch (error) {
    console.error("Submit booking error:", error);

    res.status(500).json({
      success: false,
      message: "Server error while submitting booking request.",
    });
  }
});

// @route   GET /api/bookings
// @desc    Get all booking requests
// @access  Admin
router.get("/", adminProtect, async (req, res) => {
  try {
    const bookings = await Booking.find().sort({ createdAt: -1 });

    res.json({
      success: true,
      count: bookings.length,
      bookings,
    });
  } catch (error) {
    console.error("Get bookings error:", error);

    res.status(500).json({
      success: false,
      message: "Server error while getting bookings.",
    });
  }
});

// @route   PATCH /api/bookings/:id/status
// @desc    Update booking status and email client
// @access  Admin
router.patch("/:id/status", adminProtect, async (req, res) => {
  try {
    const { status } = req.body;

    const allowedStatuses = ["Pending", "Reviewed", "Approved", "Declined"];

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid booking status.",
      });
    }

    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking request not found.",
      });
    }

    const previousStatus = booking.status;

    booking.status = status;

    const updatedBooking = await booking.save();

    // Only email client when status actually changes
    if (previousStatus !== status && ["Approved", "Declined"].includes(status)) {
      try {
        const isApproved = status === "Approved";

        await sendEmail({
          to: updatedBooking.email,
          subject: isApproved
            ? "Your QueensMen booking request was approved"
            : "Update on your QueensMen booking request",
          html: `
            <div style="font-family: Arial, sans-serif; line-height: 1.6;">
              <h2>
                ${
                  isApproved
                    ? "Your booking request was approved"
                    : "Your booking request was declined"
                }
              </h2>

              <p>Hi ${updatedBooking.fullName},</p>

              <p>
                ${
                  isApproved
                    ? "Good news! Your booking request for The QueensMen has been approved. Our team will follow up with final details."
                    : "Thank you for your interest in booking The QueensMen. Unfortunately, this booking request was declined at this time."
                }
              </p>

              <h3>Booking Details</h3>

              <p><strong>Event Type:</strong> ${updatedBooking.eventType}</p>

              <p><strong>Event Date:</strong> ${
                updatedBooking.eventDate
                  ? new Date(updatedBooking.eventDate).toLocaleDateString()
                  : "N/A"
              }</p>

              <p><strong>Location:</strong> ${updatedBooking.location}</p>

              <p><strong>Models Needed:</strong> ${
                updatedBooking.numberOfModels
              }</p>

              <p><strong>Status:</strong> ${updatedBooking.status}</p>

              <p style="margin-top: 24px;">
                Thank you,<br />
                <strong>The QueensMen Team</strong>
              </p>
            </div>
          `,
        });
      } catch (emailError) {
        console.error("Booking status email failed:", emailError);
      }
    }

    res.json({
      success: true,
      message: "Booking status updated successfully.",
      booking: updatedBooking,
    });
  } catch (error) {
    console.error("Update booking status error:", error);

    res.status(500).json({
      success: false,
      message: "Server error while updating booking status.",
    });
  }
});


// @route   PUT /api/bookings/:id/status
// @desc    Update booking status
// @access  Admin
router.put("/:id/status", adminProtect, async (req, res) => {
  try {
    const { status, adminNotes } = req.body;

    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found.",
      });
    }

    booking.status = status || booking.status;

    if (adminNotes !== undefined) {
      booking.adminNotes = adminNotes;
    }

    await booking.save();
    await sendEmail({
      to: booking.email,
      subject: `Booking Status Updated - ${booking.status}`,

      html: `
    <div style="font-family: Arial, sans-serif; padding: 30px; background: #f8fafc;">
      
      <div style="max-width: 600px; margin: auto; background: white; border-radius: 20px; padding: 40px;">
        
        <h1 style="color: #b91c1c; margin-bottom: 10px;">
          The QueensMen
        </h1>

        <h2 style="margin-top: 0; color: #111827;">
          Booking Status Updated
        </h2>

        <p style="font-size: 16px; color: #374151;">
          Hello ${booking.fullName},
        </p>

        <p style="font-size: 16px; color: #374151; line-height: 1.7;">
          Your booking request has been updated by our team.
        </p>

        <div
          style="
            margin-top: 30px;
            margin-bottom: 30px;
            padding: 20px;
            border-radius: 16px;
            background: #f3f4f6;
          "
        >
          <p style="margin: 0; font-size: 15px;">
            <strong>Status:</strong>
            ${booking.status}
          </p>

          ${
            booking.adminNotes
              ? `
            <div style="margin-top: 15px;">
              <strong>Admin Notes:</strong>
              <p style="margin-top: 8px; line-height: 1.6;">
                ${booking.adminNotes}
              </p>
            </div>
          `
              : ""
          }
        </div>

        <p style="font-size: 16px; color: #374151;">
          Thank you for choosing The QueensMen.
        </p>

        <p style="margin-top: 30px; color: #6b7280;">
          — The QueensMen Team
        </p>
      </div>
    </div>
  `,
    });

    res.json({
      success: true,
      message: "Booking updated successfully.",
      booking,
    });
  } catch (error) {
    console.error("Update booking status error:", error);

    res.status(500).json({
      success: false,
      message: "Server error while updating booking.",
    });
  }
});


export default router;
