angular.module('slides')
.directive('snowQmTask', ['Sockets', function (Sockets) {
  return {
    restrict: 'A',
    require: ['snowQmTask'],
    replace: true,
    transclude: true,
    //templateUrl: 'testing.html',
    templateUrl: './templates/task.html',
    /*templateUrl: function(element, attrs) {
        console.log(attrs);
        return(attrs.id);
    },*/
    //scope: { collection: '=', task: '=', task_view: '@' },
    bindToController: { collection: '@', task: '@', task_view: '@'},
    controller: ["$scope","$element","$sce", function ($scope, $element, $sce) {
      Sockets.on('submission_confirmation', function (data) {
        console.log(data);
       // TaskData.confirmSubmission(data);
      })
      this.$onInit = function() {
        var timer;
        var collection = this.collection;
        var task = this.task;
        $scope.collection = collection;
        $scope.task = task;
        var task = this.task;
        function clearTimer() {
          clearTimeout(timer);
        }
        function inject_questions() {
          console.log("injecting  questions");
          clearTimer();
          Sockets.on('snow_qm_task_data', function (data) {
            console.log(data);
            if(data['collection']==collection && data['task']==task) {
              console.log("got task");
              //update_snow_qm_task_data(data);
              $scope.task_view = $sce.trustAsHtml(data.html);
              //$($element).html(data.html);
            }
          });
          console.log("getting snow-qm task");
          console.log(collection);
          console.log(task);
          Sockets.emit("get_snow_qm_task", {'collection': collection, 'task': task});
        }
        inject_questions();
        //timer = setTimeout(function() { if(Reveal.isReady()) {inject_questions();}}, 1000); // call every 1000 milliseconds
        //timer = setTimeout(function() { inject_questions();}, 1000); // call every 1000 milliseconds
      }
    }],
    link: function (scope, element, attrs, ctrls) {
//      var taskCtrl = ctrls[0];
      scope.$watch("task_view", function() {
        $(element).find("form").on("submit", function (e) {
          Sockets.emit('form_submit', data=getFormData( $(this) ));
          e.preventDefault(); // block the traditional submission of the form.
        });
      });
    }
  }
}]);
