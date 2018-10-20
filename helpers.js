const fs = require('fs');
const path = require('path');
const readChunk = require('read-chunk');
const fileType = require('file-type');


const backUpFile = (filePath)=> {
  const backUpPath = filePath + '.bak';
  fs.copyFileSync(filePath, backUpPath);
  return backUpPath;
}


const listDir = (dirPath, agg) => {
  const files = fs.readdirSync(dirPath);
  files.forEach((filePath)=>{
    const fullPath = path.join(dirPath, filePath);
    const stat = fs.lstatSync(fullPath);
    if(stat.isDirectory()) return listDir(fullPath, agg);
    const type = fileType(readChunk.sync(fullPath, 0, 4100));
    agg.push({fullPath, type, size: stat.size / (1024 ** 2)});
  });
};

const listDirRecursively = (dirPath) => {
  const allFiles = [];
  listDir(dirPath, allFiles);
  return allFiles
}


module.exports = {
  backUpFile,
  listDirRecursively
}
