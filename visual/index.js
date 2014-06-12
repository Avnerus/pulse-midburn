'use strict';

Physijs.scripts.worker = './lib/physijs/physijs_worker.js';
Physijs.scripts.ammo = './ammojs/ammo.js';



var util = require('./util');
var Tween = require('tween.js');
var BasicScene = require('./BasicScene');

var basicScene = new BasicScene();
console.log('basicScene = ', basicScene);

function renderParticles(){

}

function animate() {
    basicScene.frame();
    requestAnimationFrame(animate);
   // Tween.update();
}

animate();

require('./primus_util');
this.eventEmitter = require('./events_util').getEventEmitter();


this.eventEmitter.on('beat_update', function(args){
    var elementId = "#bpm" + args.id;
    $(elementId).text(args.beat);
});

this.eventEmitter.on('noSignal', function(args){
    var elementId = "#bpm" + args.id;
    $(elementId).text("--");
});


this.refreshTimer = setInterval(function() {
//    window.location.reload(true);

            
},1000 * 60 * 3);
