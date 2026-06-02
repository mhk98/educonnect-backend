const nodemailer = require("nodemailer");
const path = require("path");

const NotificationEmail = async ({ from, to, subject, htmlContent }) => {
  const transporter = nodemailer.createTransport({
    // host: "eaconsultancy.info",
    host: "premium15.web-hosting.com",
    port: 465,
    secure: true,
    auth: {
      user: "ceo@eaconsultancy.info",
      pass: "EduAnchorCEO2911%",
    },
  });

  const mailOptions = {
    // from: from,
    from: "ceo@eaconsultancy.info",
    // to: to,
    to: "ceo@eaconsultancy.info",
    subject: subject,
    html: htmlContent,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    if (info.accepted.length > 0) {
      console.log("✅ Email successfully sent to:", info.accepted.join(", "));
      return true;
    } else {
      console.log("❌ Email sending failed.");
      return false;
    }
  } catch (error) {
    console.error("❌ Email error:", error);
    return false;
  }
};

module.exports = NotificationEmail;
