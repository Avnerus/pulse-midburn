/**
 * Created by amit on 4/12/14.
 */





(function() {
    var controller = require('../controllers/beat');

    module.exports = function(app) {
        return app.post('/beat/:player_id', controller.fireParticles);
    };
}).call(this);