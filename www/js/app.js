// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('starter', ['ionic', 'ngCordova'])

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

.controller('weatherCtrl', function ($http, $cordovaGeolocation) {
  var apiKey = 'e5ae907f4371ad20';
  var baseUrl = 'http://api.wunderground.com/api/' + apiKey + '/conditions/forecast10day/q/'
  var weather = this;
  weather.place = "Trying to find you..."
  weather.tem = '--';
  weather.desc = 'loading...';
  weather.icon = "img/SVG/45.svg";
  weather.storedSearches = JSON.parse(localStorage.getItem("searchHistory")) || {};
  console.log("TESTING?", weather.storedSearches);

  function displayWeather(res){
    console.log(res);
    weather.tem = res.data.current_observation.temp_f;
    weather.icon = res.data.current_observation.icon_url;
    weather.desc = res.data.current_observation.weather;
    weather.place = res.data.current_observation.display_location.city;

    var hi = res.data.forecast.simpleforecast.forecastday[0].high.fahrenheit;
    var low = res.data.forecast.simpleforecast.forecastday[0].low.fahrenheit;
    weather.hilow = "Today's High: " + hi + "℉ / Low: " + low;

    console.log("FINDING THE FORECAST", res.data.forecast.simpleforecast.forecastday);
    return res;
  }

  $http.get("http://api.wunderground.com/api/e5ae907f4371ad20/geolookup/q/autoip.json").then(function(firstRes){
    console.log(firstRes);
    weather.place = "Weather in: " + firstRes.data.location.city;
    var initLat = firstRes.data.location.lat;
    var initLong = firstRes.data.location.lon;

  var roughUrl = baseUrl + initLat + ',' + initLong +".json";
    console.log("url", roughUrl);

    $http.get(roughUrl).then(displayWeather)
  })

  function getWeather(){

    navigator.geolocation.getCurrentPosition(function(geopos){
      console.log(geopos);
      var matlat = geopos.coords.latitude;
      var matlong = geopos.coords.longitude;
      //Old with Forecast.io
      // var apiKey = '93979ef636de57ce99f4f3f94a2a48d3'
      // var url = 'api/forecast/' + apiKey + '/' + matlat + ',' + matlong;
      
      var url = baseUrl + matlat + ',' + matlong +".json";
      console.log("url", url);
      $http.get(url).then(displayWeather);
    });

  var posOptions = {timeout: 10000, enableHighAccuracy: false};
  $cordovaGeolocation
    .getCurrentPosition(posOptions)
    .then(function (position) {
      var lat  = position.coords.latitude;
      var lon = position.coords.longitude;
      console.log("Hooray?", lat);
      var url = baseUrl + lat + ',' + lon +".json";
      console.log("url", url);
      $http.get(url).then(displayWeather);
    }, function(err) {
      console.log("Error", err);
    });

  };
  getWeather();

  weather.updateThis = function() {
    console.log("Hold on, updating things...");
    getWeather();
  };

  weather.searchZip = function(typedZip) {
    console.log("typedZip", typedZip);
    var zipUrl = baseUrl + typedZip + ".json";
    $http.get(zipUrl)
      .then(displayWeather)
      .then(function(things){
        var searchKEY = things.data.current_observation.display_location.full;
        var searchVALUE = things.data.current_observation.station_id;

        weather.storedSearches[searchKEY] = searchVALUE;
        localStorage.setItem('searchHistory', JSON.stringify(weather.storedSearches));
      });
  }
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