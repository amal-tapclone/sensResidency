var express = require("express");
var router = express.Router();

let userName = "admin@123";
let pin = "12345";

const verifyLogin = (req, res, next) => {
  let session = req.session;
  if (session.admin?.loggedIn) {
    next();
  } else {
    session.loginErr = "Please Login first";
    res.redirect("/admin/login");
    session.loginErr = "";
  }
};

/* Admin Home */
router.get("/", verifyLogin, function (req, res, next) {
  res.render("admin/index", { title: "Hotel Admin", layout: "admin-layout" });
});

router.get("/login", function (req, res, next) {
  let session = req.session;
  if (session.admin?.loggedIn) return res.redirect("/admin");
  res.render("admin/login", {
    title: "Hotel Admin",
    layout: "admin-layout",
    logErr: req.session.loginErr,
  });
  req.session.loginErr = "";
});

router.post("/admin-login", (req, res) => {
  let session = req.session;
  const { email, password } = req.body;
  if (email === "" || password === "") {
    session.loginErr = "Please Enter all Fields";
    return res.redirect("/admin/login");
  }
  if (userName === email && pin === password) {
    session.admin = { loggedIn: true };
    res.redirect("/admin");
  } else {
    session.loginErr = "incorrect username or password";
    res.redirect("/admin/login");
  }
});

module.exports = router;
