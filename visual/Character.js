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

    console.log('Character init: id = ', this.id);


    var loader = new THREE.JSONLoader(args.loadingManager);
    loader.load(args.model, function(geometry, material) {
        self.loadMesh(geometry, material);
    });


    this.eventEmitter = require('./events_util').getEventEmitter();


    this.eventEmitter.on('fire_particles', function(args){
        console.log('character on fire_particles, args = ', args);

        if(args.id == self.id){
            console.log('Character id: ', self.id, '  FIRING!!!!');
            self.fireParticles();
        }
    });

    this.eventEmitter.on('beat_update', function(args){
        console.log('character on beat_update, args = ', args);

        if(args.id == self.id){
            self.lastBeat = args.beat;
        }

//        self.onBeatUpdate();
    });
}


Character.prototype.loadMesh = function(geometry, material) {
    this.mesh = new Physijs.BoxMesh(
        geometry,
        new THREE.MeshFaceMaterial(material),
        this.args.init_mass // mass
    );
    this.mesh.position.set(this.args.position.x, this.args.position.y, this.args.position.z);
    this.mesh.scale.set( 2, 2, 2 );

    this.basicScene.scene.add(this.mesh);

    // Apply initial position impulse
    this.mesh.applyImpulse(this.args.impulse, this.getCentroid());

}

Character.prototype.onBeatUpdate = function(){
    var self = this;

    var G = 100000;

    var others = this.basicScene.getOtherCharacter(this.id);
    var normProjVectors = [];
    for(var i = 0; i < others.length; i++){
//        var v = mathUtil.projectVector(this.mesh.position, others[i].mesh.position);
//        var v = mathUtil.multiplyVectors(this.mesh.position, others[i].mesh.position);

        var v = mathUtil.subVectors(others[i].mesh.position, this.mesh.position);

        v.normalize();

        var m1m2 = 1;
        if(others[i].lastBeat && self.lastBeat){
            m1m2 = (self.lastBeat * self.lastBeat * self.lastBeat)/ (others[i].lastBeat * others[i].lastBeat * others[i].lastBeat )
        }
        if(self.id == 2){
//            console.log('m1m2 = ', m1m2);
        }


        var r = others[i].mesh.position.distanceTo(this.mesh.position);
        if(self.id == 2) {
//            console.log('r = ', r);
        }

        var scalar = G * (m1m2 / (r * r));
        if(self.id == 2) {
//            console.log('scalar = ', scalar);
        }

        v.multiplyScalar(scalar);

        normProjVectors.push(v);
    }

    var v = normProjVectors[0];
    for(var i = 1; i < normProjVectors.length; i++){
        v = mathUtil.addVectors(v, normProjVectors[i])
    }

    self.mesh.setGravityMesh(v);
}


Character.prototype.onBeatUpdateTest = function(){
    var self = this;

    var others = this.basicScene.getOtherCharacter(this.id);


//        var v = mathUtil.projectVector(this.mesh.position, others[i].mesh.position);
//        var v = mathUtil.multiplyVectors(this.mesh.position, others[i].mesh.position);

    var otheChar = others[0];
//    console.log('before sub: this.mesh.position = ', this.mesh.position, ' otheChar.mesh.position = ', otheChar.mesh.position);

    var v = mathUtil.subVectors(otheChar.mesh.position, this.mesh.position);
//    console.log('after sub: v = ', v);
    v.normalize();
//    console.log('after normalize: v = ', v);
    v.multiplyScalar(10);

//    console.log('after multiplyScalar: v = ', v);

    var otherChar2 = others[1];
//    console.log('before sub2: this.mesh.position = ', this.mesh.position, ' otherChar2.mesh.position = ', otherChar2.mesh.position);

    var z = mathUtil.subVectors(otherChar2.mesh.position, this.mesh.position);
//    console.log('after sub: z = ', z);
    z.normalize();
//    console.log('after normalize: z = ', z);
    z.multiplyScalar(20);

//    console.log('after multiplyScalar: z = ', z);

    var sumVec = mathUtil.addVectors(v, z);


    self.mesh.setGravityMesh(sumVec);
}



Character.prototype.fireParticles = function(){
    var self = this;

    this.particleGroup = new SPE.Group({
        // Give the particles in this group a texture
        texture: THREE.ImageUtils.loadTexture('/image/spark.png'),
        maxAge: 3 // How long should the particles live for? Measured in seconds.
    });

// Create a single emitter
    this.particleEmitter = new SPE.Emitter({
        duration: 3,// in seconds
        type: 'sphere',
        position: new THREE.Vector3(self.mesh.position.x, self.mesh.position.y, self.mesh.position.z),
//        acceleration: new THREE.Vector3(0, 10, 0), // USE WHEN type=cube
//        velocity: new THREE.Vector3(0, 15, 0),    // USE WHEN type=cube
        radius: 55,  // USE WHEN type=sphere OR type=disk
        speed: 80,  // USE WHEN type=sphere OR type=disk
        particlesPerSecond: 200,
        sizeStart: 30,
        sizeEnd: 0,
        opacityStart: 1,
        opacityEnd: 0,
        colorStartSpread: new THREE.Vector3(20, 100, 98),
        colorMiddleSpread: new THREE.Vector3(67, 23, 33),
        colorEndSpread: new THREE.Vector3(145, 178, 154),
//        colorStart: new THREE.Color('blue'),
//        colorMiddle: new THREE.Color( 'white' ),
//        colorEnd: new THREE.Color('white')
    });

    // Add the emitter to the group.
    this.particleGroup.addEmitter(this.particleEmitter);

    this.basicScene.scene.add(this.particleGroup.mesh);
}

Character.prototype.addHoverAnimation = function(){
    // character tween animation
    var self = this;

//    self.mesh.position.y = 180;

    var characterAnimationOpts = {
        range: 20,
        duration: 1300,
        delay: 20,
        easing: TWEEN.Easing.Linear.None
    };

    var currentCharacterTweenAnim = {y: self.mesh.position.y -characterAnimationOpts.range};

    var updateCharacterTweenAnimation = function(){
        if(self.mesh){
            self.mesh.position.y = currentCharacterTweenAnim.y;
        }
    }

    var characterTweenUp = new TWEEN.Tween(currentCharacterTweenAnim)
        .to({y: self.mesh.position.y +characterAnimationOpts.range}, characterAnimationOpts.duration)
        .delay(characterAnimationOpts.delay)
        .easing(characterAnimationOpts.easing)
        .onUpdate(updateCharacterTweenAnimation);

    // build the tween to go backward
    var characterTweenDown = new TWEEN.Tween(currentCharacterTweenAnim)
        .to({y: self.mesh.position.y -characterAnimationOpts.range}, characterAnimationOpts.duration)
        .delay(characterAnimationOpts.delay)
        .easing(characterAnimationOpts.easing)
        .onUpdate(updateCharacterTweenAnimation);

    // after characterTweenUp do characterTweenDown
    characterTweenUp.chain(characterTweenDown);

    // after characterTweenDown do characterTweenUp, so it is cycling
    characterTweenDown.chain(characterTweenUp);

    characterTweenUp.start();
    // END  character tween animation
}


Character.prototype.collide = function () {
    // INSERT SOME MAGIC HERE
    return false;
}

Character.prototype.onTick = function(delta){

//    console.log('Character.prototype.onTick delta = ', delta);
    if (this.mesh) {
        if(this.particleEmitter){
            this.particleEmitter.position = this.mesh.position;
        }

        if(this.particleGroup){
            this.particleGroup.tick(delta);
        }

        this.onBeatUpdate();
    }
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




module.exports = Character;
