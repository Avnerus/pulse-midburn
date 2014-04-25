
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , user = require('./routes/user')
  , http = require('http')
  , path = require('path');

var app = express();

// all environments
app.set('port', process.env.PORT || 3005);
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

app.get('/', routes.index);

app.post('/test', function(req, res){
    console.log('GOT POST REQUEST: req.body = ', req.body);
});

var httpServer = http.createServer(app);

httpServer.listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));

    var primusUtil =  require('./primus_util')();
    var primus = primusUtil.init(httpServer);
    primus.save('../primus.js');
});




// routes
require('./routes/beat')(app);


setTimeout(function(){
    var primusServer = require('./primus_util').getServer();
    function testBeats(interval){

        interval || 1000;

        setTimeout(function(){

            var beat0 = Math.random() * (80 - 60) + 60;

            primusServer.write({
                args:{
                    id:0,
                    beat:beat0
                },
                message:'beat_update'
            });

            var interval = Math.random() * (1100 - 600) + 600;
            testBeats(interval);
        }, interval)
    }
    testBeats();
}, 3000)


setTimeout(function(){
    var primusServer = require('./primus_util').getServer();
    function testBeats(interval){

        interval || 1000;

        setTimeout(function(){
            var beat1 = Math.random() * (80 - 60) + 60;

            primusServer.write({
                args:{
                    id:1,
                    beat:beat1
                },
                message:'beat_update'
            });

            var interval = Math.random() * (1100 - 600) + 600;
            testBeats(interval);
        }, interval)
    }
    testBeats();
}, 3000)


setTimeout(function(){
    var primusServer = require('./primus_util').getServer();
    function testBeats(interval){

        interval || 1000;

        setTimeout(function(){
            var beat2 = Math.random() * (80 - 60) + 60;

            primusServer.write({
                args:{
                    id:2,
                    beat:beat2
                },
                message:'beat_update'
            });

            var interval = Math.random() * (1100 - 600) + 600;
            testBeats(interval);
        }, interval)
    }
    testBeats();
}, 3000)

