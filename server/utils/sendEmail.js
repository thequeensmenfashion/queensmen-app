import { Resend } from "resend";
import dotenv from "dotenv";

dotenv.config();

const resend = new Resend(process.env.RESEND_API_KEY);

const sendEmail = async ({ to, subject, html }) => {
  try {
    if (!process.env.RESEND_API_KEY) {
      console.log("RESEND_API_KEY missing. Email not sent.");
      return null;
    }

    if (!to) {
      console.log("Email recipient missing. Email not sent.");
      return null;
    }

    const fromEmail =
      process.env.FROM_EMAIL || "bookings@thequeensmenfasion.com";

    console.log("Sending email with Resend...");
    console.log("TO:", to);
    console.log("FROM:", fromEmail);

    const response = await resend.emails.send({
      from: `The QueensMen <${fromEmail}>`,
      to,
      subject,
      html,
    });

    console.log("Resend response:", response);

    if (response.error) {
      console.error("Resend returned error:", response.error);
      throw new Error(response.error.message);
    }

    return response;
  } catch (error) {
    console.error("Send email error details:", error);
    throw error;
  }
};

export default sendEmail;
