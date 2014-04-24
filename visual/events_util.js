/**
 * Created by amit on 4/13/14.
 */



(function() {

    var events = require('events');
    var eventEmitter = new events.EventEmitter();

    console.log('Events init...');

    module.exports.getEventEmitter = function(){
        return eventEmitter;
    }

}).call(this);
