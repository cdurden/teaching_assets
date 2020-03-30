angular.module('slides')
.directive('slidesChat', ['Sockets','ChatData', function (Sockets, ChatData) {
  return {
    restrict: 'A',
    require: ['slidesChat'],
    replace: true,
    templateUrl: './templates/chat.html',
    controller: function () {
      this.sendMessage = function () {
        Sockets.emit('chat-message', ChatData.getInputMessage());
        console.log(ChatData.getInputMessage());
        ChatData.getInput().val('');
        return false;
      },
      this.handleSubmit = function(ev) {
        ev.preventDefault(); // prevents page reloading
        this.sendMessage();
      }
    },
    link: function (scope, element, attrs, ctrls) {
      var chatCtrl = ctrls[0];
      ChatData.createChat(element);
      ChatData.getForm().bind("submit",chatCtrl.handleSubmit);
      ChatData.getInput().on("keypress",function(e) {
          var key = e.keyCode;
          if (key == 13) {
              chatCtrl.sendMessage();
              ChatData.getInput().val('');
          }
      });
      var msg_container = ChatData.getChat();
      ChatData.getChat().on('scroll',function() {
          ChatData.updateScrolled();
      });

      Sockets.on('chat-message', function (msg) {
        console.log("got message");
        ChatData.displayMessage(msg);
        if (!ChatData.isScrolled()) {
          ChatData.scrollDown();
        }
      })
    }
  }
}]);
