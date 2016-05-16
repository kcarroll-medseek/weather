app.controller('weatherController', ['$scope', 'Weather', function ($scope, Weather) {
	
	$scope.ipAddressFound = false;
	$scope.zipPlaceholder = '93436';

	$scope.getWeather = function () {
		$scope.error = '';
		$scope.weatherDays = [];

		var successFunc = function (response) {
			if (response.data)
				$scope.weatherDays = response.data.forecast.simpleforecast.forecastday;
			else
				$scope.error = 'Invalid Zip Code';
		};

		var errorFunc = function (err) {
			$scope.error = err;
		}

		Weather.getWeather($scope.zip, successFunc, errorFunc);
	}

	var successFunc = function (data) {
		if (data) {
			$scope.ipAddress = data.ip;

			var successFunc = function (data) {
				if (data) {
					$scope.ipZipCode = data.zip_code;
					$scope.ipCity = data.city;
					$scope.ipState = data.region_name;
					$scope.zipPlaceholder = data.zip_code;
					$scope.zip = $scope.ipZipCode;
					$scope.getWeather();
					$scope.ipAddressFound = true;
				}
			};
			var errorFunc = function (err) {
				console.log(err);
			}

			Weather.getIpAddressLocation(data.ip, successFunc, errorFunc);
		}
	};
	var errorFunc = function (err) {
		console.log(err);
	}

	Weather.getIpAddress(successFunc, errorFunc);

}]);