var marklogic = require('marklogic');

var connection = {
  host: 'localhost',
  port: 8000,
  user: 'admin',
  password: 'admin'
};

var dbClient = marklogic.createDatabaseClient(connection);

var myURI = '/hello.json'

var doc = {
  message: 'hello world'
};

dbClient.documents.write({
  uri: myURI,
  content: doc
})
.result()
.then(function(response) {
  return dbClient.documents.read(response.documents[0].uri).result();
})
.then(function(document) {
  console.log(document[0].content);
})
.catch(function(error) {
  console.log(error);
});
