const { sendMail } = require("../../helpers/mailer");

// Kept same signature: { from, to, subject, htmlContent }
const NotificationEmail = async ({ from, to, subject, htmlContent }) => {
  return sendMail({ to, subject, htmlContent });
};

module.exports = NotificationEmail;
