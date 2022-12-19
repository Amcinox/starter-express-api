const express = require("express");
const app = express();
const nodemailer = require("nodemailer");
const { json, urlencoded } = require("body-parser");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
require("dotenv").config();

app.use(helmet());
app.use(json({ limit: "50mb" }));
app.use(urlencoded({ extended: true }));
app.use(cors());
app.use(morgan("combined"));

app.all("/", (req, res) => {
  console.log("Just got a request!");
  res.send("Yo!");
});

app.post("/send-message", (req, res) => {
  const { message, name, email } = req.body;
  // Create the transporter object for sending email
  const transporter = nodemailer.createTransport({
    // dot end env

    host: process.env.HOST, // Replace with your SMTP server
    port: 587,
    auth: {
      user: process.env.EMAIL,
      pass: process.env.PASSWORD,
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
      console.log(error);
      res.status(400).send("Failed to send message");
    } else {
      console.log(`Message sent: ${info.response}`);
      res.sendStatus(200);
    }
  });
});
app.listen(process.env.PORT || 3000);
