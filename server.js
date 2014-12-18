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
    res.redirect('/text/' + encodeURIComponent(uuid.v1()));
});

app.get('/text/:id', function(req, res) {
    var id = decodeURIComponent(req.params.id);
    
    if (!texts.hasOwnProperty('id')) {
        texts[id] = { text: '', nsp: io.of("/" + id) };
    }
    
    texts[id].nsp.on('connection', function(socket) {
        socket.on('text', function(data) {
            texts[id].text = data.text;
            // console.log('text: ' + data.text);
            texts[id].nsp.emit('text', data);
        });
    })

    res.send(jade.renderFile('templates/client.jade', { 'id': id, 'text': texts[id].text }));
});

io.sockets.on('connection', function(socket) {
    console.log('+');
});

