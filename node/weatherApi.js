var express = require('express'),
	http = require('http'),
	q = require('q'),
	app = express();

app.use(function (req, res, next) {
	res.header('Access-Control-Allow-Origin', '*');
	res.header('Access-Control-Allow-Methods', 'GET');
	res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
	next();
});

app.get('/', function (req, res) {
	res.send('Weather api is running');
});

app.get('/weather/:zip(\\d{5}).json', function (req, res) {
	//console.log('Received request for zip: ' + req.params.zip);
	getLocation(req.params.zip)
		.then(function(locationData){
			//console.log(locationData.city + ' ' + locationData.state);
			getForecast(locationData.city, locationData.state)
				.then(function(forecastData){
					res.send(forecastData);
				}, function(forecastError) {
					console.log(forecastError);
					res.status(500);
					res.send(forecastError);
				});
		}, function(locationError) {
			console.log(locationError);
			res.end();
		});
});

var server = app.listen(8081, function () {

	var host = server.address().address;
	var port = server.address().port;
	console.log('Weather api listening at http://%s:%s', host, port);
	console.log(server.address());
});

function getLocation(zip) {
	var def = q.defer();
	var options = {
		host: 'api.wunderground.com',
		path: '/api/eead2485276469ce/geolookup/q/' + zip + '.json'
	};

	http.get(options, function (response) {
		var body = '';
		response.on('data', function (d) {
			body += d;
		});
		response.on('end', function (d) {
			var locationData = JSON.parse(body);
			if (!locationData || !locationData.location) {
				def.reject('No location data found for ' + zip);
			} else {
				def.resolve(locationData.location);
			}
		});
	});
	return def.promise;
}

function getForecast(city, state) {
	console.log('getForecast: ' + city + ' ' + state);
	var def = q.defer();
	var options = {
		host: 'api.wunderground.com',
		path: '/api/eead2485276469ce/forecast/q/' + state + '/' + city.replace(' ', '_') + '.json'
	};

	http.get(options, function (response) {
		var body = '';
		response.on('data', function (d) {
			body += d;
		});
		response.on('end', function (d) {
			def.resolve(body);
		});
		response.on('error', function (err) {
			def.reject(err);
		});
	});
	return def.promise;
}