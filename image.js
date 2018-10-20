const Jimp = require('jimp');
// var sizeOf = require('image-size');
// var dimensions = sizeOf('./fixed.png');

const { backUpFile, listDirRecursively } = require('./helpers');
const parentDirectory = './inputFiles';

resizeImage = (input, backup) => {
  console.log('backing up input file');
  const backUpPath = backUpFile(input);
  console.log(`resizing ${input}`);
  console.time(input);
  return Jimp
  .read(backUpPath)
  .then(lenna =>
    lenna
      .resize(Jimp.AUTO, 256) // resize
      .quality(100) // set JPEG quality
      .write(input) // save
  )
  .then(()=>{
    console.log('*******************');
    console.log(`${input} resized successfully`);
    console.timeEnd(input);
    console.log('*******************');
    if(!backup) fs.unlinkSync(backUpPath);
    return input;
  })
  .catch(console.error);
}


const resizeDirImages = async (dirPath) => {
  const images = listDirRecursively(parentDirectory)
  .filter(file=> file.type && file.type.mime.startsWith('image'));
  for (const file of images) {
    await resizeImage(file.fullPath, true);
  }
}

resizeDirImages(parentDirectory);
