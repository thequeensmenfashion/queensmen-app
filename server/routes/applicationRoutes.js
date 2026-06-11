import express from "express";
import Application from "../models/Application.js";
import adminProtect from "../middleware/adminProtect.js";
const router = express.Router();
import sendEmail from "../utils/sendEmail.js";

// @route   POST /api/applications
// @desc    Submit model application
// @access  Public
router.post("/", async (req, res) => {
  try {
   const {
     fullName,
     email,
     phone,
     location,
     age,
     height,
     experience,
     instagram,
     portfolio,
     availability,
     profileImage,
     message,
   } = req.body;
    if (!fullName || !email || !phone || !location) {
      return res.status(400).json({
        success: false,
        message: "Please fill in all required fields.",
      });
    }

   const application = await Application.create({
     fullName,
     email,
     phone,
     location,
     age,
     height,
     experience,
     instagram,
     portfolio,
     availability,
     profileImage,
     message,
   });
try {
  await sendEmail({
    to: process.env.OWNER_EMAIL,
    subject: "New QueensMen Model Application",
    html: `
      <h2>New Model Application</h2>
      <p><strong>Name:</strong> ${application.fullName}</p>
      <p><strong>Email:</strong> ${application.email}</p>
      <p><strong>Phone:</strong> ${application.phone}</p>
      <p><strong>Location:</strong> ${application.location}</p>
      <p><strong>Experience:</strong> ${application.experience || "N/A"}</p>
      <p><strong>Message:</strong></p>
      <p>${application.message || "No message provided."}</p>
    `,
  });
} catch (emailError) {
  console.error("Application email failed:", emailError);
}
try {
  await sendEmail({
    to: application.email,
    subject: "We received your model application - The QueensMen",
    html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.6;">
        <h2>Thank you for applying to The QueensMen</h2>

        <p>Hi ${application.fullName},</p>

        <p>
          We received your model application. Our team will review your
          information, experience, availability, and photos if provided.
        </p>

        <p>
          If your application is a good fit, someone from The QueensMen team
          will follow up with you.
        </p>

        <h3>Application Details</h3>
        <p><strong>Name:</strong> ${application.fullName}</p>
        <p><strong>Email:</strong> ${application.email}</p>
        <p><strong>Phone:</strong> ${application.phone}</p>
        <p><strong>Location:</strong> ${application.location}</p>
        <p><strong>Experience:</strong> ${application.experience || "N/A"}</p>

        <p style="margin-top: 24px;">
          Thank you,<br />
          <strong>The QueensMen Team</strong>
        </p>
      </div>
    `,
  });
} catch (emailError) {
  console.error("Application confirmation email failed:", emailError);
}
    res.status(201).json({
      success: true,
      message: "Application submitted successfully.",
      application,
    });
  } catch (error) {
    console.error("Submit application error:", error);

    res.status(500).json({
      success: false,
      message: "Server error while submitting application.",
    });
  }
});

// @route   GET /api/applications
// @desc    Get all applications
// @access  Admin later
router.get("/", adminProtect, async (req, res) => {
  try {
    const applications = await Application.find().sort({ createdAt: -1 });

    res.json({
      success: true,
      count: applications.length,
      applications,
    });
  } catch (error) {
    console.error("Get applications error:", error);

    res.status(500).json({
      success: false,
      message: "Server error while getting applications.",
    });
  }
});
// @route   PATCH /api/applications/:id/status
// @desc    Update application status and email applicant
// @access  Admin
router.patch("/:id/status", adminProtect, async (req, res) => {
  try {
    const { status } = req.body;

    const allowedStatuses = ["Pending", "Reviewed", "Accepted", "Rejected"];

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid application status.",
      });
    }

    const application = await Application.findById(req.params.id);

    if (!application) {
      return res.status(404).json({
        success: false,
        message: "Application not found.",
      });
    }

    const previousStatus = application.status;

    application.status = status;

    const updatedApplication = await application.save();

    // Only email applicant when status actually changes
    if (
      previousStatus !== status &&
      ["Accepted", "Rejected"].includes(status)
    ) {
      try {
        const isAccepted = status === "Accepted";

        await sendEmail({
          to: updatedApplication.email,
          subject: isAccepted
            ? "Your QueensMen model application was accepted"
            : "Update on your QueensMen model application",
          html: `
            <div style="font-family: Arial, sans-serif; line-height: 1.6;">
              <h2>
                ${
                  isAccepted
                    ? "Your model application was accepted"
                    : "Your model application was not accepted"
                }
              </h2>

              <p>Hi ${updatedApplication.fullName},</p>

              <p>
                ${
                  isAccepted
                    ? "Congratulations! Your model application for The QueensMen has been accepted. Our team will follow up with next steps."
                    : "Thank you for applying to The QueensMen. Unfortunately, your application was not accepted at this time."
                }
              </p>

              <h3>Application Details</h3>

              <p><strong>Name:</strong> ${updatedApplication.fullName}</p>
              <p><strong>Email:</strong> ${updatedApplication.email}</p>
              <p><strong>Phone:</strong> ${updatedApplication.phone}</p>
              <p><strong>Location:</strong> ${updatedApplication.location}</p>
              <p><strong>Status:</strong> ${updatedApplication.status}</p>

              <p style="margin-top: 24px;">
                Thank you,<br />
                <strong>The QueensMen Team</strong>
              </p>
            </div>
          `,
        });
      } catch (emailError) {
        console.error("Application status email failed:", emailError);
      }
    }

    res.json({
      success: true,
      message: "Application status updated successfully.",
      application: updatedApplication,
    });
  } catch (error) {
    console.error("Update application status error:", error);

    res.status(500).json({
      success: false,
      message: "Server error while updating application status.",
    });
  }
});
// @route   DELETE /api/applications/:id
// @desc    Delete application
// @access  Admin
router.delete("/:id", adminProtect, async (req, res) => {
  try {
    const application = await Application.findById(req.params.id);

    if (!application) {
      return res.status(404).json({
        success: false,
        message: "Application not found.",
      });
    }

    await application.deleteOne();

    res.json({
      success: true,
      message: "Application deleted successfully.",
      id: req.params.id,
    });
  } catch (error) {
    console.error("Delete application error:", error);

    res.status(500).json({
      success: false,
      message: "Server error while deleting application.",
    });
  }
});
export default router;
