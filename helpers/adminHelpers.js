const path = require("path");
const mongoose = require("mongoose");
const Images = require("../models/ImagesModel");

module.exports = {
  saveImagesToDb: (files) => {
    return new Promise(async (resolve, reject) => {
      const imageArr = files.map((file, index) => {
        const fileName = path.parse(file.filename).name;
        return {
          no: index + 1,
          fileName,
          occupied: true,
        };
      });

      let imageCollectionExist = await Images.findOne({}).exec();
      console.log(imageCollectionExist);

      if (imageCollectionExist) {
        imageCollectionExist.images = imageArr;
        imageCollectionExist
          .save()
          .then((savedImages) => {
            console.log("Images saved successfully:", savedImages);
            resolve(savedImages);
          })
          .catch((error) => {
            console.error("Error saving images:", error);
            reject(error);
          });
        // Images.collection
        //   .replaceOne({}, { images: imageArr })
        //   .then(() => {
        //     console.log(
        //       "Images collection replaced successfully with new array."
        //     );
        //   })
        //   .catch((error) => {
        //     console.error("Error replacing Images collection:", error);
        //   });
      } else {
        const imagesInstance = new Images();
        imagesInstance.images = imageArr;

        imagesInstance
          .save()
          .then((savedImages) => {
            console.log("Images saved successfully:", savedImages);
            resolve(savedImages);
          })
          .catch((error) => {
            console.error("Error saving images:", error);
            reject(error);
          });
      }
    });
  },

  saveSingleImageToDb: (file, imageId) => {
    return new Promise(async (resolve, reject) => {
      const fileName = path.parse(file.filename).name;
      let imageDoc = await Images.findOne({}).exec();
      let docId = new mongoose.Types.ObjectId(imageId);
      let image = imageDoc.images.find((image) => image._id.equals(docId));
      image.fileName = fileName;
      image.occupied = true;
      imageDoc
        .save()
        .then((savedImage) => {
          console.log("Images saved successfully:", savedImage);
          resolve(savedImage);
        })
        .catch((error) => {
          console.error("Error saving image", error);
          reject(error);
        });
    });
  },
};
