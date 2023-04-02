const express = require("express");
const UserRouter = express.Router();
const { validateData } = require("../utils/AuthUtils");
const User = require("../Models/UserModels");
const { isAuth } = require("../Middlewares/AuthMiddleware");
// register user
UserRouter.post("/registration", async (req, res) => {
  try {
    validateData(req.body);
    let userObj = new User(req.body);
    try {
      const result = await userObj.registerUser();
      res
        .status(201)
        .json({ data: result, message: "User registered successfully" });
      //res.status(200).redirect("/login");
    } catch (error) {
      res.status(400).json({ error: error.message, message: "Database error" });
    }
  } catch (error) {
    console.log(error);
    res.status(400).json({ error: error.message, message: "Database error" });
  }
});

// login user

UserRouter.post("/login", async (req, res) => {
  const { loginId, password } = req.body;
  if (!loginId || !password) {
    res.status(400).json({
      error: "Please provide email and password",
      message: "Missing Credentials",
    });
  }
  try {
    const user = await User.loginUser({ loginId, password });
    if (user) {
      // session based authentication
      req.session.isAuth = true;
      req.session.user = {
        username: user.username,
        email: user.email,
        userId: user._id,
      };
      res.status(200).redirect("/dashboard");
    } else {
      throw Error("Some Error occured while logging in");
    }
  } catch (error) {
    res.status(400).json({ error: error.message, message: "Database error" });
  }
});

// verify user
UserRouter.get("/verify/:token", async (req, res) => {
  const token = req.params.token;
  try {
    const verifiedUser = await User.verifyUser(token);
    if (verifiedUser) {
      res.status(200).redirect("/login");
    }
  } catch (error) {
    res.status(400).json({ error: error.message, message: "Database error" });
  }
});
// reset Password
UserRouter.get("/reset/:token", async (req, res) => {
  const token = req.params.token;
  try {
    const verifiedUser = await User.resetPass(token);
    if (verifiedUser) {
      res.render("forgetPass");
    }
  } catch (error) {
    res.status(400).json({ error: error.message, message: "Database error" });
  }
});
// reset Password
UserRouter.post("/forget-pass", async (req, res) => {
  try {
    const verifiedUser = await User.updatePass({
      loginId: req.body.loginId,
      password: req.body.password,
    });
    if (verifiedUser) {
      res.redirect("/login");
    }
  } catch (error) {
    res.status(400).json({ error: error.message, message: "Database error" });
  }
});
UserRouter.post("/resend-mail", async (req, res) => {
  let email = req.body.email;
  try {
    const isSent = await User.resendMail(email);
    res.status(200).json({ data: isSent, message: "Mail sent successfully" });
  } catch (error) {
    res.status(400).json({ error: error.message, message: "Database error" });
  }
});

UserRouter.post("/logout", isAuth, (req, res) => {
  console.log({ session: req.session });
  req.session.destroy((err) => {
    if (err) throw Error(err);

    res.redirect("/login");
  });
});

module.exports = UserRouter;
