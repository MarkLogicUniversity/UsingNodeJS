// Use the MarkLogic Node.js API to connect to a database and read a document
'use strict';

var marklogic = require("marklogic");

var connInfo =  {
                  host: 'localhost',
                  port: 6000,
                  user: 'admin',
                  password: 'admin'
                };

var dbClient = marklogic.createDatabaseClient(connInfo);

var uri = "/recipes/recipe1.json";

// read the document
dbClient.documents.read(uri).result(
  function(descriptors){
    descriptors.forEach(function(descriptor){
      console.log("Document Descriptor = ");
      console.log(descriptor);
      console.log("----------------------");
      console.log("Document Content = ");
      console.log(JSON.stringify(descriptor.content));
      console.log("----------------------");
      console.log("Recipe Name = ");
      console.log(descriptor.content.recipe.name);
    });
  },
  function(error) {
      console.log(JSON.stringify(error));
    }
);
