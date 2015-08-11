var Room = require('./room');

module.exports = (function(){
  /*
    Communication
    Description:
      This module will manage all communications.
    author: Rene Loperena
  */
  function Communication(server){
    var io = require('socket.io')(server);
    this.room = new Room(io);
  }
  
  /*
    .startCommunication
    params: intervalTime
    returns: (nothing)
    description:
      Will start sending information to the display client every 'intervalTime' (in ms)
    author: Rene Loperena
  */
  Communication.prototype.startCommunication = function(intervalTime) {
    var self = this;
    var interval = intervalTime || 50;
    setInterval(function(){
      self.room.sendAllControllersInformation();
    },interval);
  };

  return Communication;
})();