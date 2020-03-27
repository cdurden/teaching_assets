angular.module('slides')
.directive('wbTask', ['Sockets', function (Sockets) {
  return {
    restrict: 'A',
    require: ['wbTask'],
    replace: true,
    templateUrl: './templates/task.html',
    scope: { task: "=task" },
    controller: function ($scope) {
      Sockets.on('submission_confirmation', function (data) {
        console.log(data);
        TaskData.confirmSubmission(data);
      })
      Sockets.on('task', function (data) {
        console.log(data);
        $scope.task = data;
      });
      Sockets.emit("get_task");
      this.submit = function (ev) {
          ev.preventDefault(); // prevents page reloading
          Sockets.emit("submit");
          return false;
      }
    },
    link: function (scope, element, attrs, ctrls) {
//      var taskCtrl = ctrls[0];
//      $(element).find("form").on("submit", taskCtrl.submit);
    }
  }
}]);
