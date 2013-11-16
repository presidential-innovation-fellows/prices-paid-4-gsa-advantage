// inject 2.json into 1.json and write the output to stdout

console.log('starting server at "http:127.0.0.1:8124"');
console.log('curl http://127.0.0.1:8124 -d <your data>');

fs = require('fs');
var http = require('http');

http.createServer(function (request, response) {
  var parsedUrl = require('url').parse(request.url, true);
  console.log('HTTP method:j ' + request.method);
  console.log('request has parsed URL:\n');
  console.log(parsedUrl);
  switch (parsedUrl.pathname) {
    case '/site':
    break;

    case '/page':
      switch (request.method) {
        case 'GET':
        doGetPage(parsedUrl, request,response);
        break;

        case 'POST':
        doPostPage(parsedUrl, request,response);
        break;

        default:
        doDefault(parsedUrl, request,response);
      }
    break;

    default:
    break;
  }
}).listen(8124);

function doPostPage(parsedUrl, request, response) {
      var postData = "";
      request.setEncoding("utf8");
      request.addListener("data", function(chunk) {
          postData += chunk;
      });
      request.addListener("end", function() {
          console.log('POST BEGINS:\n' + postData + '\nPOST ENDS');
          response.writeHead(200, {'Content-Type': 'text/plain'});
          response.end('<div>Success</div>');
      });
}

function doGetPage(parsedUrl, request, response) {
  var site_name = parsedUrl.query.site_name;
  var page_name = parsedUrl.query.page_name;
    fs.readFile(site_name + '.json', 'utf8', function (err,data) {
      if (err) {
          console.log(site_name + ': ' + err);
      } else {
          var configFile = JSON.parse(data);
            for (var i=0; i < configFile.pages.length; i++) {
              if (configFile.pages[i].page_name === page_name) {
                response.writeHead(200, {'Content-Type': 'text/plain'});
                response.end(JSON.stringify(configFile.pages[i]));
                break;
              }
            }
      }
    });
}

function doDefault(parsedUrl, request, response) {
      response.writeHead(200, {'Content-Type': 'text/plain'});
      response.end('<div>' + request.method + ' Not Serviced</div>');
}


    /*

var file1, file2;
var masterFile, injectFile;

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

*/
