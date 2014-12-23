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
    res.redirect('../' + encodeURIComponent(uuid.v4().substring(0,8)));
});

app.get('/:id', function(req, res) {
    var id = decodeURIComponent(req.params.id);
    
    if (!sessions.hasOwnProperty(id)) {
        console.log("new session: " + id);

        var session = { 
            text: '', 
            namespace: io.of("/" + id), 
            last_update: new Date(), 
            id: id 
        };

        sessions[id] = session;

        session.namespace.on('connection', function(socket) {
    	    console.log("connection for session: " + id + ' at: ' + session.last_update);
            socket.on('text', function(data) {
                console.log('new text for session: ' + id + ' at: ' + session.last_update + ' user_id: ' + data.user_id);
                session.text = data.text;
                session.last_update = new Date();
                session.namespace.emit('text', data);
            });
        })
    }
    
    res.send(jade.renderFile('templates/client.jade', { 'id': id, 'text': sessions[id].text, ttl: conf.ttl, user_id: uuid.v4() }));
});


io.sockets.on('disconnect', function(socket) {
    console.log('disconnect: ' + socket.id + ' at: ' + new Date());
});

io.sockets.on('connect', function(socket) {
    console.log('connect: ' + socket.id + ' at: ' + new Date());
});

setInterval(function() {
    // console.log('gc');
    for (key in sessions) {
        session = sessions[key];
        var number_of_connections = 0
        for (connection in session.namespace.connected) {
            ++number_of_connections;
            break; // no need to continue for the check following..
        }

        if (number_of_connections > 0) {
            session.last_update = new Date();
        }

        var alive = new Date().getTime() - session.last_update.getTime();
        if (alive > conf.ttl) {
            console.log('removing ' + session.id);
            delete io.nsps['/' + session.id];
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
