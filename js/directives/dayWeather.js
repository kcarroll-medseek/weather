app.directive('dayWeather', function() { 
  return { 
    restrict: 'E', 
    scope: { 
      info: '=' 
    }, 
    templateUrl: 'js/directives/dayWeather.html' 
  }; 
});