var Application = require('./lib/application');
//Creates a new Application Object, initializes and starts it.
var app = new Application();
app.initialize();
app.startWithSocketCommunication();