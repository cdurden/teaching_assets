var app = angular.module('slides', [])
.controller("myctrl", ["$scope", "$location", "$http", "$routeParams", function($scope, $location, $http, $routeParams) {
    console.log("main controller");
}])
.directive('parent', ['$compile', function($compile) {
  return {
    bindToController: {
      parents: '@',
      src: '@',
    },
    replace: false,
    template: '<ng-component ng-repeat="child in parent"><child child="child" src="src[$index]"></child></ng-component>',
    controller: ["$scope", "$location", "$http", function($scope, $location, $http) {
      console.log("slideshow controller");
      $scope.children = [['1','2'],['3','4']];
      $scope.src = [['a','b'],['c','d']];
      console.log($scope.children);
    }],
  };
}])
.directive("child", function() {
  return {
    restrict: 'E',
    template: '<ng-container ng-repeat="grandchild in child"><html-grandchild grandchild="grandchild" src="src[$index]"></html-grandchild></ng-init></ng-container>',
    replace: true,
    require: '^parent',
    scope: {
        child: '=',
        src: '=',
    },
    controller: ["$scope", function($scope) {
        console.log("child directive called");
        console.log($scope.child);
        console.log($scope.src);
    }],
  };
})
.directive("grandchild", function() {
  return {
    restrict: 'E',
    template: '<ng-container id="{{grandchild}}" ng-include="src"></ng-container>',
    replace: true,
    require: '^child',
    scope: {
        grandchild: '=grandchild',
        src: '=src'
    },
    controller: ["$scope", function($scope) {
        console.log("grandchild directive called");
        console.log($scope.grandchild);
        console.log($scope.src);
    }],
  };
})
