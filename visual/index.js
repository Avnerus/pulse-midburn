//var THREE = require('three');
//
//
//
//
//    var camera, scene, renderer;
//    var geometry, material, mesh;
//
//
//
//    function init() {
//
//        camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 1, 10000 );
//        camera.position.z = 1000;
//
//        scene = new THREE.Scene();
//
//        geometry = new THREE.BoxGeometry( 200, 200, 200 );
//        material = new THREE.MeshBasicMaterial( { color: 0xff0000, wireframe: true } );
//
//        mesh = new THREE.Mesh( geometry, material );
//        scene.add( mesh );
//
//        renderer = new THREE.CanvasRenderer();
//        renderer.setSize( window.innerWidth, window.innerHeight );
//
//        document.body.appendChild( renderer.domElement );
//
//    }
//
//    function animate() {
//
//        // note: three.js includes requestAnimationFrame shim
//        requestAnimationFrame( animate );
//
//        mesh.rotation.x += 0.01;
//        mesh.rotation.y += 0.02;
//
//        renderer.render( scene, camera );
//
//    }
//
//init();
//animate();

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
