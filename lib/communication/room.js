var Controller = require('./controller');
var Display = require('./display');
var _ = require('underscore');

module.exports = (function() {
  /*
    Room
    Description:
      This object will manage all the display and controller endpoints and manage their 
      communications.
    author: David Rosson / Rene Loperena
  */
  function Room(io) {
    this.io = io;
    this.display = null;
    this.controllers = [];
    this.negotiateConnection();
  }

  /*
    .negotiateConnection
    params: (nothing)
    returns: (nothing)
    description:
      This will negotiate the initial connection with the different connections received, 
      ask if it is a display endpoint or a controller, and act accordingly.
    author: David Rosson / Rene Loperena
    modified: Rene Loperena
  */
  Room.prototype.negotiateConnection = function() {
    var self = this;
    /*
      On a connection event it will ask the new socket for an identity, if it is a controller
      will call '.addControllerToList', else it will set it as the display with '.setDisplay'.
    */
    self.io.on('connection', function(socket) {
      console.log('Received a socket connection');
      socket.on('identity', function(identity) {
        if (identity === 'client') {
          self.addControllerToList(socket);
        } else if (identity === 'display') {
          self.setDisplay(socket);
        }
      });
      socket.emit('identity', 'What are you?');
    });
  };

  /*
    .addControllerToList
    params: socket
    returns: (nothing)
    description:
      Creates a new Controller given a socket, assigns it the 'disconnect' handler calling the
      'controllerDisconnectHandler' function and pushes it into the controllers array.
    author: Rene Loperena 
    modified: Alex Leonetti
  */
  Room.prototype.addControllerToList = function(socket){
    var controller = new Controller(socket, this.generateGUID());
    this.controllerDisconnectHandler(controller);
    this.controllers.push(controller);
    this.notifyDisplayControllerConnection(controller.uniqueId);
  };

  /*
    .controllerDisconnectHandler
    params: controller
    returns: (nothing)
    description:
      Creates a disconnect handler for the 'disconnect' event in order to remove the controller
      from the list once it disconnects.
    author: Rene Loperena
    modified: Brian Chu
  */
  Room.prototype.controllerDisconnectHandler = function(controller){
    var self = this;
    var id = controller.uniqueId;
    controller.socket.on('disconnect', function() {
      console.log('disconnecting --->', id);
      self.notifyDisplayControllerDisconnection(id);
      var index = self.controllers.indexOf(controller);
      if (index > -1) {
        self.controllers.splice(index, 1);
      }
   });
  };

  /*
    .setDisplay
    params: socket
    returns: (nothing)
    description:
      Creates a new Display given an object, sets the 'disconnect' handler calling the
      'displayDisconnectHandler' function and sets this as the display for the room.
    author: Rene Loperena
  */
  Room.prototype.setDisplay = function(socket){
    var display = new Display(socket);
    this.displayDisconnectHandler(display);
    this.display = display;
  };

  /*
    .displayDisconnectHandler
    params: display
    returns: (nothing)
    description:
      Creates a disconnect handler for the 'disconnect' event, sets the room's display to
      null.
    author: Rene Loperena
  */
  Room.prototype.displayDisconnectHandler = function(display) {
    var self = this;
    display.socket.on('disconnect', function() {
      console.log('Display got disconnect!');
      self.display = null;
   });
  };

  /*
    .generateGUID
    params: (nothing)
    returns: uniqueId (string)
    description:
      This function will generate a unique Id for the client;
    author: David Rosson / Rene Loperena
  */
  Room.prototype.generateGUID = function() {
    return Math.floor((1 + Math.random()) * 0x100000000).toString(16).substring(1);
  };

  /*
    .sendAllControllersInformation
    params: (nothing)
    returns: (nothing)
    description:
      This function will gather all the controllers information, map them using underscore and
      sending everything to the display.
    author: Rene Loperena
  */
  Room.prototype.sendAllControllersInformation = function() {
    var self = this;
    if(self.display !== null){
      self.display.sendDisplayInformation(_.map(self.controllers, function(controller){
        return controller.getControllerInformation();
      }));
    }
  };

  /*
    .notifyDisplayControllerDisconnection
    params: clientId
    returns: (nothing)
    description:
      This function emits a "playerDisconnect" event to the display that tells it that this ID has disconnected.
    author: Brian Chu
  */
  Room.prototype.notifyDisplayControllerDisconnection = function(clientId){
    if(this.display !== null) {
      this.display.socket.emit('playerDisconnect', clientId);
    }
  };



  /*
    .notifyDisplayControllerConnection
    params: n/a
    returns: n/a
    description:
      This function emits a "playerConnect" event to the display
    author: Alex Leonetti
  */
  Room.prototype.notifyDisplayControllerConnection = function(clientId) {
    if(this.display !== null) {
      this.display.socket.emit('playerConnect', clientId);
    }
  }


  return Room;
})();