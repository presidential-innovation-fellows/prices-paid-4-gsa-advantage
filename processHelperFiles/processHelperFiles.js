// trivial node.js server to handles file operations for config helper

var serverInfo = "GET '/page?site_name=<site_name>'\n" +
    "POST '/page?site_name=<site_name>&page_name=<page_name>'\n";

console.log('starting server at "http:127.0.0.1:8124"\n');
console.log(serverInfo);

fs = require('fs');
var http = require('http');

http.createServer(function (request, response) {
  var parsedUrl = require('url').parse(request.url, true);
  console.log('received HTTP ' + request.method + ': ' + parsedUrl.path);
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

function doDefault(parsedUrl, request, response) {
      response.writeHead(200, {'Content-Type': 'text/plain'});
      response.end('<div>' + request.method + ' Not Serviced</div>');
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

function doPostPage(parsedUrl, request, response) {
      var site_name = parsedUrl.query.site_name;
      var page_name = parsedUrl.query.page_name;
      var postData = "";
      fs.readFile(site_name + '.json', 'utf8', function (err,data) {
        if (err) {
            console.log(site_name + ': ' + err);
        } else {
          var configFile = JSON.parse(data);
          request.setEncoding("utf8");
          request.addListener("data", function(chunk) {
              postData += chunk;
          });
          request.addListener("end", function() {
              var pageObject = JSON.parse(postData);
              for (var i=0; i < configFile.pages.length; i++) {
                if (configFile.pages[i].page_name === pageObject.page_name) {
                  console.log('REPLACING PAGE: "' + pageObject.page_name + '"');
                  configFile.pages.splice(i, 1);
                  break;
                }
              }
              console.log('INSERTING NEW PAGE: "' + pageObject.page_name + '"');
              configFile.pages.push(pageObject);
              fs.renameSync(site_name + '.json', site_name + '.temporary');
              fs.writeFile(site_name + '.json', JSON.stringify(configFile), encoding='utf8');
              console.log('RENAME: ' + site_name + '.json to ' + site_name + '.' +
                        new Date().toISOString() + '.json');
              fs.renameSync(site_name + '.temporary', site_name + '.' + new Date().toISOString() + '.json');
              response.writeHead(200, {'Content-Type': 'text/plain'});
              response.end(JSON.stringify(configFile.pages[i]));
          });
        }
      });
}
