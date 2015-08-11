var Client = require('./client');
var Display = require('./display');
var _ = require('underscore');

module.exports = (function() {
  /*
    Room
    Description:
      This object will manage all the display and client endpoints and manage their 
      communications.
    author: David Rosson / Rene Loperena
  */
  function Room(io) {
    this.io = io;
    this.display = null;
    this.clients = [];
    this.negotiateConnection();
  }

  /*
    .negotiateConnection
    params: (nothing)
    returns: (nothing)
    description:
      This will negotiate the initial connection with the different connections received, 
      ask if it is a display endpoint or a client, and act accordingly.
    author: David Rosson / Rene Loperena
    modified: Rene Loperena
  */
  Room.prototype.negotiateConnection = function() {
    var self = this;
    /*
      On a connection event it will ask the new socket for an identity, if it is a client
      will call '.addToClientList', else it will set it as the display with '.setDisplay'.
    */
    self.io.on('connection', function(socket) {
      console.log('Received a socket connection');
      socket.on('identity', function(identity) {
        if (identity === 'client') {
          self.addClientToList(socket);
        } else if (identity === 'display') {
          self.setDisplay(socket);
        }
      });
      socket.emit('identity', 'What are you?');
    });
  };

  /*
    .addClientToList
    params: socket
    returns: (nothing)
    description:
      Creates a new Client given a socket, assigns it the 'disconnect' handler calling the
      'clientDisconnectHandler' function and pushes it into the clients array.
    author: Rene Loperena 
    modified: Alex Leonetti
  */
  Room.prototype.addClientToList = function(socket){
    var client = new Client(socket, this.generateGUID());
    this.clientDisconnectHandler(client);
    this.clients.push(client);
    this.notifyDisplayClientConnection(client.uniqueId);
  };

  /*
    .clientDisconnectHandler
    params: client
    returns: (nothing)
    description:
      Creates a disconnect handler for the 'disconnect' event in order to remove the client
      from the list once it disconnects.
    author: Rene Loperena
    modified: Brian Chu
  */
  Room.prototype.clientDisconnectHandler = function(client){
    var self = this;
    var id = client.uniqueId;
    client.socket.on('disconnect', function() {
      console.log('disconnecting --->', id);
      self.notifyDisplayClientDisconnection(id);
      var index = self.clients.indexOf(client);
      if (index > -1) {
        self.clients.splice(index, 1);
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
    .sendAllClientsInformation
    params: (nothing)
    returns: (nothing)
    description:
      This function will gather all the clients information, map them using underscore and
      sending everything to the display.
    author: Rene Loperena
  */
  Room.prototype.sendAllClientsInformation = function() {
    var self = this;
    if(self.display !== null){
      self.display.sendDisplayInformation(_.map(self.clients, function(client){
        return client.getClientInformation();
      }));
    }
  };

  /*
    .notifyDisplayClientDisconnection
    params: clientId
    returns: (nothing)
    description:
      This function emits a "playerDisconnect" event to the display that tells it that this ID has disconnected.
    author: Brian Chu
  */
  Room.prototype.notifyDisplayClientDisconnection = function(clientId){
    if(this.display !== null) {
      this.display.socket.emit('playerDisconnect', clientId);
    }
  };



  /*
    .notifyDisplayClientConnection
    params: n/a
    returns: n/a
    description:
      This function emits a "playerConnect" event to the display
    author: Alex Leonetti
  */
  Room.prototype.notifyDisplayClientConnection = function(clientId) {
    if(this.display !== null) {
      this.display.socket.emit('playerConnect', clientId);
    }
  }


  return Room;
})();