/**
 * Created by amit on 3/19/14.
 */

'use strict';

//var THREE = require('three');

function World(args){
    this.init(args);
};

// Class constructor
World.prototype.init = function (args) {
    // Set the different geometries composing the room
//    var ground = new THREE.PlaneGeometry(1024, 2048),
//        height = 128,
//        walls = [
////            new THREE.PlaneGeometry(ground.height, height),
////            new THREE.PlaneGeometry(ground.width, height),
////            new THREE.PlaneGeometry(ground.height, height),
////            new THREE.PlaneGeometry(ground.width, height)
//        ],
//        obstacles = [
//            new THREE.CubeGeometry(64, 64, 64)
//        ],
//    // Set the material, the "skin"
//        material = new THREE.MeshLambertMaterial(args),
//        i;
//
//    // Set the "world" modelisation object
//    this.mesh = new THREE.Object3D();
//
//    // Set and add the ground
//    this.ground = new THREE.Mesh(ground, material);
//    this.ground.rotation.x = -Math.PI / 2;
//
//    this.mesh.add(this.ground);

////////////////////////////////////////////////////////////////////////

    var material = Physijs.createMaterial(
        new THREE.MeshLambertMaterial(args),
        .0, // high friction
        .0 // low restitution
    );

//    material.map.wrapS = material.map.wrapT = THREE.RepeatWrapping;
//    material.map.repeat.set( 3, 3 );

    this.ground = new Physijs.BoxMesh(
        new THREE.BoxGeometry(500, 200, 500),
        material,
        0 // mass
    );

    this.mesh = new THREE.Object3D();

//    this.ground.rotation.x = -Math.PI / 2;

    this.mesh.add(this.ground);



////////////////////////////////////////////////////////////////////////


    // Set and add the walls
//    this.walls = [];
//    for (i = 0; i < walls.length; i += 1) {
//        this.walls[i] = new THREE.Mesh(walls[i], material);
//        this.walls[i].position.y = height / 2;
//        this.mesh.add(this.walls[i]);
//    }


//    this.walls[0].rotation.y = -Math.PI / 2;
//    this.walls[0].position.x = ground.width / 2;

//    this.walls[1].rotation.y = Math.PI;
//    this.walls[1].position.z = ground.height / 2;

//    this.walls[2].rotation.y = Math.PI / 2;
//    this.walls[2].position.x = -ground.width / 2;

//    this.walls[3].position.z = -ground.height / 2;


    // Set and add the obstacles
//    this.obstacles = [];
//    for (i = 0; i < obstacles.length; i += 1) {
//        this.obstacles[i] = new THREE.Mesh(obstacles[i], material);
//        this.mesh.add(this.obstacles[i]);
//    }
//    this.obstacles[0].position.set(0, 32, 128);
}

//World.prototype.getObstacles = function () {
//    return this.obstacles.concat(this.walls);
//}

module.exports = World;
