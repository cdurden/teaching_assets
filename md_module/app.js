var app = angular.module('md', [
    'btford.socket-io',
    'ng-showdown',
    'slides.services.sockets',
]);
app.run(function($rootScope) {
    $('[ng-app]').on('click', 'a', function() {
        window.location.href = $(this).attr('href');
    });
});
app.config([ '$showdownProvider' , function ($showdownProvider) {
    $showdownProvider.setOption('tables', true);
}]);
app.config([ '$locationProvider' , function ($locationProvider) {
    $locationProvider.html5Mode({
        enabled: true,
        requireBase: false
    });
}]);
app.controller("MyController", ["$scope", "$location", "$http", function($scope, $location, $http) {
  $scope.markdown = "";
  hash_parts = $location.hash().split("/");
  md = hash_parts[0] ? hash_parts[0] : hash_parts[1];
  $http({
    method: 'GET',
    url: "./md/"+md+".md"
  }).then(function success(response) {
      console.log(response);
      $scope.markdown = response.data;
  }, function error(response) {
  });


}]);
