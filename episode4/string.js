// Perform a search where the search grammar is parsed from an input string.
// Return the top 5 results.
// on first run, notice that you get the apple pie and fruit salad document back.
// on second run, modify string query by adding -baking (note results no longer include apple pie)

'use strict';
var marklogic = require("marklogic");
var dbConn = require("./connections.js");
var dbRead = marklogic.createDatabaseClient(dbConn.restReader);

var qb = marklogic.queryBuilder;

var qText = "apple OR banana";

dbRead.documents.query(
    qb.where(
      qb.parsedFrom(qText)
    ).slice(1, 5)
).result().then(function(results) {
  console.log(JSON.stringify(results, null, 2));
}).catch(function(error) {
  console.log(error);
});
