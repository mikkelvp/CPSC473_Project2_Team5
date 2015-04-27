#!/usr/bin/env node

var express = require('express'),
http = require('http'),
app = express(),
bodyParser = require('body-parser'),
mongoose = require('mongoose'),
Schema = mongoose.Schema,
db;

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
	notes : String,
	owner : { type: Schema.Types.ObjectId, ref: 'Person', required: true},
	riders : [ {type: Schema.Types.ObjectId, ref: 'Person'} ]
});

var Person = mongoose.model("Person", PersonSchema);
var Location = mongoose.model("Location", LocationSchema);
var Ride = mongoose.model("Ride", RideSchema);
