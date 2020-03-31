jQuery.fn.extend({
    mark: function(mark) {
        if (this.attr('type')=='radio') {

        }
        return this.each(function() {
            var mark_container = $(this).next("div.mark_container");
            if (mark_container.length < 1) {
                $(this).after("<div class='mark_container'>");
                mark_container = $(this).next("div.mark_container");
            }
            mark_container.html(mark)
        });
    }
});
function mark(data) {
    //container = $('#snow_qm_'+data.collection+"_"+data.task);
    container = $('#question_'+data.question.id);
    for (let field of data.question.marked_correct) {
      elmt = $(container).find(":input[name='"+field+"']");
      if (elmt.length > 1) {
          elmt = elmt.find(":input[value='"+data.input_data[field]+"']");
      }
      elmt.mark('<i class="fas fa-check" aria-label="Correct!" title="Correct!"></i>');
    }
    for (let field of data.question.submitted) {
      elmt = $(container).find(":input[name='"+field+"']");
      if (elmt.length > 1) {
          elmt = elmt.find(":input[value='"+data.input_data[field]+"']");
      }
      elmt.mark('<i class="fas fa-paper-plane" aria-label="Correct!" title="This answer has been submitted."></i>');
      //$(container).find(":input[name='"+field+"']").mark('<i class="fas fa-paper-plane"></i>');
    }
    for (let field of data.question.marked_incorrect) {
      elmt = $(container).find(":input[name='"+field+"']");
      if (elmt.length > 1) {
          elmt = elmt.find(":input[value='"+data.input_data[field]+"']");
      }
      elmt.mark('<i class="fas fa-times" aria-label="Correct!" title="Incorrect"></i>');
      //$(container).find(":input[name='"+field+"']").mark('<i class="fas fa-times"></i>');
    }
}
angular.module('slides')
.directive('snowQmTask', ['Sockets','angularLoad', function (Sockets,angularLoad) {
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
          // this has been moved to the main controller because it seems that every time it is called it binds another function call
          /*
          Sockets.on('snow_qm_task_data', function (data) {
            console.log(data);
            if(data['collection']==collection && data['task']==task) {
              console.log("got task");
              //update_snow_qm_task_data(data);
              $scope.task_view = $sce.trustAsHtml(data.html);
              //$($element).html(data.html);
            }
          });
          */
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
      // this has been moved to the main controller because it seems that every time it is called it binds another function call
      /*
      Sockets.on('output', function(data) {
          console.log("output received");
          mark(data);
      });
      */
      scope.$watch("task_view", function() {
        $(element).find("form").on("submit", function (e) {
          Sockets.emit('form_submit', data=getFormData( $(this) ));
          e.preventDefault(); // block the traditional submission of the form.
        });
      });
    }
  }
}]);
