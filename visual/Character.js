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


    this.eventEmitter = require('./events_util').getEventEmitter();


    this.eventEmitter.on('beat_update', function(args){
    //    console.log('character on beat_update, args = ', args);

        if(args.id == self.id){
            self.lastBeat = args.beat;
            self.fireParticles();
        }

    });
    
    // The beat emitter
        
    this.particleTexture = THREE.ImageUtils.loadTexture('/image/bullet.png');
    this.particleGroup = new SPE.Group({
        // Give the particles in this group a texture
        texture: self.particleTexture,
        maxAge: 1 // How long should the particles live for? Measured in seconds.
    });
//    this.particleGroup = this.args.pg;
    var particleEmitter = new SPE.Emitter({

        type: 'sphere',
        radius: 1,
        speed: 30,
        sizeStart: 15,
        sizeStartSpread: 15,
        sizeEnd: 0,
        opacityStart: 1,
        opacityEnd: 0,
        colorStart: this.args.beatBlastColor,
        colorStartSpread: new THREE.Vector3(0, 10, 0),
        colorEnd: new THREE.Color('white'),
        particleCount: 1000,
        alive: 0,
        duration: 0.05
    });
    this.particleGroup.addPool( 10, particleEmitter, false );

    this.basicScene.scene.add(this.particleGroup.mesh);

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

    // Apply initial position impulse
    this.mesh.applyImpulse(this.args.impulse, this.getCentroid());

}

Character.prototype.onBeatUpdate = function(){
    var self = this;

    var G = 10000;

    var others = this.basicScene.getOtherCharacter(this.id);
    var normProjVectors = [];
    for(var i = 0; i < others.length; i++){
//        var v = mathUtil.projectVector(this.mesh.position, others[i].mesh.position);
//        var v = mathUtil.multiplyVectors(this.mesh.position, others[i].mesh.position);

        var v = mathUtil.subVectors(others[i].mesh.position, this.mesh.position);

        v.normalize();

        var m1m2 = 0;
        if(others[i].lastBeat && self.lastBeat){
            m1m2 = (self.lastBeat)/ (others[i].lastBeat )
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
    // And one vector to be pulled towards the center
    var centerPosition = new THREE.Vector3(0, 0, this.basicScene.getAverageDepth());
    var distanceToCenter = this.mesh.position.distanceTo(centerPosition);
    var vToCenter = mathUtil.subVectors(centerPosition, this.mesh.position);
    vToCenter.normalize();
    vToCenter.multiplyScalar(distanceToCenter * distanceToCenter* 0.001);
    normProjVectors.push(vToCenter);


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
//
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

function getRandomNumber( base ) {
    return Math.random() * base - (base/2);
}

Character.prototype.fireParticles = function(){
    var self = this;
    if(!self.mesh || !this.particleGroup){
        return;
    }

    console.log('fireParticles ', self.mesh.position)
    this.particleGroup.triggerPoolEmitter(1, self.mesh.position);


//    setTimeout(function(){
//        self.particleEmitter.alive = 0;
//    }, 1200);

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

        if(this.particleGroup){
            this.particleGroup.tick();
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
