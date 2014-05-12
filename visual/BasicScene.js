/**
 * Created by amit on 3/18/14.
 */

'use strict';
var mathUtil = require('./math_util');
require('./controls/OrbitControls');

function BasicScene(){
    this.init();
};

BasicScene.prototype.init = function () {
//    var THREE = require('three');
    var Character = require('./Character');
    var World = require('./World');
    var StarField = require('./StarField');

    this.loaded = false;

    this.renderer = new THREE.WebGLRenderer();
    this.renderer.setSize(window.innerWidth, window.innerHeight);

    this.clock = new THREE.Clock();

    this.scene = new Physijs.Scene;
    this.scene.setGravity(new THREE.Vector3(0, 0, 0));

    var self = this;
    this.scene.addEventListener(
        'update',
        function() {
            self.scene.simulate(undefined, 2);
        }
    );

    console.log(window.innerWidth + " * " + window.innerHeight);
    this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 10000);
    this.camera.position.set(0, 0, 50);

   	var controls = new THREE.OrbitControls(this.camera );
    //controls.target.z = 150;

    this.scene.add(this.camera);

    this.hemisphereLight = new THREE.HemisphereLight( 0xffffff, 0x000000, 0.6 );
    this.hemisphereLight.position.set(0, 256, 0);
    this.scene.add(this.hemisphereLight);

    this.pointLight = new THREE.PointLight();
    this.pointLight.position.set(-256, 256, 0);
    this.scene.add(this.pointLight);


    // Define the container for the renderer
    this.container = $('#basic-scene');

    this.characters = [];
    // Create the user's character
    this.user1 = new Character({
        model: 'models/pulsechar.js',
        color: 0x000088,
        basic_scene:this,
        id:0,
        init_mass:1,
        position: new THREE.Vector3(0, 0, -50),
        impulse: new THREE.Vector3(0, 0, 0)
    });

    this.user2 = new Character({
        model: 'models/pulsechar.js',
        color: 0x7A43B6,
        basic_scene:this,
        id:1,
        init_mass:1,
        position: new THREE.Vector3(-200, 50, -50),
        impulse: new THREE.Vector3(0, 0, 0)
    });

    this.user3 = new Character({
        model: 'models/pulsechar.js',
        color: 0x880000,
        basic_scene:this,
        id:2,
        init_mass:1,
        position: new THREE.Vector3(200, 100, -50),
        impulse: new THREE.Vector3(0, 0, 0)
    });


    this.characters.push(this.user1);
    this.characters.push(this.user2);
    this.characters.push(this.user3);

   // this.createCenteroid();


    // Create the "world" : a 3D representation of the place we'll be putting our character in
    this.world = new World({
        color: 0xF5F5F5
    });
    //this.scene.add(this.world.mesh);


    // Define the size of the renderer
    //this.setAspect();
    // Insert the renderer in the container
    this.container.prepend(this.renderer.domElement);


    //this.user1.applyForce(0, 0, 0, this.user1.mesh.position.x, this.user1.mesh.position.y, this.user1.mesh.position.z);

//    this.user1.applyForce(0, 0, 0, window.innerWidth / 2, window.innerHeight / 2, 1000);

   /* var gr1 = new THREE.Vector3(0, 0, 0);
    this.user1.mesh.setGravityMesh(gr1);

    var gr2 = new THREE.Vector3(0, 0, 0);
    this.user2.mesh.setGravityMesh(gr2);

    var gr3 = new THREE.Vector3(0, 0, 0);
    this.user3.mesh.setGravityMesh(gr3);*/


    // Star field
    this.starField = new StarField({scene: this.scene});

    // telling Physijs to start working
    this.scene.simulate();


}

BasicScene.prototype.loadingProgress = function(item, loaded, total) {
    console.log("Loading progress ", item, loaded, total);
}

BasicScene.prototype.getOtherCharacter = function(excludeId){
    var arr = [];

    for(var i = 0; i < this.characters.length; i++){
        var c = this.characters[i];
        if(c.id != excludeId){
            arr.push(c);
        }
    }

    return arr;
}


// Defining the renderer's size
BasicScene.prototype.setAspect = function () {
    // Fit the container's full width

    var w = this.container.width(),
    // Fit the initial visible area's height
        h = jQuery(window).height() - this.container.offset().top - 20;
//    Update the renderer and the camera

//    var w = 600;
//    var h = 340;
    this.renderer.setSize(w, h);
    this.camera.aspect = w / h;
    this.camera.updateProjectionMatrix();
}

// Update and draw the scene
BasicScene.prototype.frame = function () {
    this.starField.update(this.clock.getDelta());

    this.user1.onTick(this.clock.getDelta());

    this.user2.onTick(this.clock.getDelta());

    this.user3.onTick(this.clock.getDelta());

    //this.centeroidMesh.position = this.getCharactersCenter();

    this.renderer.render(this.scene, this.camera);

//    var w = this.container.width();
//    var h = jQuery(window).height() - this.container.offset().top - 20;

}


BasicScene.prototype.getCharactersCenter = function(){
    var characters = this.characters;

    var z = 0;
    var position = new THREE.Vector3(0, 0, 0);
    for(var i = 0; i < characters.length; i++){
        position.add(characters[i].mesh.position);

        if(z > characters[i].mesh.position.z){
            z = characters[i].mesh.position.z;
        }
    }
    position.divideScalar(characters.length);

    position.z = z + 230;
    return position;
}

BasicScene.prototype.createCenteroid = function(){
    var geometry = new THREE.SphereGeometry(1, 1, 1);

    var material = Physijs.createMaterial(
        new THREE.MeshLambertMaterial({color: 0xffffff}),
        .8, // high friction
        .4 // low restitution
    );

//    this.mesh = new THREE.Mesh(geometry, material);
    this.centeroidMesh = new Physijs.BoxMesh(
        geometry,
        material,
        1
    );

    this.centeroidMesh.position = this.getCharactersCenter();
/*
    this.scene.add(this.centeroidMesh);
    this.centeroidMesh.add(this.camera);*/
}


module.exports = BasicScene;
