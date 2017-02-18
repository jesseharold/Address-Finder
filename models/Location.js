// Include the Mongoose Dependencies
var mongoose = require("mongoose");

var Schema = mongoose.Schema;

// Create a Schema for capturing addresses
var LocationSchema = new Schema({
  address: {
    type: Number
  }
}, {
  timestamps: true
});

// Create the Model
var Location = mongoose.model("Location", ClickSchema);

// Export it for use elsewhere
module.exports = Location;
