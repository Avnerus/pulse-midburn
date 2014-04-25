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
        var u1 = u.clone();
        return u1.multiply(v);
    }

    module.exports.subVectors = function(u, v){
        var u1 = u.clone();
        return u1.sub(v);
    }

    module.exports.addVectors = function(u, v){
        var u1 = u.clone();
        return u1.add(v);
    }


}).call(this);
