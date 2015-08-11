var Display = (function(){

  /*
    Display
    Description:
      This object will manage the connection from each controller to the server.
    author: Rene Loperena
  */
  function Display(){
    this.io = null;
  };

  /*
    .connect
    params: (nothing)
    returns: (nothing)
    description:
      Will connect the object to the server using socket.io
    author: Rene Loperena
  */
  Display.prototype.connect = function(){
    var self = this;
    self.io = io.connect();
    self.io.on('identity',function(){
      self.io.emit('identity', 'display');
    });
  };

  /*
    .setInformationHandler
    params: callback
    returns: (nothing)
    description:
      Sets the 'callback' function that will be called each time the display recieves
      information from the server.
    author: Rene Loperena
  */
  Display.prototype.setInformationHandler = function(callback) {
    this.io.on('displayInformation', function(displayInfo){
      callback(displayInfo);
    });
  };

  return Display;
})();
