const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const destinationPath = path.join(
      __dirname,
      "../public/user-assets/temp_img_uploads/"
    );
    cb(null, destinationPath);
  },
  filename: function (req, file, cb) {
    // let fileName = file.originalname.split(".")[0];
    // let dotIndex = file.originalname.lastIndexOf(".");
    // let ext = file.originalname.substr(dotIndex);
    // cb(null, fileName + "--" + Date.now() + ext);
    cb(null, file.originalname);
  },
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 11 * 1024 * 1024, // 1 MB file size limit
    files: 5, // Maximum of 5 files
  },
});

// single file upload
const singleImageStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    const destinationPath = path.join(
      __dirname,
      "../public/user-assets/temp_img_uploads/"
    );
    cb(null, destinationPath);
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

const uploadSingleImg = multer({
  storage: singleImageStorage,
  limits: {
    fileSize: 15 * 1024 * 1024, // 1 MB file size limit
  },
});

module.exports = { upload, uploadSingleImg };
