/**
 * Created by amit on 3/19/14.
 */

'use strict';

//var THREE = require('three');
var TWEEN = require('tween.js');


function Character(args){
    this.init(args);
};

Character.prototype.init = function (args) {

    this.basicScene = args.basic_scene;
    this.id = args.id;

    console.log('Character init: id = ', this.id);

    this.eventEmitter = require('./events_util').getEventEmitter();

    // Set the different geometries composing the humanoid
    var head = new THREE.SphereGeometry(32, 8, 8),
        hand = new THREE.SphereGeometry(8, 4, 4),
        foot = new THREE.SphereGeometry(16, 4, 4, 0, Math.PI * 2, 0, Math.PI / 2),
        nose = new THREE.SphereGeometry(4, 4, 4),
    // Set the material, the "skin"
        material = new THREE.MeshLambertMaterial(args);

    // Set the character modelisation object
    this.mesh = new THREE.Object3D();
    this.mesh.position.y = 48;

    // Set the rays : one vector for every potential direction
    this.rays = [
        new THREE.Vector3(0, 0, 1),
        new THREE.Vector3(1, 0, 1),
        new THREE.Vector3(1, 0, 0),
        new THREE.Vector3(1, 0, -1),
        new THREE.Vector3(0, 0, -1),
        new THREE.Vector3(-1, 0, -1),
        new THREE.Vector3(-1, 0, 0),
        new THREE.Vector3(-1, 0, 1)
    ];
    this.caster = new THREE.Raycaster();


    // adding simple-glow
    var geometry = new THREE.SphereGeometry(30, 32, 16);
    var material = new THREE.MeshLambertMaterial({color: 0x000088});
    this.mesh = new THREE.Mesh(geometry, material);
    this.mesh.position.set(0, 40 ,0);


//    // SUPER SIMPLE GLOW EFFECT
//    // use sprite because it appears the same from all angles
//    var spriteMaterial = new THREE.SpriteMaterial(
//        {
//            map: new THREE.ImageUtils.loadTexture('/image/glow.png'),
//            useScreenCoordinates: false,
////            alignment: THREE.SpriteAlignment.center,
//            color: 0x0000ff,
//            transparent: false,
//            blending: THREE.AdditiveBlending
//        });
//    var sprite = new THREE.Sprite( spriteMaterial );
//    sprite.scale.set(200, 200, 1.0);
//    this.mesh.add(sprite); // this centers the glow at the mesh
//    // end - adding simple-glow


    // Particles
    // use sprite because it appears the same from all angles
//    var particleTexture = THREE.ImageUtils.loadTexture( '/image/spark.png' );
//    var particleGroup = new THREE.Object3D();
//    var particleAttributes = { startSize: [], startPosition: [], randomness: [] };
//
//    var totalParticles = 200;
//    var radiusRange = 50;
//
//    for( var i = 0; i < totalParticles; i++ )
//    {
//        var spriteMaterial = new THREE.SpriteMaterial( { map: particleTexture, useScreenCoordinates: false, color: 0xffffff } );
//
//        var sprite = new THREE.Sprite( spriteMaterial );
//        sprite.scale.set( 32, 32, 1.0 ); // imageWidth, imageHeight
//        sprite.position.set( Math.random() - 0.5, Math.random() - 0.5, Math.random() - 0.5 );
//        // for a cube:
//        // sprite.position.multiplyScalar( radiusRange );
//        // for a solid sphere:
//        // sprite.position.setLength( radiusRange * Math.random() );
//        // for a spherical shell:
//        sprite.position.setLength( radiusRange * (Math.random() * 0.1 + 0.9) );
//
//        // sprite.color.setRGB( Math.random(),  Math.random(),  Math.random() );
//        sprite.material.color.setHSL( Math.random(), 0.9, 0.7 );
//
//        // sprite.opacity = 0.80; // translucent particles
//        sprite.material.blending = THREE.AdditiveBlending; // "glowing" particles
//
//        particleGroup.add( sprite );
//        // add variable qualities to arrays, if they need to be accessed later
//        particleAttributes.startPosition.push( sprite.position.clone() );
//        particleAttributes.randomness.push( Math.random() );
//    }
//
//    particleGroup.position.y = 50;
//    this.mesh.add(particleGroup); // this centers the glow at the mesh
    // end - particles

    // Set and add its head
    this.head = new THREE.Mesh(head, material);
    this.head.position.y = 0;
    this.mesh.add(this.head);
    // Set and add its hands
    this.hands = {
        left: new THREE.Mesh(hand, material),
        right: new THREE.Mesh(hand, material)
    };
    this.hands.left.position.x = -40;
    this.hands.left.position.y = -8;
    this.hands.right.position.x = 40;
    this.hands.right.position.y = -8;
    this.mesh.add(this.hands.left);
    this.mesh.add(this.hands.right);
    // Set and add its feet
    this.feet = {
        left: new THREE.Mesh(foot, material),
        right: new THREE.Mesh(foot, material)
    };
    this.feet.left.position.x = -20;
    this.feet.left.position.y = -48;
    this.feet.left.rotation.y = Math.PI / 4;
    this.feet.right.position.x = 20;
    this.feet.right.position.y = -48;
    this.feet.right.rotation.y = Math.PI / 4;
    this.mesh.add(this.feet.left);
    this.mesh.add(this.feet.right);
    // Set and add its nose
    this.nose = new THREE.Mesh(nose, material);
    this.nose.position.y = 0;
    this.nose.position.z = 32;
    this.mesh.add(this.nose);
    // Set the vector of the current motion
    this.direction = new THREE.Vector3(0, 0, 0);
    // Set the current animation step
    this.step = 0;

    this.addHoverAnimation();


    var self = this;
    this.eventEmitter.on('fire_particles', function(args){
        console.log('character on fire_particles, args = ', args);

        if(args.id == self.id){
            console.log('FIRING!!!!');
            self.fireParticles();
        }
    })
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

    console.log('particleGroup ADDED');

//    setTimeout(function(){
//        self.basicScene.scene.remove(self.particleGroup.mesh);
//    }, 3100);
}

