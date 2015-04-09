var express = require('express');
var app = express()
var router = express.Router();

var bodyParser = require('body-parser')

// define the home page route
router.post('/api', bodyParser.json(), function(req, res) {
    channel = req.body['channel'];
    message = req.body['message'];
    user = req.body['user'];
    time = req.body['time'];
    var newMessage = {time:time, message:message, channel:channel, user:user['name']}
    global.eventemitter.emit("message", newMessage)
    res.status(200)
    res.send("ok")
});

router.get('/api', function(req, res) {
    res.status(200)
    res.send("ok")
    res.end()
});

module.exports = router;