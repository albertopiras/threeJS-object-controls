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

	mesh = objectToMove;
  domElement = (domElement !== undefined) ? domElement : document;

  this.setObjectToMove = function(newMesh) {
    mesh = newMesh;
  };

  this.setDistance = function(min, max) {
    minDistance = min;
    maxDistance = max;
  };

  this.setZoomSpeed = function(newZoomSpeed) {
    zoomSpeed = newZoomSpeed;
  };

  this.setRotationSpeed = function(newRotationSpeed) {
    rotationSpeed = newRotationSpeed;
	};

	this.setRotationSpeedTouchDevices = function(newRotationSpeed) {
    rotationSpeedTouchDevices = newRotationSpeed;
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

  this.setMaxVerticalRotationAngle = function(min, max) {
    MAX_ROTATON_ANGLES.x.from = min;
    MAX_ROTATON_ANGLES.x.to = max;
    MAX_ROTATON_ANGLES.x.enabled = true;
  };

  this.setMaxHorizontalRotationAngle = function(min, max) {
    MAX_ROTATON_ANGLES.y.from = min;
    MAX_ROTATON_ANGLES.y.to = max;
    MAX_ROTATON_ANGLES.y.enabled = true;
  };

  this.disableMaxHorizontalAngleRotation = function() {
    MAX_ROTATON_ANGLES.y.enabled = false;
  };

  this.disableMaxVerticalAngleRotation = function() {
    MAX_ROTATON_ANGLES.x.enabled = false;
	};

  /************* MOUSE Interaction Controls (rotate & zoom, desktop)
   * ***************/
  // MOUSE - move
  domElement.addEventListener('mousedown', mouseDown, false);
  domElement.addEventListener('mousemove', mouseMove, false);
  domElement.addEventListener('mouseup', mouseUp, false);

  // MOUSE - zoom
  domElement.addEventListener('wheel', wheel, false);


  /************** TOUCH Interaction Controls (rotate & zoom, mobile)
   * ************/
  // TOUCH - move
  domElement.addEventListener('touchstart', onTouchStart, false);
  domElement.addEventListener('touchmove', onTouchMove, false);
  domElement.addEventListener('touchend', onTouchEnd, false);

  /********************* controls variables *************************/

  var MAX_ROTATON_ANGLES = {
    x: {
      // VERTICAL from bottom to top
      enabled: false,
      from: Math.PI / 8,
      to: Math.PI / 8
    },
    y: {
      // HORIZONTAL from left to right
      enabled: false,
      from: Math.PI / 4,
      to: Math.PI / 4
    }
  };

  // rotationSpeed
  // 1= fast
  // 0.01 = slow

  var maxDistance = 15, minDistance = 6, zoomSpeed = 0.5, rotationSpeed = 0.05,
     rotationSpeedTouchDevices = 0.05, verticalRotationEnabled = false,
      horizontalRotationEnabled = true;

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

  /**
   *
   * @param delta is the difference of the current rotation angle and the
   *     expected rotation angle
   * @param axe is the axe of rotation: x(vertical rotation), y (horizontal
   *     rotation)
   * @return true if the rotation with the new delta is included into the
   *     allowed angle range, false otherwise
   */
  function isWithinMaxAngle(delta, axe) {
    if (MAX_ROTATON_ANGLES[axe].enabled) {
      var condition = ((MAX_ROTATON_ANGLES[axe].from * -1) <
                       (mesh.rotation[axe] + delta)) &&
          ((mesh.rotation[axe] + delta) < MAX_ROTATON_ANGLES[axe].to);
      return condition ? true : false;
    }
    return true;
	}

  function resetMousePosition() {
    previousMousePosition = {x: 0, y: 0};
  }

  /******************  MOUSE interaction functions - desktop  *****/
  function mouseDown(e) {
    isDragging = true;
    flag = mouseFlags.MOUSEDOWN;
  }

  function mouseMove(e) {
    if (isDragging) {
      var deltaMove = {
        x: e.offsetX - previousMousePosition.x,
        y: e.offsetY - previousMousePosition.y
      };

      previousMousePosition = {x: e.offsetX, y: e.offsetY};

      if (horizontalRotationEnabled && deltaMove.x != 0)
      // && (Math.abs(deltaMove.x) > Math.abs(deltaMove.y))) {
      // enabling this, the mesh will rotate only in one specific direction
      // for mouse movement
      {
        if (!isWithinMaxAngle(Math.sign(deltaMove.x) * rotationSpeed, 'y'))
          return;
        mesh.rotation.y += Math.sign(deltaMove.x) * rotationSpeed;
        flag = mouseFlags.MOUSEMOVE;
      }

      if (verticalRotationEnabled && deltaMove.y != 0)
      // &&(Math.abs(deltaMove.y) > Math.abs(deltaMove.x)) //
      // enabling this, the mesh will rotate only in one specific direction for
      // mouse movement
      {
        if (!isWithinMaxAngle(Math.sign(deltaMove.y) * rotationSpeed, 'x'))
          return;
        mesh.rotation.x += Math.sign(deltaMove.y) * rotationSpeed;
        flag = mouseFlags.MOUSEMOVE;
      }
    }
  }

  function mouseUp(e) {
    isDragging = false;
    resetMousePosition();
  }

 function wheel(e) {
    var delta = e.wheelDelta? e.wheelDelta : e.deltaY*-1;
    if (delta > 0 && camera.position.z > minDistance) {
      zoomIn();
    } else if (delta < 0 && camera.position.z < maxDistance) {
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
		resetMousePosition();
  }

  function onTouchMove(e) {
    e.preventDefault();
    flag = mouseFlags.MOUSEMOVE;
		// TOUCH ZOOM
		// If two pointers are down, check for pinch gestures
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

      // TOUCH ROTATE
    } else if (currentTouches.length === 0) {
      prevZoomDiff.X = null;
      prevZoomDiff.Y = null;
      // console.info("onTouchMove");
      var deltaMove = {
        x: e.touches[0].pageX - previousMousePosition.x,
        y: e.touches[0].pageY - previousMousePosition.y
      };
      previousMousePosition = {x: e.touches[0].pageX, y: e.touches[0].pageY};

      if (horizontalRotationEnabled && deltaMove.x != 0) {
        if (!isWithinMaxAngle(Math.sign(deltaMove.x) * rotationSpeedTouchDevices, 'y'))
          return;
        mesh.rotation.y += Math.sign(deltaMove.x) * rotationSpeedTouchDevices;
      }

      if (verticalRotationEnabled && deltaMove.y != 0) {
        if (!isWithinMaxAngle(Math.sign(deltaMove.y) * rotationSpeedTouchDevices, 'x'))
          return;
        mesh.rotation.x += Math.sign(deltaMove.y) * rotationSpeedTouchDevices;
      }
    }
	}

};
