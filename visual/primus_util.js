/**
 * Created by amit on 3/27/14.
 */



(function() {

    var primus = Primus.connect('http://localhost:3005', {
        reconnect: {
            strategy: [ 'online', 'timeout', 'diScoNNect' ],
            maxDelay: 99999999, // Number: The max delay for a reconnect retry.
            minDelay: 500, // Number: The minimum delay before we reconnect.
            retries: 10 // Number: How many times should we attempt to reconnect.
        }
    });

    primus.on('data', function message(data) {
        console.log('PRIMUS Received: ', data);
    });


    function write(data){
        primus.write(data);
    }

}).call(this);