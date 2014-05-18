/**
 * Created by amit on 3/19/14.
 */

'use strict';

//var THREE = require('three');
var TWEEN = require('tween.js');
var mathUtil = require('./math_util');


function Character(args){
    this.init(args);
};

Character.prototype.init = function (args) {

    var self = this;

    this.basicScene = args.basic_scene;
    this.id = args.id;
    this.color = args.color;
    this.args = args;
    this.trigger = true;

    console.log('Character init: id = ', this.id);


    var loader = new THREE.JSONLoader(args.loadingManager);
    loader.load(args.model, function(geometry, material) {
        self.loadMesh(geometry, material);
    });

    this.initParticles();
    this.initRiseParticles();


    // events
    this.eventEmitter = require('./events_util').getEventEmitter();

    this.eventEmitter.on('beat_update', function(args){
        //    console.log('character on beat_update, args = ', args);
        if(args.id == self.id){
            self.lastBeat = args.beat;
            self.fireParticles();

            if(args.change > 0){
                self.fireRiseParticles();
            }
        }
    });
}

Character.prototype.initParticles = function(){
    var self = this;

    this.particleTexture = THREE.ImageUtils.loadTexture('/image/spark.png');
    this.particleGroup = new SPE.Group({
        texture: self.particleTexture,
        maxAge: 1
    });

    var particleEmitter = new SPE.Emitter({
        type: 'sphere',
        radius: 1,
        speed: 30,
        sizeStart: 6,
        sizeStartSpread: 6,
        sizeEnd: 0,
        opacityStart: 1,
        opacityEnd: 0,
        colorStart: this.args.beatBlastColor,
        colorStartSpread: new THREE.Vector3(0, 10, 0),
        colorEnd: new THREE.Color('white'),
        particleCount: 500,
        alive: 0,
        duration: 0.05
    });
    this.particleGroup.addPool(10, particleEmitter, false);

//    this.basicScene.scene.add(this.particleGroup.mesh);
}

function getRandomNumber( base ) {
    return Math.random() * base - (base/2);
}

Character.prototype.initRiseParticles = function(){
    var self = this;

    this.riseParticleTexture = THREE.ImageUtils.loadTexture('/image/smokeparticle.png');
    this.riseParticleGroup = new SPE.Group({
        texture: self.riseParticleTexture,
        maxAge: 3
    });

    var particleEmitter = new SPE.Emitter({
        type: 'cube',

        positionSpread: new THREE.Vector3(0, 0, 0),

        acceleration: new THREE.Vector3(0, 120, 0),
//        accelerationSpread: new THREE.Vector3( 0, 0, 0 ),
        accelerationSpread: new THREE.Vector3(
         50,
           50,
         50
        ),

        velocity: new THREE.Vector3(0, 0, 0),
//        velocitySpread: new THREE.Vector3(0, 0, 0),
//        velocitySpread: new THREE.Vector3(
//            getRandomNumber(20),
//            getRandomNumber(20),
//            getRandomNumber(20)
//        ),

        sizeStart: 10,
        sizeStartSpread: 10,
        sizeEnd: 2,

        opacityStart: 1,
        opacityEnd: 0,

        colorStart: this.args.beatBlastColor,
        colorStartSpread: new THREE.Vector3(2 ,2, 2),
        colorEnd: new THREE.Color('white'),

        particleCount: 2000,
        alive: 0,
        duration: 3
    });
    this.riseParticleGroup.addPool(10, particleEmitter, false);
}

Character.prototype.loadMesh = function(geometry, material) {
    var physMaterial = new Physijs.createMaterial(new THREE.MeshFaceMaterial(material), 0.5, 0.5); 
    this.mesh = new Physijs.CapsuleMesh(
        geometry,
        physMaterial,
        this.args.init_mass // mass
    );
    this.mesh.position.set(this.args.position.x, this.args.position.y, this.args.position.z);
//    this.mesh.scale.set( 2, 2,  2);
////
//    this.mesh.visible = false;

    this.basicScene.scene.add(this.mesh);
    this.lastBeat = 60;
    this.onBeatUpdate();

    // Apply initial position impulse
    this.mesh.applyImpulse(this.args.impulse, this.getCentroid());

    this.mesh.add(this.riseParticleGroup.mesh);

    this.mesh.add(this.particleGroup.mesh);
}

Character.prototype.onBeatUpdate = function(){
    if (!this.mesh) {
        return;
    }
    var self = this;

    var G = 10000;

    var others = this.basicScene.getOtherCharacter(this.id);
    var normProjVectors = [];
    for(var i = 0; i < others.length; i++){
        if (others[i].mesh) {
            var v = mathUtil.subVectors(others[i].mesh.position, this.mesh.position);
            v.normalize();

            var m1m2 = 0;
            if(others[i].lastBeat && self.lastBeat){
                m1m2 = (self.lastBeat)/ (others[i].lastBeat )
            }

            var r = others[i].mesh.position.distanceTo(this.mesh.position);
            var scalar = G * (m1m2 / (r * r));
            v.multiplyScalar(scalar);

            normProjVectors.push(v);
        }
    }

    // And one vector to be pulled towards the center
    var centerPosition = new THREE.Vector3(0, 0, this.basicScene.getAverageDepth());
    var distanceToCenter = this.mesh.position.distanceTo(centerPosition);
    var vToCenter = mathUtil.subVectors(centerPosition, this.mesh.position);
    vToCenter.normalize();
    vToCenter.multiplyScalar(distanceToCenter * distanceToCenter * 0.001);
    normProjVectors.push(vToCenter);

    var v = normProjVectors[0];
    for(var i = 1; i < normProjVectors.length; i++){
        v = mathUtil.addVectors(v, normProjVectors[i])
    }

    self.mesh.setGravityMesh(v);
}

Character.prototype.fireRiseParticles = function(){
    var self = this;
    if(!self.mesh || !self.riseParticleGroup){
        return;
    }

    this.riseParticleGroup.triggerPoolEmitter(1, new THREE.Vector3(0, 0, 0));
}

Character.prototype.fireParticles = function(){
    var self = this;
    if(!self.mesh || !self.particleGroup){
        return;
    }

     
    this.particleGroup.triggerPoolEmitter(1, new THREE.Vector3(0, 0, 0));
}


Character.prototype.getCentroid = function(){

    var geometry = this.mesh.geometry;
    var centroid = new THREE.Vector3();

//    console.log('Character.prototype.getCentroid  geometry.vertices = ', geometry.vertices)

    for(var i = 0; i < geometry.vertices.length; i++) {
//        console.log('geometry.vertices[i] = ', geometry.vertices[i])
        centroid.add(geometry.vertices[i]);
    }

    centroid.divideScalar(geometry.vertices.length);

    return centroid;
}

Character.prototype.onTick = function(delta){

//    console.log('Character.prototype.onTick delta = ', delta);
    if (this.mesh) {

        if(this.particleGroup){
            this.particleGroup.tick();
        }

        if(this.riseParticleGroup){
            this.riseParticleGroup.tick();
        }
//        if(!this.updateLocationGroup){
//            this.updateLocationGroup.mesh.position = this.mesh.position;
//        }
        this.onBeatUpdate();
    }
}


module.exports = Character;
