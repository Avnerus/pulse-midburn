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
