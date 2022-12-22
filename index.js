const express = require("express");
const app = express();
const { google } = require("googleapis");
const nodemailer = require("nodemailer");
const { json, urlencoded } = require("body-parser");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
require("dotenv").config();

const PRIVATE_KEY = process.env.PRIVATE_KEY.replace(/\\n/g, "\n");
const CLIENT_EMAIL = process.env.CLIENT_EMAIL;
const client = new google.auth.JWT(CLIENT_EMAIL, null, PRIVATE_KEY, [
  "https://www.googleapis.com/auth/spreadsheets",
]);

app.use(helmet());
app.use(json({ limit: "50mb" }));
app.use(urlencoded({ extended: true }));
// app.use(cors());
app.use(morgan("combined"));

app.all("/", (req, res) => {
  console.log("Just got a request!");
  res.send("Yo!");
});

app.get("/bets", async (req, res) => {
  const sheets = google.sheets({ version: "v4", auth: client });
  try {
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: process.env.SHEET_ID,
      range: "Sheet1!A2:E30",
    });
    const list = response.data.values;
    const filter = list.map((item) => {
      return {
        bet: item[0],
        subtitle: item[1],
        imageURL: item[2],
        description: item[3],
        link: item[4],
      };
    });
    res.send(filter);
  } catch (error) {
    console.log(error);
    res.send("Error");
  }
});

app.listen(process.env.PORT || 3000);
