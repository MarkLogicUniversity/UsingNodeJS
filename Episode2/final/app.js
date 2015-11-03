var express = require('express');
var marklogic = require('marklogic');
var app = express();
var router = express.Router();

var dbConn = require("./connections.js")

var dbRead = marklogic.createDatabaseClient(dbConn.restReader);
var dbWrite = marklogic.createDatabaseClient(dbConn.restWriter);
var dbAdmin = marklogic.createDatabaseClient(dbConn.restAdmin);

var displayImage = function(req, res) {
var uri = '/' + req.params['0'];
var chunkedData = [];
var buf = [];
dbRead.documents.read(uri).stream('chunked')
.on('data', function(chunk) {
chunkedData.push(chunk);
})
.on('error', function(error) {
console.log(error);
})
.on('end', function() {
buf = Buffer.concat(chunkedData);
res.writeHead(200, { 'Content-type': 'image/jpeg' });
res.end(buf);
});
};

router.route('/*').get(displayImage);
app.use('/', router);

app.listen(3000);
console.log('App running');
