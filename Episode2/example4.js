// Load a binary document. Since binaries may be large, use a write stream.
var fs = require("fs");

var marklogic = require("marklogic");
var connInfo =  {
                  host: 'localhost',
                  port: 6000,
                  user: 'admin',
                  password: 'admin'
                };
var dbClient = marklogic.createDatabaseClient(connInfo);

var file = "c:/usingnodejs/episode2/manhattan.jpg";
var uri = file.replace("c:/usingnodejs/episode2/", "/binary/");

console.log('Writing a document from a stream...');

var writableStream = dbClient.documents.createWriteStream({
  "uri": uri, "contentType": "image/jpeg", "collections": ["images", "cocktails"]
  });

fs.createReadStream(file).pipe(writableStream);

writableStream.result(function(response) {
    console.log('Write complete.  URI = '+ response.documents[0].uri);
  }, function(error) {
    console.log(JSON.stringify(error));
  });
