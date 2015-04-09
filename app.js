var express = require('express');
var app = express();
var swig = require('swig');
var emitter = require('events').EventEmitter;
global.eventemitter = new emitter();

var readline = require('readline');

var rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

var channelHistory = {};

swig.setDefaults({ cache: false });

app.engine('html', swig.renderFile);
app.set('views', './views');
app.set('view engine', 'swig');
app.use(express.static('static'));

app.use(function(err, req, res, next) {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

app.use('/', require('./routes/api.js'));

app.get('/', function (req, res) {
    res.render('index.html', {user: {loggedIn: false}});
});

var server = app.listen(3000, function () {

    var host = server.address().address;
    var port = server.address().port;

    console.log('Example app listening at http://%s:%s', host, port);

});

var io = require('socket.io')(server);
io.on('connection', function (socket) {
    if ("tshock" in channelHistory)
        socket.emit('messages', { messages: channelHistory['tshock'] });
});

global.eventemitter.on("message", function(message) {
    console.log(message.time + "> [" + message.channel + "] " + message.user + ": " + message.message);

    if (message.channel.toLowerCase() in channelHistory) {
        var stack = channelHistory[message.channel.toLowerCase()];
        stack.push(message);
        if (stack.length > 50)
            console.log(stack.shift());

        console.log(stack.length);
    }
    else {
        var stack = new Array;
        stack.push(message);
        channelHistory[message.channel.toLowerCase()] = stack;
    }

    if (message.channel.toLowerCase() === "tshock")
        io.emit('message', message);
});

rl.on('line', function(line) {
    if (line === "exit") {
        process.exit(0);
    }
   global.eventemitter.emit("message", {time:new Date(), channel:"TShock", user:"console", message:line});
});