// Bulk load JSON documents from a folder on the file system.
"use strict";

var marklogic = require("marklogic");
var dbConn = require("./connections.js");
var fs = require("fs");

// This example will use the connection information defined in connections.js
var dbWrite = marklogic.createDatabaseClient(dbConn.restWriter);

// modify the directory as needed for location of data on your local environment
var directory   = "c:/mlu-ondemand/usingnodejs/episode4/recipes/";

// how many documents to process in each batch (we've only got 10 docs)
var batchSize   = 10;

// URI prefix
var prefix      = "/recipes/";
var iterator    = 0;

function readFile(files, counter, buffer, isLast) {
  var file = files[counter];
  fs.readFile(directory + file, function (err, content) {
    if (err) {
      throw err;
    }

    //push batched files to buffer
    buffer.push({
      uri        : prefix + file,
      contentType: "application/json",
      content    : content
    });
    //if last in batch write given buffer
    if (isLast) {
      console.log('loading batch from ' + buffer[0].uri + ' to ' + file);
      dbWrite.documents.write(buffer).result().then(function(response) {
        response.documents.map(function(document) {
          iterator++;
          console.log('Inserted ' + document.uri)
        });
        //manage buffer
        writeBatch(files, counter + 1);
      }).catch(function(error) {
        console.log(error);
      });
    }
  });
}

function writeBatch(files, batchFirst) {
  // if all batches have been inserted
  if (batchFirst >= files.length) {
    console.log('Found ' + files.length + ' files, loaded ' + iterator);
    return;
  }

  var batchLast = Math.min(batchFirst + batchSize, files.length) - 1;

  //declare buffer
  var buffer = [];
  for (var i = batchFirst; i <= batchLast; i++) {
    readFile(files, i, buffer, (i === batchLast));
  }
}

//asynchronous fs.readdir() just like before
fs.readdir(directory, function(err, files) {
  if (err) {
    console.log(error);
  }

  //this is not required
  var filteredFiles = files.filter(function(file) {
    //regex to match .json file extensions
    return file.match(/\.json$/);
  });

  //call the function to insert documents starting with a counter 0
  writeBatch(filteredFiles, 0);
});
