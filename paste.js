var io = require('socket.io-client')
var uuid = require('node-uuid')
var url = require('url')
var http = require('http')

var id = encodeURIComponent(uuid.v4().substring(0,8));
var connection = url.parse('http://fps.io/txt/' + id);

process.argv.forEach(function(val, index, array) {
    var parsed = url.parse(val);
    if( parsed.protocol != null && parsed.host != null && parsed.pathname != null ) {
        connection = parsed;
        var path = parsed.pathname.toString().split('/');
        id = path[path.length - 1];
    }
});

var options = {
    hostname: connection.hostname,
    port: connection.port,
    path: connection.path,
    method: 'GET'
};

var req = http.request(options, function(res) {
    res.on('data', function() {});
    res.on('end', function() {
        //console.log(connection.protocol + '//' + connection.host + '/txt/socket.io/' + id);
        var socket = io.connect(connection.protocol + '//' + connection.host + '/' + id, { path: "/txt/socket.io" });
        socket.on('connect', function() {
            //console.log("socket connected");
            process.stdin.setEncoding('utf8');

            process.stdin.on('readable', function() {
                var stdin = process.stdin.read();
                if (stdin !== null) {
                    socket.emit('text', { 'text': stdin, user_id: 'paste.js', id: id });
                }
            });
        });

        socket.on('text', function(data) {
            console.log(url.format(connection));
            socket.disconnect();
        });
    });
});

req.on('error', function(e) {
    console.log('problem with request: ' + e.message);
});
req.end();