Character.prototype.addHoverAnimation = function(){
    // character tween animation
    var self = this;

    self.mesh.position.y = 180;

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


// Update the direction of the current motion
Character.prototype.setDirection = function (controls) {
    // Either left or right, and either up or down (no jump or dive (on the Y axis), so far ...)
    var x = controls.left ? 1 : controls.right ? -1 : 0,
        y = 0,
        z = controls.up ? 1 : controls.down ? -1 : 0;
    this.direction.set(x, y, z);
}

// Process the character motions
Character.prototype.motion = function () {
    // (if any)
//    if (this.direction.x !== 0 || this.direction.z !== 0) {
//        // Rotate the character
//        this.rotate();
//        // And, only if we're not colliding with an obstacle or a wall ...
//        if (this.collide()) {
//            return false;
//        }
//        // ... we move the character
//        this.move();
//        return true;
//    }

    // Update the directions if we intersect with an obstacle
//    this.collision();



    // If we're not static
    if (this.direction.x !== 0 || this.direction.z !== 0) {
        // Rotate the character
        this.rotate();
        // Move the character
        this.move();
        return true;
    }
}


// Rotate the character
Character.prototype.rotate = function () {
    // Set the direction's angle, and the difference between it and our Object3D's current rotation
    var angle = Math.atan2(this.direction.x, this.direction.z),
        difference = angle - this.mesh.rotation.y;

    // If we're doing more than a 180°
    if (Math.abs(difference) > Math.PI) {
        // We proceed to a direct 360° rotation in the opposite way
        if (difference > 0) {
            this.mesh.rotation.y += 2 * Math.PI;
        } else {
            this.mesh.rotation.y -= 2 * Math.PI;
        }
        // And we set a new smarter (because shorter) difference
        difference = angle - this.mesh.rotation.y;
        // In short : we make sure not to turn "left" to go "right"
    }

    // Now if we haven't reached our target angle
    if (difference !== 0) {
        // We slightly get closer to it
        this.mesh.rotation.y += difference / 4;
    }
}

Character.prototype.move = function () {
//    this.mesh.position.y = 130 + Math.sin(this.step) * 8;

    var self = this;
    // We update our Object3D's position from our "direction"
    this.mesh.position.x += this.direction.x * ((this.direction.z === 0) ? 4 : Math.sqrt(8));
    this.mesh.position.z += this.direction.z * ((this.direction.x === 0) ? 4 : Math.sqrt(8));

    // Now let's use Sine and Cosine curves, using our "step" property ...
    this.step += 1 / 4;
    // ... to slightly move our feet and hands
    this.feet.left.position.setZ(Math.sin(this.step) * 16);
    this.feet.right.position.setZ(Math.cos(this.step + (Math.PI / 2)) * 16);
    this.hands.left.position.setZ(Math.cos(this.step + (Math.PI / 2)) * 8);
    this.hands.right.position.setZ(Math.sin(this.step) * 8);

}

Character.prototype.collide = function () {
    // INSERT SOME MAGIC HERE
    return false;
}

Character.prototype.onTick = function(delta){

//    console.log('Character.prototype.onTick delta = ', delta);

    // Run a new step of the user's motions
    this.motion();

    if(this.particleEmitter){
        this.particleEmitter.position = this.mesh.position;
    }

    if(this.particleGroup){
        this.particleGroup.tick(delta);
    }
}


//Character.prototype.collision = function () {
//    var collisions, i,
//    // Maximum distance from the origin before we consider collision
//        distance = 32,
//    // Get the obstacles array from our world
//        obstacles = this.basicScene.world.getObstacles();
//    // For each ray
//    for (i = 0; i < this.rays.length; i += 1) {
//        // We reset the raycaster to this direction
//        this.caster.set(this.mesh.position, this.rays[i]);
//        // Test if we intersect with any obstacle mesh
//        collisions = this.caster.intersectObjects(obstacles);
//        // And disable that direction if we do
//        if (collisions.length > 0 && collisions[0].distance <= distance) {
//            // Yep, this.rays[i] gives us : 0 => up, 1 => up-left, 2 => left, ...
//            if ((i === 0 || i === 1 || i === 7) && this.direction.z === 1) {
//                this.direction.setZ(0);
//            } else if ((i === 3 || i === 4 || i === 5) && this.direction.z === -1) {
//                this.direction.setZ(0);
//            }
//            if ((i === 1 || i === 2 || i === 3) && this.direction.x === 1) {
//                this.direction.setX(0);
//            } else if ((i === 5 || i === 6 || i === 7) && this.direction.x === -1) {
//                this.direction.setX(0);
//            }
//        }
//    }
//}


module.exports = Character;