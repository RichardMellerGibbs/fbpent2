// =============================================================================
// BASE SETUP
// =============================================================================
var express     = require('express');        // call express
var app         = express();                 // define our app using express
var bodyParser  = require('body-parser');
var mongoose    = require('mongoose');
var config      = require('./config');

// configure app to use bodyParser()
// this will let us get the data from a POST
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

var port = config.port;

console.log('env is ' + config.node_env);

//Expose the client statuc files. This includes index.html landing page which gets everything going
app.use(express.static(__dirname + '/client'));

// =============================================================================
// CONNECT TO MONGO
mongoose.connect(config.database);

// =============================================================================
// CONNECTION EVENTS

// When successfully connected
mongoose.connection.once('connected', function() {
	console.log("Connected to database")
});

// If the connection throws an error
mongoose.connection.on('error',function (err) {  
  console.log('Mongoose default connection error: ' + err);
}); 

// When the connection is disconnected
mongoose.connection.on('disconnected', function () {  
  console.log('Mongoose default connection disconnected'); 
});

// If the Node process ends, close the Mongoose connection 
process.on('SIGINT', function() {  
  mongoose.connection.close(function () { 
    console.log('Mongoose default connection disconnected through app termination'); 
    process.exit(0); 
  }); 
}); 
// =============================================================================


//app.set('superSecret', config.secret); // secret variable

//This statement sets up all server routing. 
//REGISTER ROUTES
var router	   = require('./routes/index.js')(app);


// START THE SERVER
// =============================================================================
app.listen(port);
console.log('Listening on port ' + port);
