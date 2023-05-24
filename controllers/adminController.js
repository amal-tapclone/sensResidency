const {
  saveImagesToDb,
  saveSingleImageToDb,
} = require("../helpers/adminHelpers");
const {
  convertToWebP,
  convertSingleImgToWebP,
} = require("../services/imageProcessing");
const removeTempImages = require("../services/removeImgFiles");

module.exports = {
  handleImageUpload: (req, res, next) => {
    const files = req.files;
    // console.log(req.files, "kdfkjdkfkkkkkkkk");

    const invalidFiles = files.filter(
      (file) => !file.mimetype.startsWith("image/")
    );

    if (invalidFiles.length > 0) {
      throw new Error("Invalid file type");
    }
    if (files.length < 5) throw new Error("not enough Images");
    convertToWebP((width = 653), (height = 359), files).then((results) => {
      console.log(results);
      // removeTempImages(results);
      saveImagesToDb(files).then((results) => {
        res.redirect("/admin");
      });
    });
  },

  handleSingleImgUpload: (req, res) => {
    const inputfile = req.file;
    const imageId = req.params.id;
    if (!inputfile) {
      res.send("please choose a image");
      return;
    } else if (!inputfile.mimetype.startsWith("image/")) {
      throw new Error("Invalid single file type");
    }

    convertSingleImgToWebP((width = 653), (height = 359), inputfile).then(
      (results) => {
        console.log(results);
        saveSingleImageToDb(inputfile, imageId).then((results) => {
          res.redirect("/admin");
        });
      }
    );
  },
};
