const validator = require("validator");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");

const validateData = ({ email, name, password, username, phone }) => {
  // check if any parameters are empty
  if (!email || !password || !username || !phone) {
    throw Error("Missing Credentials");
  }
  // phone validation
  if (!validator.isNumeric(phone) || phone.length !== 10) {
    throw new Error("Invalid phone number");
  }
  if (!validator.isEmail(email)) {
    throw new Error("Invalid email");
  }
  if (!validator.isLength(password, { min: 6, max: 30 })) {
    throw new Error("password must be between 6 and 30 characters");
  }
  if (!validator.isLength(username, { min: 3, max: 30 })) {
    throw new Error("username must be between 3 and 30 characters");
  }
};

const generateToken = (email) => {
  return jwt.sign({ email: email }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE,
  });
};
const sendMail = (email, verificationToken) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });
  const mailOptions = {
    from: "Profile App",
    to: email,
    subject: "Welcome to the App",
    subject: "Verify your Email",
    html: `click <a href="http://localhost:5000/verify/${verificationToken}">Here</a> to verify.`,
  };
  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);
      throw error;
    } else {
      console.log("Email sent: " + info.response);
    }
  });
};
const forgetPass = (email, verificationToken) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });
  const mailOptions = {
    from: "Profile App",
    to: email,
    subject: "Reset Password",
    subject: "Reset Your Password",
    html: `click <a href="http://localhost:5000/reset/${verificationToken}">Here</a> to reset.`,
  };
  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);
      throw error;
    } else {
      console.log("Email sent: " + info.response);
    }
  });
};
module.exports = {
  validateData,
  generateToken,
  sendMail,
  forgetPass,
};
