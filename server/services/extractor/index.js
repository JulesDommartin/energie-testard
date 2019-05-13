const child_process = require('child_process');
const path          = require('path');

class Extractor {

  constructor() {

  }

  extract(id) {
    child_process.exec("java -jar extractValues.jar", {
      cwd: path.join(__dirname, '../../../../IRISE/irise-toBeExtracted')
    }, (err, stdout) => {
      if (err) {
        console.error(err);
      }
      console.log(stdout);
    });
  }

};

module.exports = new Extractor();