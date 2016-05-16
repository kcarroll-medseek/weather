app.factory('Weather', ['$http', function ($http) {
	return {
		getIpAddress: function (onSuccess, onFailure) {
			var request = {
				method: 'Get',
				url: 'http://ipv4.myexternalip.com/json'
			};

			$http(request)
				.success(function (data) {
					onSuccess(data);
				})
				.error(function (err) {
					onFailure(err);
				});
		},

		getIpAddressLocation: function (ip, onSuccess, onFailure) {
			var request = {
				method: 'Get',
				url: 'http://freegeoip.net/json/' + ip,
				data: ip
			};

			$http(request)
				.success(function (data) {
					onSuccess(data);
				})
				.error(function (err) {
					onFailure(err);
				});
		},
		
		getWeather: function (zip, onSuccess, onFailure) {
			var request = {
				method: 'Get',
				url: 'http://bhm-ih-dev-20:8081/weather/' + zip + '.json'
			};

			$http(request)
				.then(onSuccess, onFailure);
		}
	}
}]);