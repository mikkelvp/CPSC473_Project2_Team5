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
	googleId : { type: String, required: true },
	givenName : { type: String, required: true },
	familyName: { type: String, required: true },
	imgUrl : String
});

var LocationSchema = Schema({
	latitude : { type: String, required: true },
	longitude : { type: String, required: true },
	address : String
});

var RideSchema = Schema({
	source : { type: Schema.Types.ObjectId, ref: 'Location', required: true },
	destination : { type: Schema.Types.ObjectId, ref: 'Location', required: true },
	dateTime : { type: Date, required: true },
	estimatedTime : String,
	availableSeats : { type: Number, required: true },
	notes : String,
	owner : { type: Schema.Types.ObjectId, ref: 'Person', required: true},
	riders : [ {type: Schema.Types.ObjectId, ref: 'Person'} ]
});

var Person = mongoose.model('Person', PersonSchema);
var Location = mongoose.model('Location', LocationSchema);
var Ride = mongoose.model('Ride', RideSchema);

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
//app.use(express.static(__dirname + "/client"));
server.listen(3000);
console.log('Listening on port 3000');

// Set up routes
var path = '/api';

// Get all persons
app.get(path + '/person', function (req, res) {
	Person.find({}, function (err, result) {
		if (err) {
			console.log(err);
			res.send('ERROR');
		}
		else {
			res.json(result);
		}
	});
});

// Get all locations
app.get(path + '/location', function (req, res) {
	Location.find({}, function (err, result) {
		if (err) {
			console.log(err);
			res.send('ERROR');
		}
		else {
			res.json(result);
		}
	});
});

// Get all rides
app.get(path + '/ride', function (req, res) {
	Ride.find({}, function (err, result) {
		if (err) {
			console.log(err);
			res.send('ERROR');
		}
		else {
			res.json(result);
		}
	});
});

// Get person by id
app.get(path + '/person/:person_id', function (req, res) {
	Person.findOne({ _id: req.params.person_id }, function (err, person) {
		if (person) {
			res.json(person);
		}
		else {
			console.log(err);
		}
	});
});

// Get location by id
app.get(path + '/location/:location_id', function (req, res) {
	Location.findOne({ _id: req.params.location_id }, function (err, location) {
		if (location) {
			res.json(location);
		}
		else {
			console.log(err);
		}
	});
});

// Get ride by id
app.get(path + '/ride/:ride_id', function (req, res) {
	Ride.findOne({ _id: req.params.ride_id }, function (err, ride) {
		if (ride) {
			res.json(ride);
		}
		else {
			console.log(err);
		}
	});
});

// Create new person
app.post(path + '/person', function (req, res) {
	var newPerson = new Person({googleId: req.body.googleId,
								givenName: req.body.givenName,
								familyName: req.body.familyName });
	newPerson.save(function (err, result) {
		if (err) {
			console.log(err);
			res.send('ERROR');
		}
		else {
			res.json(result);
		}
	});
});

// Create new location
app.post(path + '/location', function (req, res) {
	var newLocation = new Location({latitude: req.body.latitude,
									longitude: req.body.longitude,
									address: req.body.address });
	newLocation.save(function (err, result) {
		if (err) {
			console.log(err);
			res.send('ERROR');
		}
		else {
			res.json(result);
		}
	});
});

// Create new ride
app.post(path + '/ride', function (req, res) {
	var newRide = new Ride({source: req.body.source,
							destination: req.body.destination,
							dateTime: req.body.dateTime,
							estimatedTime: req.body.estimatedTime,
							availableSeats: req.body.availableSeats,
							notes: req.body.notes,
							owner: req.body.owner,
							riders: req.body.riders });
	newRide.save(function (err, result) {
		if (err) {
			console.log(err);
			res.send('ERROR');
		}
		else {
			res.json(result);
		}
	});
});

// Update
app.put(path + '/person/:person_id', function (req, res) {

});

app.put(path + '/location/:location_id', function (req, res) {

});

app.put(path + '/ride/:ride_id', function (req, res) {

});




