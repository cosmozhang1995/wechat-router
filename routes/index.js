var express = require('express');
var request = require('request');
var getBody = require('raw-body');

var router = express.Router();

var configs = require('./configs');

/* GET home page. */
router.get('/', function(req, res) {
  res.render('index', { title: 'Express' });
});

for (var name in configs.platforms) {
        var theRoute = "" + name;
        var url = configs.platforms[theRoute];
        router.get('/' + theRoute, (function(url) {
            return function(req, res) {
                var search = "?signature=" + req["signature"]
                        + "&timestamp=" + req["timestamp"]
                        + "&nonce=" + req["nonce"]
                        + req["echostr"] ? ("&echostr=" + req["echostr"]) : "";
                request.get(url + search, function(error, response, body) {
                        res.send(body);
                });
            }
        })(url));
        router.post('/' + theRoute, function(url) {
        	return function(req, res) {
                var search = "?signature=" + req["signature"]
                        + "&timestamp=" + req["timestamp"]
                        + "&nonce=" + req["nonce"]
                        + req["echostr"] ? ("&echostr=" + req["echostr"]) : "";
                getBody(req, {
                        limit: '100kb',
                        length: req.headers['content-length'],
                        encoding: 'utf8'
                }, function(err, buf) {
                        request.post({
                                url: url + search,
                                formData: buf
                        }, function(error, response, body) {
                                if (body) res.send(body);
                        });
                });
	        }
        });
}

module.exports = router;