var app = angular.module('myApp', []);
  app.controller('myCtrl', function($scope, $http) {

    $http.get("/top5")
    .then(function(response) {
      $scope.top5 = response.data;
    });

    $http.get("/latestGames")
    .then(function(response) {
      $scope.latestGames = response.data;
    });

    $http.get("/player_lists")
    .then(function(response) {
      $scope.player_lists = response.data;
    });

  });
