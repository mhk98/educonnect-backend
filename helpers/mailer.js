const nodemailer = require("nodemailer");
const path = require("path");

const createTransporter = () => {
  if (!process.env.SMTP_HOST || !process.env.SMTP_USER) return null;
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT) || 587,
    secure: Number(process.env.SMTP_PORT) === 465,
    auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
  });
};

// Supports both `html` and `htmlContent` param names, and optional `filePath` attachment
const sendMail = async ({ to, subject, html, htmlContent, filePath = null }) => {
  const transporter = createTransporter();
  if (!transporter) {
    console.warn("SMTP not configured — email skipped");
    return false;
  }
  const body = html || htmlContent || "";
  const mailOptions = {
    from: `"${process.env.SMTP_FROM || "EduConnect"}" <${process.env.SMTP_USER}>`,
    to: Array.isArray(to) ? to.join(", ") : to,
    subject,
    html: body,
    attachments: filePath
      ? [{ filename: path.basename(filePath), path: filePath }]
      : [],
  };
  try {
    const info = await transporter.sendMail(mailOptions);
    if (info.accepted.length > 0) {
      console.log("✅ Email sent to:", info.accepted.join(", "));
      return true;
    }
    console.log("❌ Email not accepted");
    return false;
  } catch (error) {
    console.error("❌ Email error:", error);
    return false;
  }
};

module.exports = { sendMail };
