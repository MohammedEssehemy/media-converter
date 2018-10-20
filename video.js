const hbjs = require('handbrake-js')
const { backUpFile, listDirRecursively } = require('./helpers');
const parentDirectory = './inputFiles';

// IDEA: could use ffmpeg also


const convertVid = (input, backup) => {
    console.log('backing up input file');
    const backUpPath = backUpFile(input);
  console.log(`converting ${input}`);
  console.time(input);
  let lastPercent = 0;
  return new Promise((resolve,reject)=>{
    hbjs.spawn({ input: backUpPath, output: input })
    .on('error', err => {
      console.error(`error converting ${input}`, err);
      // invalid user input, no video found etc
      reject(err);
    })
    .on('progress', progress => {
      if(progress.percentComplete < (lastPercent + 5)) return;
      lastPercent = progress.percentComplete;
      console.log(
        'Percent complete: %s ,%s, ETA: %s',
        input,
        progress.percentComplete,
        progress.eta
      );
    })
    .on('complete', () => {
      console.log('*******************');
      console.log(`${input} converted successfully`);
      console.timeEnd(input);
      console.log('*******************');
      if(!backup) fs.unlinkSync(backUpPath);
      resolve(input);
    })
  });
}


const convertDirVidFiles = async (dirPath) => {
  const vidFiles = listDirRecursively(parentDirectory)
  .filter(file=> file.type && file.type.mime.startsWith('video'));
  for (const file of vidFiles) {
    await convertVid(file.fullPath, true);
  }
}

convertDirVidFiles(parentDirectory);
