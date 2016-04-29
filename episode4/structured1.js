// Use Structured Query to find matches which satisfy the given set of criterion
// Return the top 5 results.  Note that this returns the entire document
// talk about this example as a more expressive version of our QBE example.
// talk about controlling which documents we'll search using either directories or collections
// talk about a field and create one to unite title and name properties.
// talk about word queries versus value queries
// then do the search, noting that you now can get both apple pie and mushroom pie back in results.

'use strict';
var marklogic = require("marklogic");
var dbConn = require("./connections.js");
var dbRead = marklogic.createDatabaseClient(dbConn.restReader);

var qb = marklogic.queryBuilder;

dbRead.documents.query(
    qb.where(
      qb.and(
        qb.directory("/recipes/"),
        qb.or(
          qb.word("title", "pie"),
          qb.word("name", "pie")
        ),
        qb.value("ingredients", "butter"),
        qb.word("preparation", "baking")
    )).slice(1, 5)
).result().then(function(results) {
  console.log(JSON.stringify(results, null, 2));
}).catch(function(error) {
  console.log(error);
});
