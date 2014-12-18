var express = require('express')
,   app = express()
,   server = require('http').createServer(app)
,   io = require('socket.io').listen(server)
,   jade = require('jade')
,   uuid = require('node-uuid')
,   conf = require('./config.json');

var texts = { };

server.listen(conf.port);

app.use(express.static(__dirname + '/public'));

app.get('/', function (req, res) {
    res.redirect('/text/' + encodeURIComponent(uuid.v4()));
});

app.get('/text/:id', function(req, res) {
    var id = decodeURIComponent(req.params.id);
    
    if (!texts.hasOwnProperty(id)) {
        console.log("new id: " + id);
	var text = { text: '', nsp: io.of("/" + id), last_update: new Date() }
        texts[id] = text;

        text.nsp.on('connection', function(socket) {
    	    console.log("connection on namespace: " + id + ' at: ' + text.last_update);
            socket.on('text', function(data) {
                console.log('text for session: ' + id + ' at: ' + text.last_update);
                text.text = data.text;
                text.nsp.emit('text', data);
            });
        })
    
        // texts[id].nsp.on('disconnect', function(socket) {
        //     console.log("discconnection on namespace: " + id + ' number of connections: ' + --texts[id].number_of_connections);
        //});
    }
    
    res.send(jade.renderFile('templates/client.jade', { 'id': id, 'text': texts[id].text }));
});


io.sockets.on('disconnect', function(socket) {
    console.log('disconnect: ' + socket.id);
});

io.sockets.on('connect', function(socket) {
    console.log('connect: ' + socket.id);
});
