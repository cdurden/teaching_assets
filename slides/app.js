function slideLoadFailedHtml(id) {
   return('This slide failed to load. Tap <a href="#" onclick=\'javascript:reloadSlide("'+id+'"); return false;\'>here</a> to try reloading this slide. If the problem persists, please contact your teacher.');
}
function reloadSlide(id) {
  if (id.split('.').length == 1) {
      steps[0] = steps[0]+".html";
  }
    /*
  $http({
    method: 'GET',
    url: "./slides/"+id+"?update"
  }).then(function success(response) {
      console.log(response);
      $("#"+id).html(response.body);
  }, function error(response) {
      console.error(response);
  });
  */
  $.ajax({
    method: 'GET',
    url: "./slides/"+id+"?update",
    dataType: "html",
    success: function(response) {
      console.log(response);
      $("[id*='"+id+"']").html(response);
    },
  });
}
var app = angular.module('slides', [
    'angularLoad',
    'btford.socket-io',
    'services.sockets',
    'slides.services.chatdata',
    'slides.services.reveal',
    'ngRoute',
]);
app.config([ '$locationProvider' , function ($locationProvider) {
    $locationProvider.html5Mode({
        enabled: true,
        requireBase: true
    });
}]);
app.config(['$routeProvider', function ($routeProvider) {
        $routeProvider.when('/#:deck', {
            templateUrl: 'index.html',
            controller: 'MyController'
            });
}]);
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
app.controller("myctrl", ["$scope", "$location", "$http", "$routeParams","Sockets","angularLoad", function($scope, $location, $http, $routeParams, Sockets, angularLoad) {
      Sockets.on('snow_qm_task_data', function (data) {
        console.log(data);
        Promise.all(data.question.scripts.map(function(script) { 
            return angularLoad.loadScript(script).then(function(result) { 
                return result;
            });
        })).then(function(results) {
          // results is an array of names
          $('#snow_qm_'+data['collection']+'_'+data['task']).html(data.html)
          $('#snow_qm_'+data['collection']+'_'+data['task']).find('form').submit(function (e) {
            Sockets.emit('form_submit', data=getFormData( $(this) ));   
            e.preventDefault(); // block the traditional submission of the form.
          });
        });
      });
      Sockets.on('output', function(data) {
          console.log("output received");
          mark(data);
      });
}]);
