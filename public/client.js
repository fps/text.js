$(document).ready(function(){
    var uuid = $('#uuid').text();
    console.log("orly?" + uuid);

    var socket = io.connect('/' + uuid);
    // socket.emit('hi', {});

    socket.on('text', function(data) {
        console.log('rly');
        $('textarea').val(data.text);
    });

    $('textarea').change(function() {
        socket.emit('text', { 'text': $('textarea').val()} );
    });
});
