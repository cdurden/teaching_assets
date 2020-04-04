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
    $showdownProvider.setOption('sanitize', false);
}]);
app.config([ '$locationProvider' , function ($locationProvider) {
    $locationProvider.html5Mode({
        enabled: true,
        requireBase: false
    });
}]);
app.directive('script', function() {
  return {
    restrict: 'E',
    scope: false,
    link: function(scope, elem, attr) {
      if (attr.type === 'text/javascript-lazy') {
        var code = elem.text();
        var f = new Function(code);
        f();
      }
    }
  };
});
app.config(['$provide','$compile', function($provide, $compile) {
    $provide.decorator('markdownToHtmlDirective', function($delegate) {
        var directive = $delegate[0];
        directive.compile = function() {
          return function(scope, element, attrs) {
            directive.link.apply(this, arguments);
            scope.$watch(
              function(scope) {
                return scope.$eval(attrs.compile);
              },
              function(value) {
                element.html(value);
                $compile(element.contents())(scope);
              }
            );
          };
        };
    });
}]);
        /*
app.directive('ngBindHtml', function () {
  return {
    priority: -1,
    compile: function compile(tElement, tAttrs, transclude) {
      return function(scope, element, attrs) {
      }
      return {
        post: function postLink(scope, iElement, iAttrs, controller) {
          var coll = document.getElementsByClassName("collapsible");
          var i;
          
          for (i = 0; i < coll.length; i++) {
            coll[i].addEventListener("click", function() {
              this.classList.toggle("active");
              var content = this.nextElementSibling;
              if (content.style.display === "block") {
                content.style.display = "none";
              } else {
                content.style.display = "block";
              }
            });
          }
        }
      }
    },
  }
});
*/

app.config(['$provide', function($provide) {
    $provide.decorator('markdownToHtmlDirective', function($delegate) {
        var directive = $delegate[0];
        directive.controller = ["$scope", "$location", "$http", function($scope, $location, $http) {
            $scope.$parent.markdown = "";
            hash_parts = $location.hash().split("/");
            md = hash_parts[0] ? hash_parts[0] : hash_parts[1];
            $http({
              //method: 'GET',
              method: 'POST',
              url: "./md/"+md+".md?update"
            }).then(function success(response) {
                console.log(response);
                $scope.$parent.markdown = response.data;
            }, function error(response) {
            });
            /*
            this.$postLink = function() {
              var coll = document.getElementsByClassName("collapsible");
              var i;
              
              for (i = 0; i < coll.length; i++) {
                coll[i].addEventListener("click", function() {
                  this.classList.toggle("active");
                  var content = this.nextElementSibling;
                  if (content.style.display === "block") {
                    content.style.display = "none";
                  } else {
                    content.style.display = "block";
                  }
                });
              }
            }
            */
        }];
        /*
        directive.compile = function() {
          return function(scope, element, attrs) {
            directive.link.apply(this, arguments);
            scope.$watch("trustedHtml", function() {
              var timer = setInterval(function() {
                var coll = document.getElementsByClassName("collapsible");
                var i;
                
                for (i = 0; i < coll.length; i++) {
                  coll[i].addEventListener("click", function() {
                    this.classList.toggle("active");
                    var content = this.nextElementSibling;
                    if (content.style.display === "block") {
                      content.style.display = "none";
                    } else {
                      content.style.display = "block";
                    }
                  });
                }
              }, 1000);
            });
          };
        };
        */
        return $delegate;
    });
}]);
/*
app.controller("MyController", ["$scope", "$location", "$http", function($scope, $location, $http) {
  $scope.markdown = "";
  hash_parts = $location.hash().split("/");
  md = hash_parts[0] ? hash_parts[0] : hash_parts[1];
  $http({
    //method: 'GET',
    method: 'POST',
    url: "./md/"+md+".md?update"
  }).then(function success(response) {
      console.log(response);
      $scope.markdown = response.data;
  }, function error(response) {
  });

}]);
*/
