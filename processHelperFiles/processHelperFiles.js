// inject 2.json into 1.json and write the output to stdout

var file1, file2;
var masterFile, injectFile;

fs = require('fs')
fs.readFile('1.json', 'utf8', function (err,data) {
  if (err) {
      return console.log('1.json' + err);
  }
  masterFile = JSON.parse(data);
  if (masterFile.title !== 'Sam Helper Configuration') {
    console.log('ERROR: 1.json is not a SAM Helper Configuration file');
  } else {
      fs.readFile('2.json', 'utf8', function (err,data) {
        if (err) {
          return console.log('2.json' + err);
        }
        injectFile = JSON.parse(data);
        if (!injectFile.page_name) {
            console.log('ERROR: 1.json is not a SAM Helper Configuration file');
        } else {
            for (var i=0; i < masterFile.pages.length; i++) {
              if (masterFile.pages[i].page_name === injectFile.page_name) {
                console.log('REPLACING PAGE: "' + injectFile.page_name + '"');
                masterFile.pages.splice(i, 1);
              }
            }
              console.log('INSERTING NEW PAGE: "' + injectFile.page_name + '"');
              masterFile.pages.push(injectFile);
              console.log('Modified file follows:\n*************************\n\n\n' +
                        JSON.stringify(masterFile));
        }
     });
  }
});

