angular.module('slides')
.directive('slidesChat', ['Sockets','ChatData', function (Sockets, ChatData) {
  return {
    restrict: 'A',
    require: ['slidesChat'],
    replace: true,
    templateUrl: './templates/chat.html',
    controller: function () {
      this.sendMessage = function (ev) {
        ev.preventDefault(); // prevents page reloading
        Sockets.emit('chat-message', ChatData.getInputMessage());
        console.log(ChatData.getInputMessage());
        ChatData.getInput().val('');
        return false;
      }
    },
    link: function (scope, element, attrs, ctrls) {
      var chatCtrl = ctrls[0];
      ChatData.createChat(element);
      ChatData.getForm().bind("submit",chatCtrl.sendMessage);
      ChatData.getInput().on("keypress",function(e) {
          var key = e.keyCode;
          if (key == 13) {
              $("#chat-form").submit();
              ChatData.getForm().submit();
          }
      });

      Sockets.on('chat-message', function (msg) {
        ChatData.displayMessage(msg);
      })
    }
  }
}]);
