var express = require('express');
var mongoose = require('mongoose');
var router = express.Router();
var Ride = require("../models/ride").Ride;
var Location = require("../models/location").Location;

// Get all rides
router.get('/', function(req, res) {
    Ride.find({}, function(err, result) {
        if (err) {
            console.log(err);
            res.send('ERROR');
        } else {
            res.json(result);
        }
    });
});

// Get ride by id
router.get('/:ride_id', function(req, res) {
    Ride.findById(req.params.ride_id, function(err, ride) {
        if (err) {
            console.log(err);
            res.json({
                err: err
            });
        }
        res.json(ride);
    });
});

// Get all rides with person as owner
router.get('/find/:person_id', function(req, res) {
    Ride.find({
        owner: req.params.person_id
    }).populate('source').populate('destination').exec(function(err, docs) {
        if (err) {
            return res.json(500, err);
        }
        res.json(docs);
    });
});

// search for rides within a radius (maxDistance)
// parameters: maxDistance, source (location object), destination (location object)
router.post('/find/', function(req, res) {
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

// Create new ride
router.post('/', function(req, res) {
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

// Add person to riders
router.put('/add', function(req, res) {
    Ride.findById(req.body.rideId, function(err, ride) {
        if (err) {
            res.json({
                err: err
            });
        }
        ride.riders.push(req.body.personId);
        ride.save(function(err, ride) {
            if (err) {
                console.log(err);
                res.json({
                    err: err
                });
            } else {
                Ride.findOne(ride).populate('source').populate('destination').populate('riders').exec(function(err, ride) {
                    res.json(ride);
                });
            }
        });
    });
});

// Update ride
// Owner can not be updated
router.put('/:ride_id', function(req, res) {
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

module.exports = router;
