var express = require('express');
var bodyParser = require('body-parser');
var location = require('./routes/location');
var person = require('./routes/person');
var ride = require('./routes/ride');

var app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(express.static(__dirname + "/app"));
app.use('/api/location', location);
app.use('/api/person', person);
app.use('/api/ride', ride);
app.use(function(req, res) {
    res.sendFile(__dirname + '/app/index.html');
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.send('message: ' + err.message + 'error: ' + err);
    });
}

// production error handler
// no stacktraces leaked to user
// app.use(function(err, req, res, next) {
//     res.status(err.status || 500);
//     res.render('error', {
//         message: err.message,
//         error: {}
//     });
// });


module.exports = app;
