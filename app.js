var express = require('express');
var app = express();
var emitter = require('events').EventEmitter
global.eventemitter = new emitter()

var stack = new Array


app.set('views', './views')
app.set('view engine', 'jade')


app.use(function(err, req, res, next) {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

app.use('/', require('./routes/api.js'));

app.get('/', function (req, res) {
    res.render('index')
});

var server = app.listen(3000, function () {

    var host = server.address().address;
    var port = server.address().port;

    console.log('Example app listening at http://%s:%s', host, port);

});

var io = require('socket.io')(server);
io.on('connection', function (socket) {
    socket.emit('messages', { messages: stack });
});

global.eventemitter.on("message", function(message) {
    console.log(message.time + "> [" + message.channel + "] " + message.user + ": " + message.message)

    stack.push(message)
    if(stack.length > 50)
        stack.pop()

    console.log(stack.length)
    io.emit('message', message)
});