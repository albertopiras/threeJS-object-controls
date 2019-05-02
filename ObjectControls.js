/* --------------------------------------------------------
THREE.ObjectControls
version: 1.1
author: Alberto Piras
email: a.piras.ict@gmail.com
github: https://github.com/albertopiras
license: MIT
----------------------------------------------------------*/

/**
 * THREE.ObjectControls
 * @constructor
 * @param camera - The camera.
 * @param domElement - the renderer's dom element
 * @param objectToMove - the object to control.
 */


THREE.ObjectControls = function(camera, domElement, objectToMove) {
  this.camera = camera;
  this.objectToMove = objectToMove;
  this.domElement = (domElement !== undefined) ? domElement : document;

  this.setDistance = function(min, max) {
    minDistance = min;
    maxDistance = max;
  };

  this.setZoomSpeed = function(zoomSpeed) {
    zoomSpeed = zoomSpeed;
  };

  this.setRotationSpeed = function(rotationSpeed) {
    rotationSpeed = rotationSpeed;
  };

  this.enableVerticalRotation = function() {
    verticalRotationEnabled = true;
  };

  this.disableVerticalRotation = function() {
    verticalRotationEnabled = false;
  };

  this.enableHorizontalRotation = function() {
    horizontalRotationEnabled = true;
  };

  this.disableHorizontalRotation = function() {
    horizontalRotationEnabled = false;
	};

  /************* MOUSE Interaction Controls (rotate & zoom, desktop)
   * ***************/
  // MOUSE - move
  this.domElement.addEventListener('mousedown', mouseDown, false);
  this.domElement.addEventListener('mousemove', mouseMove, false);
  this.domElement.addEventListener('mouseup', mouseUp, false);

  // MOUSE - zoom
  this.domElement.addEventListener('wheel', wheel, false);


  /************** TOUCH Interaction Controls (rotate & zoom, mobile)
   * ************/
  // TOUCH - move
  this.domElement.addEventListener('touchstart', onTouchStart, false);
  this.domElement.addEventListener('touchmove', onTouchMove, false);
  this.domElement.addEventListener('touchend', onTouchEnd, false);

  /********************* controls variables *************************/

	// var MAX_X_ANGLE = Math.PI/2;
	// var MAX_Y_ANGLE = Math.PI;

  var maxAngleLimit = true;
  var maxDistance = 15, minDistance = 6, zoomSpeed = 0.5, rotationSpeed = 1,
      verticalRotationEnabled = false, horizontalRotationEnabled = true;

  var mouseFlags = {MOUSEDOWN: 0, MOUSEMOVE: 1};

  var flag;
  var isDragging = false;
  var previousMousePosition = {x: 0, y: 0};

  /**currentTouches
   * length 0 : no zoom
   * length 2 : is zoomming
   */
  var currentTouches = [];

  var prevZoomDiff = {X: null, Y: null};

  /***************************** shared functions **********************/

  function zoomIn() {
    camera.position.z -= zoomSpeed;
  }

  function zoomOut() {
    camera.position.z += zoomSpeed;
  }

  /******************  MOUSE interaction functions - desktop  *****/
  function mouseDown(e) {
    isDragging = true;
    flag = mouseFlags.MOUSEDOWN;
  }

  function mouseMove(e) {
    var deltaMove = {
      x: e.offsetX - previousMousePosition.x,
      y: e.offsetY - previousMousePosition.y
    };

    if (isDragging) {
      if (horizontalRotationEnabled && deltaMove.x != 0) {
        // console.info(deltaMove.x);
        objectToMove.rotation.y += deltaMove.x / 200;
        console.log(objectToMove.rotation.y);
        flag = mouseFlags.MOUSEMOVE;
      }

      if (verticalRotationEnabled && deltaMove.y != 0) {
        // console.info(deltaMove.x);
        objectToMove.rotation.x += deltaMove.y / 200;
        flag = mouseFlags.MOUSEMOVE;
      }
    }

    previousMousePosition = {x: e.offsetX, y: e.offsetY};
  }

  function mouseUp(e) {
    isDragging = false;
  }

  function wheel(e) {
    if (e.wheelDelta > 0 && camera.position.z > minDistance) {
      zoomIn();
    } else if (e.wheelDelta < 0 && camera.position.z < maxDistance) {
      zoomOut();
    }
  }

  /****************** TOUCH interaction functions - mobile  *****/

  function onTouchStart(e) {
    e.preventDefault();
    flag = mouseFlags.MOUSEDOWN;
    if (e.touches.length === 2) {
      prevZoomDiff.X = Math.abs(e.touches[0].clientX - e.touches[1].clientX);
      prevZoomDiff.Y = Math.abs(e.touches[0].clientY - e.touches[1].clientY);
      currentTouches = new Array(2);
    } else {
      previousMousePosition = {x: e.touches[0].pageX, y: e.touches[0].pageY};
    }
    // console.info("onTouchStart");
  }

  function onTouchEnd(e) {
    prevZoomDiff.X = null;
    prevZoomDiff.Y = null;

    // if you were zooming out, currentTouches is updated for each finger you
    // leave up the screen so each time a finger leaves up the screen,
    // currentTouches length is decreased of a unit. When you leave up both 2
    // fingers, currentTouches.length is 0, this means the zoomming phase is
    // ended
    if (currentTouches.length > 0) {
      currentTouches.pop();
    } else {
      currentTouches = [];
    }
    e.preventDefault();
    if (flag === mouseFlags.MOUSEDOWN) {
      // console.info("touchClick");
      // you can invoke more other functions for animations and so on...
    } else if (flag === mouseFlags.MOUSEMOVE) {
      // console.info("touch drag");
      // you can invoke more other functions for animations and so on...
    }
    // console.info("onTouchEnd");
  }

  // TOUCH - rotation and zoom
  function onTouchMove(e) {
    e.preventDefault();
    flag = mouseFlags.MOUSEMOVE;
    // If two pointers are down, check for pinch gestures (ZOOM)
    if (e.touches.length === 2) {
      currentTouches = new Array(2);
      // console.info("onTouchZoom");
      // Calculate the distance between the two pointers
      var curDiffX = Math.abs(e.touches[0].clientX - e.touches[1].clientX);
      var curDiffY = Math.abs(e.touches[0].clientY - e.touches[1].clientY);

      if (prevZoomDiff && prevZoomDiff.X > 0 && prevZoomDiff.Y > 0) {
        if ((curDiffX > prevZoomDiff.X) && (curDiffY > prevZoomDiff.Y) &&
            (camera.position.z > minDistance)) {
          // console.info("Pinch moving IN -> Zoom in", e);
          zoomIn();
        } else if (
            curDiffX < prevZoomDiff.X && camera.position.z < maxDistance &&
            curDiffY < prevZoomDiff.Y) {
          // console.info("Pinch moving OUT -> Zoom out", e);
          zoomOut();
        }
      }
      // Cache the distance for the next move event
      prevZoomDiff.X = curDiffX;
      prevZoomDiff.Y = curDiffY;

      // ROTATE
    } else if (currentTouches.length === 0) {
      prevZoomDiff.X = null;
      prevZoomDiff.Y = null;
      // console.info("onTouchMove");
      var deltaMove = {
        x: e.touches[0].pageX - previousMousePosition.x,
        y: e.touches[0].pageY - previousMousePosition.y
      };

      if (horizontalRotationEnabled && deltaMove.x != 0) {
        // console.info(deltaMove.x);
        objectToMove.rotation.y += deltaMove.x / 150;
      }

      if (verticalRotationEnabled && deltaMove.y != 0) {
        // console.info(deltaMove.y);
        objectToMove.rotation.x += deltaMove.y / 150;
      }

      previousMousePosition = {x: e.touches[0].pageX, y: e.touches[0].pageY};
    }
  }
};
