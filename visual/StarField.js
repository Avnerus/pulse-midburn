"use strict"

module.exports = function(opts) {
  return new StarField(opts)
}

module.exports.StarField = StarField;


function StarField(opts) {
   // protect against people who forget 'new'
   if (!(this instanceof StarField)) return new StarField(opts)
    // we need to store the passed in variables on 'this'
    // so that they are available to the .prototype methods

    this.scene = opts.scene;
    console.log("Loading Starfield!"); 
    this.initParticles();
}


StarField.prototype.initParticles = function() {
    this.particleGroup = new SPE.Group({
    texture: THREE.ImageUtils.loadTexture('./image/star.png'),
    maxAge: 2,
        blending: THREE.AdditiveBlending
    });

    var emitter = new SPE.Emitter({
        positionSpread: new THREE.Vector3(100, 100, 100),
        acceleration: new THREE.Vector3(0, 0, 10),
        velocity: new THREE.Vector3(0, 0, 10),
        colorStart: new THREE.Color('white'),
        colorEnd: new THREE.Color('white'),
        sizeStart: 2,
        sizeEnd: 2,
        opacityStart: 0,
        opacityMiddle: 1,
        opacityEnd: 0,

        particleCount: 2000
    });

    this.particleGroup.addEmitter( emitter );
    this.scene.add(this.particleGroup.mesh );
}

StarField.prototype.update = function(dt) {
    this.particleGroup.tick();
}
