var http = require('http');
var url = require('url');
var fs = require('fs');

http.createServer(function (req, res) {
  if(req.method == "GET"){
    var q = url.parse(req.url, true);
    var filename = "." + q.pathname;
    if(q.pathname === '/'){
       filename = "./index.html";
    }
    fs.readFile(filename, function(err, data) {
     if (err) {
       res.writeHead(404, {'Content-Type': 'text/html'});
       return res.end("404 Not Found");
     } 
      res.writeHead(200, {'Content-Type': 'text/html'});
      res.write(data);
      return res.end();
   });
  }
  // Behavior for non-score post requests is undefined.
  else if(req.method == "POST"){
    processPost(req, res, function() {
      // Score data should be of the format:
      // game,name,score
      var score = req.post.split(",");
      var path = 'score_data/' + score[0] + '.txt';

      fs.appendFile(path, score[2] + ":" + score[1] + "\n", function (err) {
        if (err) throw err;
        console.log('SUCCESSFULLY WROTE SCORE TO ' + path);
      });

      res.writeHead(200, "OK", {'Content-Type': 'text/plain'});
      res.end();
    });
  }
}).listen(8080); 

function processPost(request, response, callback) {
  var queryData = "";
  if(typeof callback !== 'function') return null;

  if(request.method == 'POST') {
      request.on('data', function(data) {
          queryData += data;
          if(queryData.length > 1e6) {
              queryData = "";
              response.writeHead(413, {'Content-Type': 'text/plain'}).end();
              request.connection.destroy();
          }
      });

      request.on('end', function() {
          request.post = queryData; //querystring.parse(queryData);
          callback();
      });

  } else {
      response.writeHead(405, {'Content-Type': 'text/plain'});
      response.end();
  }
}