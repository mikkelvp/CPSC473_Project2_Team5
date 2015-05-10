var mongoose = require("mongoose");

var PersonSchema = new mongoose.Schema({
    googleId: {
        type: String,
        required: true
    },
    givenName: {
        type: String,
        required: true
    },
    familyName: {
        type: String,
        required: true
    },
    imgUrl: String
});

var Person = mongoose.model('Person', PersonSchema);

module.exports = {
    Person: Person,
    PersonSchema: PersonSchema
};
