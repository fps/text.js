var socket;

$(document).ready(function() {
    var uuid = $('#uuid').text();
    console.log("orly?" + uuid);

    socket = io('/' + uuid);
    // socket.emit('hi', {});

    socket.on('text', function(data) {
        console.log('rly');
        $('textarea').val(data.text);
    });

    var throttled_change = _.debounce(function(e) {
        console.log('emit text');
        socket.emit('text', { 'text': $('#text').val()} );
    }, 1000);

    $('#text').bind('input propertychange', function(e) { 
        console.log('property');
        throttled_change(e); 
    });
});
