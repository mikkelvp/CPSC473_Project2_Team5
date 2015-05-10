var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var Location = require("./location").Location;
var Person = require("./person").Person;

var RideSchema = new Schema({
    source: {
        type: Schema.Types.ObjectId,
        ref: 'Location',
        required: true
    },
    destination: {
        type: Schema.Types.ObjectId,
        ref: 'Location',
        required: true
    },
    dateTime: {
        type: Date,
        required: true
    },
    estimatedTime: String,
    availableSeats: {
        type: Number,
        required: true
    },
    notes: String,
    owner: {
        type: Schema.Types.ObjectId,
        ref: 'Person',
        required: true
    },
    riders: [{
        type: Schema.Types.ObjectId,
        ref: 'Person'
    }]
});

var Ride = mongoose.model('Ride', RideSchema);

module.exports = {
    Ride: Ride
};
