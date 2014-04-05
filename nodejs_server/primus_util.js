/**
 * Created by amit on 3/27/14.
 */


"use strict"
var Primus = require('primus');
var primusServer = null;

module.exports = function() {
    return new PrimusUtil()
}

module.exports.PrimusUtil = PrimusUtil;


function PrimusUtil() {
    // protect against people who forget 'new'
    if (!(this instanceof PrimusUtil)) return new PrimusUtil()
}

//'browserchannel'
//engine.io
PrimusUtil.prototype.init = function(httpServer) {
    primusServer = new Primus(httpServer, {
        transformer: 'websockets'
//        timeout:false
    });


    primusServer.on('connection', function (spark) {
        console.log('PRIMUS SERVER ON CONNECTION');

        spark.on('data', function (data) {
            console.log('PRIMUS SERVER RECEIVED: ', data);
        });

//        spark.write('Hello world');

    });


    primusServer.on('disconnection', function (spark) {
        // the spark that disconnected
    });


    return primusServer;
}

PrimusUtil.prototype.getServer = function() {
    return primusServer;
}



//setTimeout(function(){
//    console.log('PRIMUS SERVER SENDING...');
//    primusServer.write({
//       message:'hello primus'
//    });
//}, 10000)
