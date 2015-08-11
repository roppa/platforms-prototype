module.exports = (function(){
  /*
    Controller
    Description:
      This object will be in charge of receiving all the information through sockets
      from the controller and update the current values.

    author: David Rosson / Rene Loperena
    modified: Rene Loperena
  */
  function Controller(socket,uniqueId){
    this.uniqueId = uniqueId;
    this.socket = socket;
    this.currentData = {x: 0 , y: 0};
    this.initializeController();
  }

  /*
    .initializeController
    params: (nothing)
    returns: (nothing)
    description:
      Set up all the events that the controller may receive and act upon them.
    author: David Rosson / Rene Loperena
    modified: Rene Loperena
  */
  Controller.prototype.initializeController = function() {
    var self = this;
    /*
      On the 'updateData' event, we will update the currentData to
      the one received from the controller.
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
      Returns the controller information inside a new object.
    author: Rene Loperena
  */
  Controller.prototype.getControllerInformation = function(){
    return {
      id: this.uniqueId,
      data: this.currentData
    };
  };


  return Controller;

})();