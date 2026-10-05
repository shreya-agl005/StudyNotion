const nodemailer = require("nodemailer")

// Throws on failure so callers can tell the user the email was not delivered
const mailSender = async (email, title, body) => {
  let transporter = nodemailer.createTransport({
    host: process.env.MAIL_HOST,
    // 587 by default (Gmail); use 2525 where 587 is blocked (e.g. Brevo on Render's free plan)
    port: Number(process.env.MAIL_PORT) || 587,
    auth: {
      user: process.env.MAIL_USER,
      pass: process.env.MAIL_PASS,
    },
    secure: false,
  })

  let info = await transporter.sendMail({
    // MAIL_FROM is needed when the SMTP login is not an email address (e.g. Brevo)
    from: `"Studynotion | CodeHelp" <${process.env.MAIL_FROM || process.env.MAIL_USER}>`, // sender address
    to: `${email}`, // list of receivers
    subject: `${title}`, // Subject line
    html: `${body}`, // html body
  })
  console.log(info.response)
  return info
}

module.exports = mailSender
