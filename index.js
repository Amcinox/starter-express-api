const express = require("express");
const nodemailer = require("nodemailer");

const app = express();
app.all("/", (req, res) => {
  console.log("Just got a request!");
  res.send("Yo!");
});

app.post("/send-message", (req, res) => {
  const { message, name, email } = req.body;

  // Create the transporter object for sending email
  const transporter = nodemailer.createTransport({
    host: "smtp.example.com", // Replace with your SMTP server
    port: 587,
    auth: {
      user: "username",
      pass: "password",
    },
  });

  // Set up the email details
  const mailOptions = {
    from: '"My App" <no-reply@example.com>',
    to: "amcinox@gmail.com",
    subject: "New Message",
    text: `Name: ${name}\nEmail: ${email}\nMessage: ${message}`,
  };

  // Send the email
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error(error);
      res.status(400).send("Failed to send message");
    } else {
      console.log(`Message sent: ${info.response}`);
      res.sendStatus(200);
    }
  });
});
app.listen(process.env.PORT || 3000);
