var mongoose = require("mongoose");

var LocationSchema = new mongoose.Schema({
    loc: {
        type: [Number], // [<longitude>, <latitude>]
        index: '2d' // create the geospatial index
    },
    address: String
});

var Location = mongoose.model('Location', LocationSchema);

module.exports = {
    Location: Location,
    LocationSchema: LocationSchema
};
