var http = require("http"),
  url = require("url"),
  path = require("path"),
  fs = require("fs"),
  jade = require('jade'),
  port = process.argv[2] || 8888;

http.createServer(function(request, response) {

  var uri = url.parse(request.url).pathname,
    filename = path.join(process.cwd(), uri);

  fs.exists(filename, function(exists) {
    if (!exists) {
      response.writeHead(404, {
        "Content-Type": "text/plain"
      });
      response.write("404 Not Found\n");
      response.end();
      return;
    }

    if (fs.statSync(filename).isDirectory()) filename += '/index.jade';

    fs.readFile(filename, "binary", function(err, file) {
      if (err) {
        response.writeHead(500, {
          "Content-Type": "text/plain"
        });
        response.write(err + "\n");
        response.end();
        return;
      }

      if (path.extname(filename) === '.jade') { // only render through jade if filename =~ *.jade
        var locals = {
          events: [{
            time: "Tuesday, February 24th: 6pm - 8pm",
            description: "NodeSchool Meetup - Hot Pink, Ink"
          }, {
            time: "Tuesday, March 10th: 6pm - 8pm",
            description: "HTML Preprocessor Workshop - Hot Pink, Ink"
          }]
        }
        var file = jade.render(file, locals)
      }
      response.writeHead(200);
      response.write(file, "binary");
      response.end();
    });
  });
}).listen(parseInt(port, 10));

console.log("Static file server running at\n  => http://localhost:" + port + "/\nCTRL + C to shutdown");
