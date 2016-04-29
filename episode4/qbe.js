// Perform a Query by example search
// Return the top 5 results.  Note that this returns the entire document.
// Notice the stemming in play when doing a search in "step" on "baking" and "bake" is matched
// Notice that we don't get the mushroom pie document back...why?
//Because it doesn't have a name property.  It has a title property.
//We'll solve that with a more descriptive query later using structured query and a field.

'use strict';
var marklogic = require("marklogic");
var dbConn = require("./connections.js");
var dbRead = marklogic.createDatabaseClient(dbConn.restReader);

var qb = marklogic.queryBuilder;

var qbeDoc =
  {
    "name": {$word: "pie"}, // looking for pies
    "ingredients": "butter", // that contain butter
    "preparation": {$word: "baking"} // that require baking...note stemming
  };

dbRead.documents.query(
    qb.where(
      qb.byExample(qbeDoc)
    ).slice(1, 5)
).result().then(function(results) {
  console.log(JSON.stringify(results, null, 2));
}).catch(function(error) {
  console.log(error);
});
