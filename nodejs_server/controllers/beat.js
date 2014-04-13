/**
 * Created by amit on 4/12/14.
 */





(function() {

    exports.fireParticles = function(req, res, next) {
        var playerId = req.params.player_id;

        console.log('/beat/:player_id ', ' playerId = ', playerId);

        var primusServer = require('../primus_util').getServer();
        primusServer.write({
           args:{
               id:playerId
           },
           message:'fire_particles'
        });

        res.send(200, {});
    }


}).call(this);
