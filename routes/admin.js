var express = require("express");
const mongoose = require("mongoose");
const Images = require("../models/ImagesModel");
const {
  handleImageUpload,
  handleSingleImgUpload,
} = require("../controllers/adminController");
const { upload, uploadSingleImg } = require("../services/multer");
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
router.get("/", async function (req, res, next) {
  let session = req.session;
  if (!session.admin?.loggedIn) {
    return res.redirect("/admin/login");
  }
  const imgData = await Images.findOne({}).lean();
  const images = imgData?.images;
  if (!imgData) {
    return res.redirect("admin/add-images");
  }
  res.render("admin/index", {
    title: "SensResidency-Admin",
    layout: "admin-layout",
    loggedIn: true,
    images,
  });
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

router.get("/add-images", verifyLogin, (req, res) => {
  res.render("admin/add-images", {
    loggedIn: true,
    layout: "admin-layout",
  });
});

router.post(
  "/add-images",
  verifyLogin,
  upload.array("images"),
  handleImageUpload
);

router.post(
  "/edit-image/:id",
  verifyLogin,
  uploadSingleImg.single("image"),
  handleSingleImgUpload
);

router.get("/edit-images/:id", verifyLogin, async (req, res) => {
  let { id } = req.params;
  let image = await Images.findOne(
    { "images._id": id },
    { "images.$": 1 }
  ).lean();
  let imageDoc = image.images[0];
  res.render("admin/edit-images", {
    imageDoc,
    loggedIn: true,
    layout: "admin-layout",
  });
});

router.post("/delete-image/:id", verifyLogin, async (req, res) => {
  let { id } = req.params;
  let imageId = new mongoose.Types.ObjectId(id);
  let imageDoc = await Images.findOne({}).exec();
  let image = imageDoc.images.find((image) => image._id.equals(imageId));
  image.fileName = "";
  image.occupied = false;
  await imageDoc.save();
  res.json({ success: true });
});

router.get("/logout", (req, res) => {
  req.session.destroy();
  res.redirect("/admin/login");
});

module.exports = router;
