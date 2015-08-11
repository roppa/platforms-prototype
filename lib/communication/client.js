module.exports = (function(){
  /*
    Client
    Description:
      This object will be in charge of receiving all the information through sockets
      from the client and update the client values.

    author: David Rosson / Rene Loperena
  */
  function Client(socket,uniqueId){
    this.uniqueId = uniqueId;
    this.socket = socket;
    this.currentData = {x: 0 , y: 0};
    this.initializeClient();
  }

  /*
    .initializeClient
    params: (nothing)
    returns: (nothing)
    description:
      Set up all the events that the client may receive and act upon them.
    author: David Rosson / Rene Loperena
    modified: Rene Loperena
  */
  Client.prototype.initializeClient = function() {
    var self = this;
    /*
      On the 'updateData' event, we will update the currentData to
      the one received from the client.
    */
    this.socket.on('updateData', function(data){
      self.currentData = data;
    });

  };

  /*
    .getClientInformation
    params: (nothing)
    returns: information (Object with id and velocity)
    description:
      Returns the client information inside a new object.
    author: Rene Loperena
  */
  Client.prototype.getClientInformation = function(){
    return {
      id: this.uniqueId,
      data: this.currentData
    };
  };


  return Client;

})();