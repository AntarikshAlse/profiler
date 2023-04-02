const express = require("express");
const UserRouter = require("./Controllers/UserController");
const app = express();
require("dotenv").config();
require("./lib/connectMongo");
const session = require("express-session");
const mongoDbSession = require("connect-mongodb-session")(session);
const { isAuth } = require("./Middlewares/AuthMiddleware");
const ObjectId = require("mongodb").ObjectId;
const PORT = process.env.PORT || 5000;

// middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.use(express.static("public"));
const store = new mongoDbSession({
  uri: process.env.MONGO_URI,
  collection: "sessions",
});
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: store,
  })
);
app.use(UserRouter);
app.get("/", (req, res) => {
  res.redirect("/registration");
});
app.get("/dashboard", isAuth, (req, res) => {
  res.render("dashboard");
});
app.get("/login", (req, res) => {
  res.render("login");
});
app.get("/registration", (req, res) => {
  res.render("register");
});

app.listen(Number(PORT), () => {
  console.log(`Server is running on port ${PORT}`);
});
