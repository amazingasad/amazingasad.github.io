require("dotenv").config();
const express = require("express");
const serverless = require("serverless-http");
const cors = require("cors");
const helmet = require("helmet");
const validator = require("email-validator");
const nodemailer = require("nodemailer");
const { google } = require("googleapis");

const app = express();
const router = express.Router();
app.use(express.json());
app.use(helmet());
app.use(
  cors({
    origin: ["https://in-asad.com", "in-asad.netlify.app"],
  })
);

router.post("/", async (req, res) => {
  const { name, email, subject, message } = req.body;

  if (name && email && subject && message) {
    if (!validator.validate(email))
      return res.status(400).json({ message: "Email is not valid" });

    const auth = google.auth.OAuth2;
    const client = new auth(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET
    );
    client.setCredentials({
      refresh_token: process.env.GOOGLE_CLIENT_REFRESH_TOKEN,
    });
    const accessToken = client.getAccessToken();

    const transport = nodemailer.createTransport({
      service: "gmail",
      auth: {
        type: "OAuth2",
        user: process.env.GOOGLE_MAIL,
        clientId: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        refreshToken: process.env.GOOGLE_CLIENT_REFRESH_TOKEN,
        accessToken,
      },
    });

    const options = {
      from: `${name} <${email}>`,
      to: process.env.CONTACT_MAIL,
      subject: `${name} contacted you!`,
      html: `
        Hi Asad,<br>
        You've been contacted by ${name}. Here is the raw data,<br>
        <br>
        Name: ${name}<br>
        Email: ${email}<br>
        Subject: ${subject}<br>
        Message: "${message}" 
      `,
    };

    transport.sendMail(options, (error, _) => {
      if (error)
        return res.status(400).json({ message: "Something went wrong" });

      return res.status(200).json({
        message: "Message sent successfully",
      });
    });
  } else {
    return res.status(400).json({ message: "Fields are empty" });
  }
});

router.get("/", (req, res) => {
  return res.status(400).json({ message: "What are you doing here, bro?" });
});

app.use("/api/contact", router);

module.exports.handler = serverless(app);
