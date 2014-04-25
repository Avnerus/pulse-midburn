/**
 * Created by amit on 3/18/14.
 */

'use strict';

function BasicScene(){
    this.init();
};

BasicScene.prototype.init = function () {
//    var THREE = require('three');
    var Character = require('./Character');
    var World = require('./World');
    this.renderer = new THREE.WebGLRenderer();
    this.renderer.setSize(window.innerWidth, window.innerHeight);


    this.clock = new THREE.Clock();

    // Create a scene, a camera, a light and a WebGL renderer with Three.JS
//    this.scene = new THREE.Scene();

    this.scene = new Physijs.Scene;
//    this.scene.setGravity(new THREE.Vector3(0, -100, 0));
    this.scene.setGravity(new THREE.Vector3(0, 0, 0));

    var self = this;
    this.scene.addEventListener(
        'update',
        function() {
            self.scene.simulate(undefined, 2);
        }
    );

    console.log(window.innerWidth + " * " + window.innerHeight);
//    console.log(this.renderer.domElement.attr('width') + " * " + this.renderer.domElement.height);
//    console.log(this.renderer.domElement);
    this.camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);

    this.camera.position.set(0, 100, 700);
//    this.camera.lookAt(this.scene.position);
    this.scene.add(this.camera);

    this.hemisphereLight = new THREE.HemisphereLight( 0xffffff, 0x000000, 0.6 );
    this.hemisphereLight.position.set(0, 256, 0);
    this.scene.add(this.hemisphereLight);

    this.pointLight = new THREE.PointLight();
    this.pointLight.position.set(-256, 256, 0);
    this.scene.add(this.pointLight);


    // Define the container for the renderer
    this.container = $('#basic-scene');


    // Create the user's character
    this.user1 = new Character({
        color: 0x000088,
        basic_scene:this,
        id:0,
        init_mass:1,
        initX:0,
        initY:40,
        initZ:0
    });

    this.user2 = new Character({
        color: 0x7A43B6,
        basic_scene:this,
        id:1,
        init_mass:1,
        initX:200,
        initY:40,
        initZ:0
    });

    this.scene.add(this.user1.mesh);
    this.scene.add(this.user2.mesh);


    // Create the "world" : a 3D representation of the place we'll be putting our character in
    this.world = new World({
        color: 0xF5F5F5
    });
    //this.scene.add(this.world.mesh);


    // Define the size of the renderer
    //this.setAspect();
    // Insert the renderer in the container
    this.container.prepend(this.renderer.domElement);


    // Start the events handlers
    this.setControls();


    //this.user1.applyForce(0, 0, 0, this.user1.mesh.position.x, this.user1.mesh.position.y, this.user1.mesh.position.z);

//    this.user1.applyForce(0, 0, 0, window.innerWidth / 2, window.innerHeight / 2, 1000);

    var gr1 = new THREE.Vector3(0, 0, 0);
    this.user1.mesh.setGravityMesh(gr1);

    var gr2 = new THREE.Vector3(-60, 0, -80);
    this.user2.mesh.setGravityMesh(gr2);

    // telling Physijs to start working
    this.scene.simulate();

//    var cent = this.user1.getCentroid();
}

BasicScene.prototype.setControls = function () {
    var self = this;

    // Within jQuery's methods, we won't be able to access "this"
    var user = this.user1;

    // State of the different controls
    var controls = {
        left: false,
        up: false,
        right: false,
        down: false
    };

    // When the user presses a key
    jQuery(document).keydown(function (e) {
        var prevent = true;
        // Update the state of the attached control to "true"
        switch (e.keyCode) {
            case 37:
                controls.left = true;
                break;
            case 38:
                controls.up = true;
                break;
            case 39:
                controls.right = true;
                break;
            case 40:
                controls.down = true;
                break;
            default:
                prevent = false;
        }
        // Avoid the browser to react unexpectedly
        if (prevent) {
            e.preventDefault();
        } else {
            return;
        }
        // Update the character's direction
        user.setDirection(controls);
    });

    // When the user releases a key
    jQuery(document).keyup(function (e) {
        var prevent = true;
        // Update the state of the attached control to "false"
        switch (e.keyCode) {
            case 37:
                controls.left = false;
                break;
            case 38:
                controls.up = false;
                break;
            case 39:
                controls.right = false;
                break;
            case 40:
                controls.down = false;
                break;
            default:
                prevent = false;
        }
        // Avoid the browser to react unexpectedly
        if (prevent) {
            e.preventDefault();
        } else {
            return;
        }
        // Update the character's direction
        user.setDirection(controls);
    });

    // On resize
    jQuery(window).resize(function () {
        // Redefine the size of the renderer
//        basicScene.setAspect();
        self.setAspect();
    });
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

// Updating the camera to follow and look at a given Object3D / Mesh
BasicScene.prototype.setFocus = function (object) {
   // this.camera.position.set(object.position.x, object.position.y + 128, object.position.z - 256);
    this.camera.lookAt(object.position);
}

// Update and draw the scene
BasicScene.prototype.frame = function () {

    var w = this.container.width();
    var h = jQuery(window).height() - this.container.offset().top - 20;

    this.user1.onTick(this.clock.getDelta());

    this.user2.onTick(this.clock.getDelta());

    // Set the camera to look at our user's character
//    this.setFocus(this.user1.mesh);
//    this.camera.position.set(this.user1.mesh.position.x, this.user1.mesh.position.y + 128, this.user1.mesh.position.z - 256);

//    this.camera.position.set(0 , h / 3, 600);
    // And draw !
    this.renderer.render(this.scene, this.camera);
}



module.exports = BasicScene;