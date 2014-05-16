/**
 * Created by amit on 4/12/14.
 */





(function() {

    exports.updatePlayer = function(req, res, next) {
        var playerId = req.params.player_id;
        var bpm = req.body.bpm;
        var change = req.body.change;

//        console.log('/beat/:player_id ', ' playerId = ', playerId, ' req.body = ', req.body);

        var primusServer = require('../primus_util').getServer();
        primusServer.write({
            args:{
                id:playerId,
                beat:bpm,
                change:change
            },
            message:'beat_update'
        });

        res.send(200, {message:'ok'});
    }


}).call(this);
