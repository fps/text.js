var express = require('express')
,   app = express()
,   server = require('http').createServer(app)
,   io = require('socket.io').listen(server)
,   jade = require('jade')
,   uuid = require('node-uuid')
,   delete_key = require('key-del')
,   conf = require('./config.json')
;

var sessions = { };

server.listen(conf.port);

app.use(express.static(__dirname + '/public'));

app.get('/', function (req, res) {
    res.redirect('/text/' + encodeURIComponent(uuid.v4()));
});

app.get('/text/:id', function(req, res) {
    var id = decodeURIComponent(req.params.id);
    
    if (!sessions.hasOwnProperty(id)) {
        console.log("new id: " + id);
        var session = { text: '', namespace: io.of("/" + id), last_update: new Date(), id: id }
        sessions[id] = session;

        session.namespace.on('connection', function(socket) {
    	    console.log("connection on namespace: " + id + ' at: ' + session.last_update);
            socket.on('text', function(data) {
                console.log('new text for session: ' + id + ' at: ' + session.last_update);
                session.text = data.text;
                session.last_update = new Date();
                session.namespace.emit('text', data);
            });
        })
    
        // sessions[id].namespace.on('disconnect', function(socket) {
        //     console.log("discconnection on namespace: " + id + ' number of connections: ' + --sessions[id].number_of_connections);
        //});
    }
    
    res.send(jade.renderFile('templates/client.jade', { 'id': id, 'text': sessions[id].text, ttl: conf.ttl }));
});


io.sockets.on('disconnect', function(socket) {
    console.log('disconnect: ' + socket.id);
});

io.sockets.on('connect', function(socket) {
    console.log('connect: ' + socket.id);
});

setInterval(function() {
    // console.log('gc');
    for (key in sessions) {
        session = sessions[key];
        var number_of_connections = 0
        for (connection in session.namespace.connected) {
            ++number_of_connections;
        }
        // console.log(session.id + " " + number_of_connections);
        if (number_of_connections > 0) {
            session.last_update = new Date();
        }

        //console.log(sessions[key].namespace.connected);
        var alive = new Date().getTime() - session.last_update.getTime();
        // console.log(sessions[key].id + ' ' + alive);
        if (alive > conf.ttl) {
            console.log('removing ' + session.id);
            //sessions[key].namespace.emit('disconnect');
            // sessions = delete_key(sessions, [key]);
            delete io.nsps['/' + session.id];
            //delete sessions[key].namespace;
            delete sessions[key];
            break;
        }
    }
}, 10);

/*
require("net").createServer (function(socket) {
        repl = require('repl');
        repl.start("my-node-process>", socket);
}).listen(5000, "localhost");
*/
