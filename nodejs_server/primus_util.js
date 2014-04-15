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
    if (!(this instanceof PrimusUtil)) return new PrimusUtil()
}

PrimusUtil.prototype.init = function(httpServer) {
    console.log('PrimusUtil init...');

    primusServer = new Primus(httpServer, {
        transformer: 'websockets'
    });


    primusServer.on('connection', function (spark) {
        console.log('PRIMUS SERVER ON CONNECTION');

        spark.on('data', function (data) {
            console.log('PRIMUS SERVER RECEIVED: ', data);
        });

//        spark.write('Hello world');
    });


    primusServer.on('disconnection', function (spark) {
        console.log('PRIMUS SERVER ON DISCONNECTION ');
        // the spark that disconnected
    });


    return primusServer;
}

module.exports.getServer = function() {
    return primusServer;
}

