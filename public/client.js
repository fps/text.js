var socket;

$(document).ready(function() {
    var uuid = $('#uuid').text();
    // console.log("orly?" + uuid);

    socket = io('/' + uuid);
    // socket.emit('hi', {});

    socket.on('connect', function() {
        console.log('connected');
        $('#status').removeClass();
        $('#status').addClass('online');
        $('#status').text('online');
        $('#status').prop('disabled', false);
    });

    socket.on('text', function(data) {
        console.log(data.user_id + ' | ' + $('#userid').text());
        if ($('#userid').text() === data.user_id) {
            console.log('own data. not updating'); 
            return;
        }

        console.log('other data. updating');
        // console.log('rly');
        $('textarea').val(data.text);
    });

    var throttled_change = _.debounce(function(e) {
        // console.log('emit text');
        socket.emit('text', { 'text': $('#text').val(), user_id: $('#userid').text() });
    }, 1000);

    $('#text').bind('input propertychange', function(e) { 
        // console.log('property');
        throttled_change(e); 
    });

    socket.on('disconnect', function() {
        console.log('disconnect');
        $('#status').removeClass();
        $('#status').addClass('offline');
        $('#status').text('offline');
        $('#text').prop('disabled', true);
    });
});
