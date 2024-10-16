import nodemailer from "nodemailer";

// Create a transporter object
const transporter = nodemailer.createTransport({
  service: "gmail", // You can use any email service provider
  auth: {
    user: process.env.EMAIL_USER, // Your email address
    pass: process.env.EMAIL_PASS, // Your email password or app-specific password
  },
});

export async function sendTrackingEmail(to: string, trackingId: string) {
  const trackingPageUrl = "https://www.store45co.com/track-order";
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to,
    subject: "Your Tracking ID",
    text: `Your order has been processed. Here is your tracking ID: ${trackingId}. You can use this ID on our tracking page: ${trackingPageUrl}`,
    html: `<p>Your order has been processed. Here is your tracking ID: <strong>${trackingId}</strong>.</p>
           <p>You can use this ID on our tracking page: <a href="${trackingPageUrl}">${trackingPageUrl}</a></p>`,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log("Email sent successfully");
  } catch (error) {
    console.error("Error sending email", error);
  }
}
