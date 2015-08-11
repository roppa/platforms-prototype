/*
  posX, posY
  Description:
   The global variables we need access to inorder to change the velocity of our character. 
  author: Alex Leonetti
*/

var posX = 0;
var posY = 0;


var controller = new Controller();
controller.connect();
controller.startCommunication();

/*
  interact joystick__button
  Description:
    Takes the joystick button div and allows it to be draggable within the restriction of its
    parent element container. The X and Y values are transferred over to our player.
  author: Alex Leonetti
*/

interact('#joystick__button')
  .draggable({
    restrict: {
      restriction: 'parent',
      // 0 means the left edge of the element and 1 means the right edge
      elementRect: {top: 0, left: 0, bottom: 1, right: 1}
    },

    onmove: dragMoveListener,
    onend: dragEndListener
  });

  /*
    dragEndListener
    Description:
      When this event is fired it grabs the current X and Y position and returns them to the 
      original starting point of the joystick. The player will also stop moving. 
    author: Alex Leonetti
  */

function dragEndListener (event) {
  var target = event.target;

  target.style.webkitTransform = 
  target.style.transform = 
    'translate(' + 0 + 'px, ' + 0 + 'px)';

  // update the posiion attributes
  target.setAttribute('data-x', 0);
  target.setAttribute('data-y', 0);

  posX = 0;
  posY = 0;

}

/*
  dragMoveListener
  Description:
    When the joystick button is being dragged, we grab the X and Y values and set them to 
    our characters. 
  author: Alex Leonetti
*/

function dragMoveListener (event) {
  var target = event.target;
  // keep the dragged position in the data-x/data-y attributes
  x = (parseFloat(target.getAttribute('data-x')) || 0) + event.dx;
  y = (parseFloat(target.getAttribute('data-y')) || 0) + event.dy;

  posX = x;
  posY = 0;

  // translate the element
  target.style.webkitTransform =
  target.style.transform =
    'translate(' + x + 'px, ' + y + 'px)';

  // update the posiion attributes
  target.setAttribute('data-x', x);
  target.setAttribute('data-y', y);
}

  // this is used later in the resizing demo
window.dragMoveListener = dragMoveListener;


/*
  setInterval updateVelocity
  inputs: posX, posY
  Description:
    Every 20 milliseconds, it will call updateVelocity in communication/client.js. 
  author: Alex Leonetti
*/
setInterval(function(){
  controller.updateVelocity(posX, posY);
}, 20);

/*
  button touchstart click
  Description:
   When the A button is clicked or touched it will change the Y position from 0 to -350 allowing
   the character to jump. 
  author: Alex Leonetti
*/
$('#button__a').on('touchstart', function() {
  $(this).css('background-color', 'pink');
  controller.pressA();

});


/*
  button touchend
  Description:
   When the A button is not being touched it changes the Y position back to 0. 
  author: Alex Leonetti
*/
$('#button__a').on('touchend', function() {
  $(this).css('background-color', 'inherit');
  controller.releaseA();
});

/*
  button touchstart click
  Description:
   When the B button is clicked or touched it will change the Y position from 0 to -350 allowing
   the character to jump. 
  author: Alex Leonetti
*/
$('#button__b').on('touchstart click', function() {
  $(this).css('background-color', 'pink');
  controller.pressB();

});


/*
  button touchend
  Description:
   When the B button is not being touched it changes the Y position back to 0. 
  author: Alex Leonetti
*/
$('#button__b').on('touchend click', function() {
  $(this).css('background-color', 'inherit');
  controller.releaseB();
});
