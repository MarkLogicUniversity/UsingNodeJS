"use strict";

var marklogic = require("marklogic");
var dbConn = require("./connections.js");

// Note that when deleting the document you will use dbWrite.
var dbRead = marklogic.createDatabaseClient(dbConn.restReader);
var dbWrite = marklogic.createDatabaseClient(dbConn.restWriter);
var dbAdmin = marklogic.createDatabaseClient(dbConn.restAdmin);

var uri = "/recipes/potatoes.json";

dbWrite.documents.remove(uri).result()
.then(function(response){
  return dbRead.documents.probe(uri).result();
})
.then(function(response){
  console.log(response.exists);
})
.catch(function(error) {
  console.log(error);
});
