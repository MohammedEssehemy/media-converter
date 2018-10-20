const ffmpeg = require('fluent-ffmpeg');
const { backUpFile, listDirRecursively } = require('./helpers');
const parentDirectory = './inputFiles';

const convertAudio = (input, backup = true) => {
  console.log('backing up input file');
  const backUpPath = backUpFile(input);
  console.log(`converting ${input}`);
  console.time(input);
  return new Promise((resolve,reject)=>{
    ffmpeg(backUpPath)
    // set audio bitrate
    .audioBitrate('64k')
    // set audio codec
    .audioCodec('libmp3lame')
    .format('mp3')
    .on('end', ()=>{
      console.log('*******************');
      console.log(`${input} converted successfully`);
      console.timeEnd(input);
      console.log('*******************');
      if(!backup) fs.unlinkSync(backUpPath);
      resolve(input);
    })
    .on('error', (err)=>{
      console.error(`error converting ${input}`, err);
      reject(err);
    })
    .save(input);
  });
}



const convertDirAudioFiles = async (dirPath) => {
  const audioFiles = listDirRecursively(parentDirectory)
  .filter(file=> file.type && file.type.mime.startsWith('audio'));
  for (const file of audioFiles) {
    await convertAudio(file.fullPath, true);
  }
}

convertDirAudioFiles(parentDirectory);
