angular.module('slides.services.chatdata', [])
.factory('ChatData', function () {
  var chat;
  var form;
  var input;
  var send_button;
  var scrolled = false;
  function createChat (element) {
    msg_container = element.find('div');
    chat = element.find('ul');
    form = element.find('form');
    input = element.find('textarea');
    send_button = element.find('button');
  }
  function isScrolled() {
      return scrolled;
  }
  function updateScrolled(){
    if (getMessageContainer().scrollTop == getMessageContainer().scrollHeight) { scrolled = false; } else { scrolled=true; }
  }  
  function scrollDown() {
    element = getMessageContainer();
    element.scrollTop = element.scrollHeight;
    scrolled = false;
  }
  function getForm() {
    return form;
  }
  function getChat() {
    return chat;
  }
  function getMessageContainer() {
    return msg_container;
  }
  function getInput() {
    return input;
  }
  function getInputMessage() {
    var input = getInput();
    message = input.val();
    return message;
  }
  function getSendButton() {
    return send_button;
  }
    /*
  function setSocketId (id) {
    socketId = id;
  }
  function getSocketId () {
    return socketId;
  }
  */
  function displayMessage(msg) {
      var li = document.createElement("li");
      var t = document.createTextNode(msg);
      li.appendChild(t);
      getChat().append(li);
  }

  return {
    createChat: createChat,
    displayMessage: displayMessage,
      /*
    setSocketId: setSocketId,
    getSocketId: getSocketId,
    */
    isScrolled: isScrolled,
    updateScrolled: updateScrolled,
    scrollDown: scrollDown,
    getMessageContainer: getMessageContainer,
    getChat: getChat,
    getForm: getForm,
    getInput: getInput,
    getInputMessage: getInputMessage,
  }
});
