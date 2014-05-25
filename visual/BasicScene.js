/**
 * Created by amit on 3/18/14.
 */

'use strict';
var mathUtil = require('./math_util');


var NUMBER_OF_PLAYERS = 4;

var PLAYERS_DATA = [
    {
        model: 'models/pulsechar1.js',
        position: new THREE.Vector3(-50, 50, -200),
        impulse: new THREE.Vector3(0, 0, -10),
        beatBlastColor:new THREE.Color('red')
    },
    {
        model: 'models/pulsechar2.js',
        position: new THREE.Vector3(-70, -50, -200),
        impulse: new THREE.Vector3(0, 0, -10),
        beatBlastColor:new THREE.Color('green')

    },
    {
        model: 'models/pulsechar3.js',
        position: new THREE.Vector3(100, 50, -200),
        impulse: new THREE.Vector3(0, 0, -10),
        beatBlastColor:new THREE.Color('blue')

    },
    {

        model: 'models/pulsechar4.js',
        position: new THREE.Vector3(70, -50, -200),
        impulse: new THREE.Vector3(0, 0, -10),
        beatBlastColor:new THREE.Color('yellow')
    }
]


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
    this.camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 10000);
    this.camera.position.set(0, 0, 50);

//   	var controls = new THREE.OrbitControls(this.camera );

    this.scene.add(this.camera);

/*    this.hemisphereLight = new THREE.HemisphereLight( 0xffffff, 0x000000, 0.6 );
    this.hemisphereLight.position.set(0, 256, 0);
    this.scene.add(this.hemisphereLight); */

    this.pointLight = new THREE.PointLight();
    this.pointLight.position.set(-256, 256, 0);
    this.scene.add(this.pointLight);


    this.sphere = new THREE.Mesh(new THREE.SphereGeometry(5, 100, 100),  new THREE.MeshLambertMaterial({color: 0xff0000}));
    this.sphere.overdraw = true;
    this.scene.add(this.sphere);


    // Define the container for the renderer
    this.container = $('#basic-scene');
    this.particleTexture = THREE.ImageUtils.loadTexture('/image/smokeparticle.png');
    
    this.characters = [];
    for (var i = 0; i < NUMBER_OF_PLAYERS; i++) {
        var user = new Character({
            model: PLAYERS_DATA[i].model,
            color: 0xFFFFFF,
            basic_scene:this,
            id: i,
            init_mass:0.1,
            position: PLAYERS_DATA[i].position,
            impulse: PLAYERS_DATA[i].impulse,
            beatBlastColor: PLAYERS_DATA[i].beatBlastColor
        });
        this.characters.push(user);
   }

   // this.createCenteroid();

   this.distance = -200;

    // Create the "world" : a 3D representation of the place we'll be putting our character in
    this.world = new World({
        color: 0xF5F5F5
    });
    //this.scene.add(this.world.mesh);


    // Define the size of the renderer
    // Insert the renderer in the container
    this.container.prepend(this.renderer.domElement);

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



// Update and draw the scene
BasicScene.prototype.frame = function () {

    if (this.characters[0].mesh) {
        for (var i = 0; i < this.characters.length; i++) {
            this.characters[i].onTick(this.clock.getDelta);
        }
        var averageDepth = this.getAverageDepth();
        this.camera.position = new THREE.Vector3(0, 0, averageDepth + 200);

        this.starField.starFieldGroup.mesh.position = new THREE.Vector3(0, 0, averageDepth + 100);
        this.sphere.position = new THREE.Vector3(0,0, averageDepth);

    }

    //this.centeroidMesh.position = this.getCharactersCenter();

    this.starField.update(this.clock.getDelta());

    this.renderer.render(this.scene, this.camera);
}

BasicScene.prototype.getAverageDepth = function() {
    // The average depth of all the characters
    var z = 0;
    for(var i = 0; i < this.characters.length; i++){
        if (this.characters[i].mesh) {
            z += this.characters[i].mesh.position.z;
        }
    }
     return z / this.characters.length;
}

BasicScene.prototype.getCharactersCenter = function(){
    var characters = this.characters;

    var z = 0;
    var position = new THREE.Vector3(0, 0, 0);
    for(var i = 0; i < characters.length; i++){
        position.add(characters[i].mesh.position);
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
