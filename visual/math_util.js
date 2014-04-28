/**
 * Created by amit on 4/25/14.
 */


(function() {

    // where u and v are instances of THREE.Vector3
    module.exports.projectVector = function(u, v){
        var u1 = u.clone();
        return u1.projectOnVector(v);
    }

    module.exports.multiplyVectors = function(u, v){
        var result = new THREE.Vector3();
        result.multiplyVectors(u, v);
        return result;
    }

    module.exports.subVectors = function(u, v){
        var result = new THREE.Vector3();
        result.subVectors(u, v);
        return result;
    }

    module.exports.addVectors = function(u, v){
        var result = new THREE.Vector3();
        result.addVectors(u, v);
        return result;
    }


}).call(this);
