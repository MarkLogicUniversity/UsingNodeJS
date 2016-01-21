"use strict";

var marklogic = require("marklogic");
var dbConn = require("./connections.js");
var pb = marklogic.patchBuilder;

var dbRead = marklogic.createDatabaseClient(dbConn.restReader);
var dbWrite = marklogic.createDatabaseClient(dbConn.restWriter);
var dbAdmin = marklogic.createDatabaseClient(dbConn.restAdmin);

var currentURI = "/recipes/potatoes.json";
var newURI = "/recipes/spicyPotatoes.json";

function resultSummary(docUris){
  docUris.forEach(function(docUri){
    dbRead.documents.probe(docUri).result()
    .then(function(response) {
      if (response.exists) {
        dbRead.documents.read(response.uri).result()
        .then(function(doc){
          console.log(doc[0].content);
        })
      } else {
        console.log(response.uri + " does not exist.");
      };
    });
  });
};

function cloneRecipe(oldUri, newUri) {
  var transactionId = null;
  dbWrite.transactions.open().result().
  then(function(txid) {
    transactionId = txid;
    return dbWrite.documents.read({uris: currentURI, txid: transactionId.txid}).result();
  })
  .then(function(document) {
    document[0].uri = newURI;
    document[0].content.recipe.name = "spicy mashed potatoes";
    document[0].content.recipe.ingredients = ["potatoes", "sriracha", "garlic", "butter", "salt"];
    return dbWrite.documents.write(
      {
        documents: document,
        txid: transactionId.txid
      }).result()
  })
  .then(function(response) {
    return dbWrite.transactions.commit(transactionId.txid).result();
  })
  .then(function(response){
    var uriArray = [];
    uriArray.push(currentURI, newURI);
    return resultSummary(uriArray);
  })
  .catch(function(error) {
    dbWrite.transactions.rollback(transactionId.txid);
    console.log("Error: ", error);
  });
}

cloneRecipe(currentURI, newURI);
