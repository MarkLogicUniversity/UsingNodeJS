// Use the MarkLogic Node.js API to connect to a database and insert a document
'use strict';

var marklogic = require("marklogic");

var connInfo =  {
                  host: 'localhost',
                  port: 6000,
                  user: 'admin',
                  password: 'admin'
                };

var dbClient = marklogic.createDatabaseClient(connInfo);

var uri = "/recipes/recipe2.json";

var docData = {
              "recipe":
                {
                  "name": "manhattan",
                  "ingredients": ["bourbon", "vermouth", "bitters", "cherry"],
                  "directions":
                    {
                      "preparation": "fill a shaker with ice.",
                      "mixing":
                        {
                          "step1": "add bourbon, vermouth and bitters to shaker.",
                          "step2": "stir liquids in shaker.",
                          "step3": "strain into glass with cherry garnish."
                        }
                    }
                  }
                };

var docDescriptor = [
                      {
                        "uri": uri,
                        "contentType": "application/json",
                        "content": docData,
                        "collections": ["recipes", "cocktails"]
                      }
                    ];

// insert the document
dbClient.documents.write(docDescriptor).result().then(
  function(response){
    console.log("Finished with write of document " + uri);

    dbClient.documents.read(uri).result(
      function(descriptors){
        descriptors.forEach(function(descriptor){
          console.log("Document Content = ");
          console.log(JSON.stringify(descriptor.content));
        });
      },
      function(error) {
          console.log(JSON.stringify(error, null, 2));
        }
      );
  },
  function(error) {
      console.log(JSON.stringify(error));
    }
);
