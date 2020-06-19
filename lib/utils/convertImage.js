const Jimp = require('jimp');
const fs = require('fs');

const args = process.argv.slice(2);
const source = args[0];
const target = args[1];
const imagesDir = '../../resources/images/memes';

/**
 * Converts image types using JIMP.
 * 
 * This is a Node.js command that takes a source and a target
 * and will automatically look for the files in resources/images/memes.
 * 
 * JIMP conversions do NOT work well. Online solutions are better atm.
 */
const convertImage = () => {
  if (!source || !target) {
    console.log(`Invalid arguments: ${{source: source, target: target}}`);
  }
  const sourceFile = `${imagesDir}/${source}`;
  const targetFile = `${imagesDir}/${target}`;
  Jimp.read(sourceFile, (err, image) => {
    if (err) {
      console.log(err);
    } else {
      image.write(targetFile);
      fs.unlink(sourceFile, () => {
        console.log(`${sourceFile} has been deleted.\n${targetFile} has been added.\n`);
        console.log('Image conversion success!');
      });
    }
  })
}

convertImage();