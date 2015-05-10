var express = require('express');
var mongoose = require('mongoose');
var router = express.Router();
var Person = require("../models/person").Person;

// Get all persons
router.get('/', function(req, res) {
    Person.find({}, function(err, result) {
        if (err) {
            console.log(err);
            res.send('ERROR');
        } else {
            res.json(result);
        }
    });
});

// Get person by id
router.get('/:person_id', function(req, res) {
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
router.get('/googleid/:google_id', function(req, res) {
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

// Create new person
router.post('/', function(req, res) {
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

// Update person // Google Id can not be updated 
router.put('/:person_id',
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

module.exports = router;
