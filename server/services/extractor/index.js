const child_process = require('child_process');
const path          = require('path');

class Extractor {

  constructor() {

  }

  extract(id) {
    const pathUrl = path.join(__dirname, '../../../IRISE/irise-toBeExtracted');
    console.log(pathUrl);
    let child = child_process.exec("java -jar extractValues.jar", {
      cwd: pathUrl
    }, (err, stdout, stderr) => {
      if (err) {
        console.error(err);
      }
      console.log(stdout);
      console.error(stderr);
    });
    Object.keys(child).forEach(key => console.log(key));
    console.log(child.stdin);
  }

};

module.exports = new Extractor();