"use strict";
var marklogic  = require("marklogic");

var dbConn = require("./connections.js")

var dbRead = marklogic.createDatabaseClient(dbConn.restReader);
var dbWrite = marklogic.createDatabaseClient(dbConn.restWriter);
var dbAdmin = marklogic.createDatabaseClient(dbConn.restAdmin);

var pb = marklogic.patchBuilder;

var uri = "/recipes/potatoes.json";

var doc = {
            "uri": uri,
            "content":
              {
              "recipe":
                {
                  "name": "mashed potatoes",
                  "ingredients": ["potatoes", "garlic", "butter", "salt"],
                  "directions":
                    {
                      "preparation": "peel potatoes.",
                      "cooking":
                        {
                          "step1": "Boil potatoes in a large pot",
                          "step2": "Mash potatoes and mix in other ingredients"
                        }
                    }
                  }
                }
          };

dbRead.documents.probe(uri).result()
.then(function(probeResponse) {
  return probeResponse.exists;
})
.then(function(exists) {
  if (!exists) {
    return dbWrite.documents.write(doc).result();
  } else {
    return dbWrite.documents.patch(
      uri,
      pb.replace("/recipe/name", "garlic mashed potatoes")
    ).result();
  }
})
.then(function(response) {
  //console.log(response);
  return dbRead.documents.read(uri).result();
})
.then(function(docs){
  docs.forEach(function(doc){
    console.log(doc.content.recipe.name);
  });
})
.catch(function(error) {
  console.log(error);
});
