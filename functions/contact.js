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
    origin: ["https://in-asad.com", "https://in-asad.netlify.app"],
  })
);

router.post("/", async (req, res) => {
  const { name, email, subject, message } = req.body;

  if (name && email && subject && message) {
    if (!validator.validate(email))
      return res.status(400).json({ message: "Email is not valid" });

    const transport = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      auth: {
        user: process.env.GOOGLE_MAIL,
        pass: process.env.GOOGLE_PASS,
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
      headers: {
        "X-Mailer": "Raiyan's Mailer",
      },
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
