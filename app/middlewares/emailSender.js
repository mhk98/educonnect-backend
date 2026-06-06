const { sendMail } = require("../../helpers/mailer");

// Kept same signature: { from, to, subject, htmlContent, filePath }
const sendEmail = async ({
  from,
  to,
  subject,
  htmlContent,
  filePath = null,
}) => {
  return sendMail({ to, subject, htmlContent, filePath });
};

module.exports = sendEmail;
