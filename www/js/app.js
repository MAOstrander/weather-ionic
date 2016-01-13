// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('starter', ['ionic'])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    if(window.cordova && window.cordova.plugins.Keyboard) {
      // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
      // for form inputs)
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);

      // Don't remove this line unless you know what you are doing. It stops the viewport
      // from snapping when text inputs are focused. Ionic handles this internally for
      // a much nicer keyboard experience.
      cordova.plugins.Keyboard.disableScroll(true);
    }
    if(window.StatusBar) {
      StatusBar.styleDefault();
    }
  });
})
//Old with Forecast.io
//Example URL: https://api.forecast.io/forecast/93979ef636de57ce99f4f3f94a2a48d3/37.8267,-122.423
//API Key: 93979ef636de57ce99f4f3f94a2a48d3

//Weather Underground
//e5ae907f4371ad20
//http://api.wunderground.com/api/e5ae907f4371ad20/conditions/q/37.776289,-122.395234.json
.controller('weatherCtrl', function ($http) {
  var weather = this;
  weather.tem = '--';
  weather.desc = 'loading...';
  function getWeather(){
    navigator.geolocation.getCurrentPosition(function(geopos){
      console.log(geopos);
      var matlat = geopos.coords.latitude;
      var matlong = geopos.coords.longitude;
      //Old with Forecast.io
      // var apiKey = '93979ef636de57ce99f4f3f94a2a48d3'
      // var url = 'api/forecast/' + apiKey + '/' + matlat + ',' + matlong;
      // console.log("url", url);
      //Weather Underground
      var apiKey = 'e5ae907f4371ad20'
      var url = 'http://api.wunderground.com/api/' + apiKey + '/conditions/forecast/geolookup/q/' + matlat + ',' + matlong +".json";
      console.log("url", url);

      $http.get(url).then(function(res){
        console.log(res);
        console.log(res.data.current_observation.temp_f);
        console.log(res.data.current_observation.icon_url);
        console.log(res.data.current_observation.weather);

        weather.tem = res.data.current_observation.temp_f;
        weather.icon = res.data.current_observation.icon_url;
        weather.desc = res.data.current_observation.weather;
      })
    });
  };
  getWeather();

  weather.updateThis = function() {
    console.log("Hold on, updating things...");
    getWeather();
  };
});

// .config(function ($stateProvider, $urlRouterProvider) {

//   // setup an abstract state for the tabs directive
//   $stateProvider.state('root', {
//     url: '/hoi',
//     // abstract: true,
//     template: '<h1>HOI, Im TESTING!</h1>'
//   })


//   $urlRouterProvider.otherwise('/');
// })