const isAuth = (req, res, next) => {
  if (req.session.isAuth) {
    next();
  } else {
    console.log("Please login first!");
    res.render("login");
    /* return res.send({
      status: 405,
      message: "Invalid session, Please login again",
    }); */
  }
};

module.exports = { isAuth };
