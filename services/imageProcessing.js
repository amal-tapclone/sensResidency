const sharp = require("sharp");
const path = require("path");
const fs = require("fs");

const convertToWebP = async (width, height, files, next, res) => {
  const outputFolder = path.join(
    __dirname,
    "../public/user-assets/uploaded_images/"
  );

  const compressionOptions = {
    quality: 80, // Adjust  compression quality (0 - 100)
  };

  const processedImages = files.map((file) => {
    const filePath = file.path; // Path uploaded image file
    const outputFilePath =
      outputFolder + path.parse(file.filename).name + ".webp"; // Output file path  WebP image

    return new Promise((resolve, reject) => {
      sharp(filePath)
        .resize(width, height)
        .webp(compressionOptions)
        .toFile(outputFilePath)
        .then(() => {
          resolve({
            originalImagePath: filePath,
            compressedImagePath: outputFilePath,
          });
        })
        .catch((err) => {
          console.error("Error processing image:", err);

          reject({
            originalImagePath: filePath,
            compressedImagePath: null,
            error: err.message,
          });
        });
    });
  });

  // Wait for all images to be processed
  return new Promise((resolve, reject) => {
    Promise.all(processedImages)
      .then((results) => {
        resolve(results);
      })
      .catch((err) => {
        reject(err);
        console.log(err);
      });
  });
};

const convertSingleImgToWebP = (width, height, file) => {
  const outputFolder = path.join(
    __dirname,
    "../public/user-assets/uploaded_images/"
  );

  const compressionOptions = {
    quality: 100, // Adjust  compression quality (0 - 100)
  };

  const filePath = file.path; // Path uploaded image file
  const outputFilePath =
    outputFolder + path.parse(file.filename).name + ".webp"; // Output file path  WebP image

  return new Promise((resolve, reject) => {
    sharp(filePath)
      .resize(width, height)
      .webp(compressionOptions)
      .toFile(outputFilePath)
      .then(() => {
        resolve({
          originalImagePath: filePath,
          compressedImagePath: outputFilePath,
        });
      })
      .catch((err) => {
        console.log(err);
        reject({
          originalImagePath: filePath,
          compressedImagePath: null,
          error: err.message,
        });
      });
  });
};

module.exports = { convertToWebP, convertSingleImgToWebP };
