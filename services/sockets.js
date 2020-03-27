angular.module('services.sockets', [])
.factory('Sockets', function (socketFactory) {
  var myIoSocket = io.connect({'path': '/socket.io'});

  mySocket = socketFactory({
    ioSocket: myIoSocket
  });

  return mySocket;
});
