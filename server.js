// Include Server Dependencies
var express = require("express");
var bodyParser = require("body-parser");
var logger = require("morgan");
var mongoose = require("mongoose");

// Require Location schema
var Location = require("./models/Location");

// Create a new express app
var app = express();
// Sets an initial port. We'll use this later in our listener
var PORT = process.env.PORT || 8000;

// Run Morgan for Logging
app.use(logger("dev"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.text());
app.use(bodyParser.json({ type: "application/vnd.api+json" }));

app.use(express.static("./public"));

// -------------------------------------------------
// MongoDB configuration
mongoose.connect("mongodb://localhost");
var db = mongoose.connection;

db.on("error", function(err) {
  console.log("Mongoose Error: ", err);
});

db.once("open", function() {
  console.log("Mongoose connection successful.");
});

// -------------------------------------------------

// Main "/" Route. This will redirect the user to our rendered React application
app.get("/", function(req, res) {
  res.sendFile(__dirname + "/public/index.html");
});

// This is the route we will send GET requests to retrieve our search history
// We will call this route the moment our page gets rendered
app.get("/api", function(req, res) {
  // This GET request will retrieve the search history from mongo
  Location.find({})
  .sort({createdAt: -1})
  .limit(5)
  .exec(function(err, searches) {
    if (err) {
      console.log(err);
      res.send("There was an error retrieving search history: ", err);
    }
    else {
      res.send(searches);
    }
  });
});

// This is the route we will send POST requests to save each new location searched.
// We will call this route the moment the "submit" button is pressed.
app.post("/api", function(req, res) {
  var address = req.body.address;

  //create a new location 
  Location.create({
    address: address
  }).exec(function(err) {

    if (err) {
      console.log(err);
      res.send("There was an error retrieving search history: ", err);
    }
    else {
      res.send("new location added!");
    }
  });
});

// -------------------------------------------------

// Starting our express server
app.listen(PORT, function() {
  console.log("App listening on PORT: " + PORT);
});
