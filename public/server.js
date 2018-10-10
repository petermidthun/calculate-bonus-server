// Require express - gives us a function
var express = require('express');

// Create an instance of express by calling the function returned above - gives us an object
var app = express();
var port = 5000;

// express static file serving - public is the folder name
app.use(express.static('server/public'));

// Start up our server
app.listen(port, function(){
  console.log('listening on port', port);
});