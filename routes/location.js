var express = require('express');
var mongoose = require('mongoose');
var router = express.Router();
var Location = require("../models/location").Location;

// Get all locations
router.get('/', function(req, res) {
    Location.find({}, function(err, result) {
        if (err) {
            console.log(err);
            res.send('ERROR');
        } else {
            res.json(result);
        }
    });
});

// Get location by id
router.get('/:location_id', function(req, res) {
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

// Create new location
router.post('/', function(req, res) {
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

// Update location
router.put('/:location_id', function(req, res) {
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

module.exports = router;
