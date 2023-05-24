const path = require("path");
const fs = require("fs");
const tempImgFolder = path.join(
  __dirname,
  "../public/user-assets/temp_img_uploads/"
);

const removeTempImages = (tempImgUrls) => {
  function removeFile(filePath) {
    return new Promise((resolve, reject) => {
      fs.unlink(filePath, (error) => {
        if (error) {
          reject(error);
        } else {
          resolve();
        }
      });
    });
  }

  //   async function removeFiles(filePaths) {
  //     for (const tempImgUrl of filePaths) {
  //       let startIndex = tempImgUrl.originalImagePath.lastIndexOf("\\");
  //       const imgFileName = tempImgUrl.originalImagePath.substring(
  //         startIndex + 1
  //       );
  //       const pathToTempImg = `${tempImgFolder}${imgFileName}`;
  //       try {
  //         await removeFile(pathToTempImg);
  //         console.log(`File ${pathToTempImg} removed successfully.`);
  //       } catch (error) {
  //         console.error(`Error removing file ${pathToTempImg}:`, error);
  //       }
  //     }

  //     console.log("All files removed.");
  //   }

  async function removeFiles(filePaths) {
    const maxRetries = 5;
    const retryDelay = 1000; // 1 second

    for (const tempImgUrl of filePaths) {
      let startIndex = tempImgUrl.originalImagePath.lastIndexOf("\\");
      const imgFileName = tempImgUrl.originalImagePath.substring(
        startIndex + 1
      );
      const pathToTempImg = `${tempImgFolder}${imgFileName}`;

      let retries = 0;
      let removed = false;

      while (!removed && retries < maxRetries) {
        try {
          await removeFile(pathToTempImg);
          console.log(`File ${pathToTempImg} removed successfully.`);
          removed = true;
        } catch (error) {
          if (error.code === "EBUSY") {
            console.log(
              `File ${pathToTempImg} is busy. Retrying in ${retryDelay}ms...`
            );
            await delay(retryDelay);
            retries++;
          } else {
            console.error(`Error removing file ${pathToTempImg}:`, error);
            break;
          }
        }
      }

      if (!removed) {
        console.error(
          `Failed to remove file ${pathToTempImg} after ${maxRetries} retries.`
        );
      }
    }

    console.log("All files removed.");
  }

  function delay(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  removeFiles(tempImgUrls);
};

module.exports = removeTempImages;
