module.exports = (function() {
  /*
    Display
    Description:
      This object will be in charge of sending all information to the display endpoint.
    author: David Rosson / Rene Loperena
  */
  function Display(socket) {
    this.socket = socket;
  }

  /*
    .sendDisplayInformation
    params: displayInformation
    returns: (nothing)
    description:
      Will send the information passed as a parameter to the display endpoint
      creating a new 'displayInformation' event.
    author: David Rosson / Rene Loperena
  */
  Display.prototype.sendDisplayInformation = function(displayInformation) {
    /*
      Will emit the 'displayInformation' event towards the display endpoint.
    */
    this.socket.emit('displayInformation', displayInformation);
  };

  return Display;
})();