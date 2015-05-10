#!/usr/bin/env node

var express = require('express'),
    http = require('http'),
    app = express(),
    bodyParser = require('body-parser'),
    mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    server = http.createServer(app),
    io = require('socket.io')(server);

mongoose.connect('mongodb://localhost/rideshare');

var PersonSchema = Schema({
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

var LocationSchema = Schema({
    loc: {
        type: [Number], // [<longitude>, <latitude>]
        index: '2d' // create the geospatial index
    },
    address: String
});

var RideSchema = Schema({
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

var Person = mongoose.model('Person', PersonSchema);
var Location = mongoose.model('Location', LocationSchema);
var Ride = mongoose.model('Ride', RideSchema);

app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());
app.use(express.static(__dirname + "/app"));
server.listen(3000);
console.log('Listening on port 3000');

// Set up routes
var path = '/api';

// Get all persons
app.get(path + '/person', function(req, res) {
    Person.find({}, function(err, result) {
        if (err) {
            console.log(err);
            res.send('ERROR');
        } else {
            res.json(result);
        }
    });
});

// Get all locations
app.get(path + '/location', function(req, res) {
    Location.find({}, function(err, result) {
        if (err) {
            console.log(err);
            res.send('ERROR');
        } else {
            res.json(result);
        }
    });
});

// Get all rides
app.get(path + '/ride', function(req, res) {
    Ride.find({}, function(err, result) {
        if (err) {
            console.log(err);
            res.send('ERROR');
        } else {
            res.json(result);
        }
    });
});

// Get person by id
app.get(path + '/person/:person_id', function(req, res) {
    Person.findById(req.params.person_id, function(err, person) {
        if (person) {
            res.json(person);
        } else {
            console.log(err);
            res.json({
                err: err
            });
        }
    });
});

// Get person by googleid
app.get(path + '/person/googleid/:google_id', function(req, res) {
    Person.findOne({
        googleId: req.params.google_id
    }, function(err, person) {
        if (person) {
            res.json(person);
        } else {
            console.log(err);
            res.json({
                err: 'not found'
            });
        }
    });
});

// Get location by id
app.get(path + '/location/:location_id', function(req, res) {
    Location.findById(req.params.location_id, function(err, location) {
        if (location) {
            res.json(location);
        } else {
            console.log(err);
            res.json({
                err: err
            });
        }
    });
});

// Get ride by id
app.get(path + '/ride/:ride_id', function(req, res) {
    Ride.findById(req.params.ride_id, function(err, ride) {
        if (ride) {
            res.json(ride);
        } else {
            console.log(err);
            res.json({
                err: err
            });
        }
    });
});

// search for rides within a radius (maxDistance)
// parameters: maxDistance, source (location object), destination (location object)
app.post(path + '/ride/find/', function(req, res) {
    var maxDistance = req.body.maxDistance || 4;
    maxDistance /= 69.047; // convert from miles

    // find locations near source location
    Location.find({
        loc: {
            $near: req.body.source.loc,
            $maxDistance: maxDistance
        }
    }).exec(function(err, locations) {
        if (err) {
            return res.json(500, err);
        }

        var sourceIds = [];
        var destinationIds = [];

        // push all source location _id's to array
        locations.forEach(function(location) {
            sourceIds.push(location._id);
        });

        // find locations near destination location
        Location.find({
            loc: {
                $near: req.body.destination.loc,
                $maxDistance: maxDistance
            }
        }).exec(function(err, locations) {
            if (err) {
                return res.json(500, err);
            }

            // push all destination location _id's to array
            locations.forEach(function(location) {
                destinationIds.push(location._id);
            });

            // find rides that contain the found source and destination _id's
            Ride.find({
                source: {
                    $in: sourceIds
                },
                destination: {
                    $in: destinationIds
                }
            }).populate('source').populate('destination').exec(function(err, docs) {
                if (err) {
                    return res.json(500, err);
                }
                res.json(docs);
            });
        });
    });
});

// Create new person
app.post(path + '/person', function(req, res) {
    var newPerson = new Person({
        googleId: req.body.googleId,
        givenName: req.body.givenName,
        familyName: req.body.familyName
    });
    newPerson.save(function(err, result) {
        if (err) {
            console.log(err);
            res.send('ERROR');
        } else {
            res.json(result);
        }
    });
});

// Create new location
app.post(path + '/location', function(req, res) {
    var newLocation = new Location({
        loc: req.body.loc,
        address: req.body.address
    });
    newLocation.save(function(err, result) {
        if (err) {
            console.log(err);
            res.send('ERROR');
        } else {
            res.json(result);
        }
    });
});

// Create new ride
app.post(path + '/ride', function(req, res) {
    var newRide = new Ride({
        source: req.body.source,
        destination: req.body.destination,
        dateTime: req.body.dateTime,
        estimatedTime: req.body.estimatedTime,
        availableSeats: req.body.availableSeats,
        notes: req.body.notes,
        owner: req.body.owner,
        riders: req.body.riders
    });
    newRide.save(function(err, result) {
        if (err) {
            console.log(err);
            res.send('ERROR');
        } else {
            res.json(result);
        }
    });
});

// Update person // Google Id can not be updated 
app.put(path + '/person/:person_id',
    function(req, res) {
        Person.findById(req.params.person_id, function(err, person) {
            if (err) {
                console.log(err);
            }
            if (typeof(req.body.familyName) !== 'undefined') {
                person.familyName = req.body.familyName;
            }
            if (typeof(req.body.givenName) !==
                'undefined') {
                person.givenName = req.body.givenName;
            }
            if (typeof(req.body.imgUrl) !== 'undefined') {
                person.imgUrl =
                    req.body.imgUrl;
            }
            person.save(function(err, result) {
                if (err) {
                    console.log(err);
                    res.send('ERROR');
                } else {
                    res.json(result);
                }
            });
        });
    });

// Update location
app.put(path + '/location/:location_id', function(req, res) {
    Location.findById(req.params.location_id, function(err, location) {
        if (err) {
            console.log(err);
        }
        if (typeof(req.body.latitude) !== 'undefined') {
            location.latitude = req.body.latitude;
        }
        if (typeof(req.body.longitude) !== 'undefined') {
            location.longitude = req.body.longitude;
        }
        if (typeof(req.body.address) !== 'undefined') {
            location.address = req.body.address;
        }
        location.save(function(err, result) {
            if (err) {
                console.log(err);
                res.send('ERROR');
            } else {
                res.json(result);
            }
        });
    });
});

// Update ride
// Owner can not be updated
app.put(path + '/ride/:ride_id', function(req, res) {
    Ride.findById(req.params.ride_id, function(err, ride) {
        if (err) {
            console.log(err);
        }
        if (typeof(req.body.source) !== 'undefined') {
            ride.source = req.body.source;
        }
        if (typeof(req.body.destination) !== 'undefined') {
            ride.destination = req.body.destination;
        }
        if (typeof(req.body.dateTime) !== 'undefined') {
            ride.dateTime = req.body.dateTime;
        }
        if (typeof(req.body.estimatedTime) !== 'undefined') {
            ride.estimatedTime = req.body.estimatedTime;
        }
        if (typeof(req.body.notes) !== 'undefined') {
            ride.notes = req.body.notes;
        }
        if (typeof(req.body.riders) !== 'undefined') {
            ride.riders = req.body.riders;
        }
        ride.save(function(err, result) {
            if (err) {
                console.log(err);
                res.send('ERROR');
            } else {
                res.json(result);
            }
        });
    });
});

io.on("connection", function(socket) {
    console.log("User has connected");

    socket.on("disconnect", function(){
        console.log("User has disconnected");
    });

    socket.on("new ride", function(ride) {
        console.log("Adding ride: ");
        console.log(ride);
        socket.emit("new ride", ride);
    });
});
