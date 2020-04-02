var app = angular.module('md', [
    'btford.socket-io',
    'ng-showdown',
    'services.sockets',
]);
app.run(function($rootScope) {
    $('[ng-app]').on('click', 'a', function() {
        window.location.href = $(this).attr('href');
    });
});
app.config(['$provide', function ($provide) {
    $provide.decorator('$browser', ['$delegate', '$window', function ($delegate, $window) {
        // normal anchors
        let ignoredPattern = /^#[a-zA-Z0-9%2F\/\?].*/;
        let originalOnUrlChange = $delegate.onUrlChange;
        $delegate.onUrlChange = function (...args) {
            if (ignoredPattern.test($window.location.hash)) return;
            originalOnUrlChange.apply($delegate, args);
        };
        let originalUrl = $delegate.url;
        $delegate.url = function (...args) {
            if (ignoredPattern.test($window.location.hash)) return $window.location.href;
            return originalUrl.apply($delegate, args);
        };
        return $delegate;
    }]);
}]);
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
    method: 'POST',
    url: "./md/"+md+".md?update"
  }).then(function success(response) {
      console.log(response);
      $scope.markdown = response.data;
  }, function error(response) {
  });


}]);
