var express = require("express");
const { doReservation } = require("../controllers/userController");
var router = express.Router();

/* GET home page. */
router.get("/", function (req, res, next) {
  res.render("user/index", { title: "Sens Residency" });
});

router.post("/reservation-form", doReservation);

router.get("/blog", (req, res) => {
  res.render("user/blog", { title: "Sens Residency Blog", layout: false });
});

module.exports = router;
