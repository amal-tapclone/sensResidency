const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const imageObjSchema = new Schema({
  no: { type: Number },
  fileName: { type: String, default: "no-image" },
  occupied: { type: Boolean, default: false },
});

const ImagesSchema = new Schema({
  images: [imageObjSchema],
});

const Images = mongoose.model("Images", ImagesSchema);

module.exports = Images;
