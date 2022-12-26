const nodemailer = require("nodemailer");

exports.sendEmail = async (options) => {
  // 1-create transporter (service that send email like)
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: 465,
    secure: true, // true for 465, false for port 587
    auth: {
      user: process.env.EMAIL_USER, // generated ethereal user
      pass: process.env.EMAIL_PASS, // generated ethereal password
    },
  });
  //   2-email options
  const emailOptions = {
    from: '"E-commerce App" <somaiabahaa@gmail.com>', // sender address
    to: options.email, // list of receivers
    subject: options.subject, // Subject line
    text: options.message, // plain text body
  };

  await transporter.sendMail(emailOptions);
};
