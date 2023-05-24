var express = require("express");
const { doReservation } = require("../controllers/userController");
const Images = require("../models/ImagesModel");
var router = express.Router();

/* GET home page. */
router.get("/", async function (req, res, next) {
  const imgData = await Images.findOne({}).lean();
  const images = imgData?.images;
  res.render("user/index", { title: "Sens Residency", images });
});

router.post("/reservation-form", doReservation);

router.get("/blog", (req, res) => {
  res.render("user/blog", { title: "Sens Residency Blog", layout: false });
});

module.exports = router;
