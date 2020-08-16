const nodeMailer = require("nodemailer");
const nodemailer = require("../config/nodemailer");

exports.newMail = (user) => {
  let htmlString = nodemailer.renderTemplate({ user }, "/auth/auth.ejs");
  nodemailer.transporter.sendMail(
    {
      from: process.env.MY_MAIL,
      to: user.email,
      subject: "new mail",
      html: htmlString,
    },
    (err, info) => {
      if (err) {
        console.log("Mail sent", err);
        return;
      }
      console.log("mail Sent");
      return;
    }
  );
};
