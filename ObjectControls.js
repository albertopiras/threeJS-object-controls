/* --------------------------------------------------------
ObjectControls
version: 1.2.8
author: Alberto Piras
email: a.piras.ict@gmail.com
github: https://github.com/albertopiras
license: MIT
description: module for ThreeJS that allows you to rotate an Object(mesh) independently from the rest of the scene, and to zoom in/out moving the camera; for desktop and mobile.
----------------------------------------------------------*/

/**
 * ObjectControls
 * @constructor
 * @param camera - reference to the camera.
 * @param domElement - reference to the renderer's dom element.
 * @param objectToMove - reference the object to control.
 */
function ObjectControls(camera, domElement, objectToMove) {
  /**
   * setObjectToMove
   * @description changes the object(s) to control
   * @param newMesh : one mesh or an array of meshes
   **/
  this.setObjectToMove = function (newMesh) {
    mesh = newMesh;
  };

  this.getObjectToMove = function() {
    return mesh;
  }

  /**
   * setZoomSpeed
   * @description sets a custom zoom speed (0.1 == slow  1 == fast)
   * @param newZoomSpeed
   **/
  this.setZoomSpeed = function (newZoomSpeed) {
    zoomSpeed = newZoomSpeed;
  };

  /**
   * setDistance
   * @description set the zoom range distance
   * @param {number} min
   * @param {number} max
   **/
  this.setDistance = function (min, max) {
    minDistance = min;
    maxDistance = max;
  };

  /**
   * setRotationSpeed
   * @param {number} newRotationSpeed - (1 == fast)  (0.01 == slow)
   **/
  this.setRotationSpeed = function (newRotationSpeed) {
    rotationSpeed = newRotationSpeed;
  };

  /**
   * setRotationSpeedTouchDevices
   * @param {number} newRotationSpeed - (1 == fast)  (0.01 == slow)
   **/
  this.setRotationSpeedTouchDevices = function (newRotationSpeed) {
    rotationSpeedTouchDevices = newRotationSpeed;
  };

  this.enableVerticalRotation = function () {
    verticalRotationEnabled = true;
  };

  this.disableVerticalRotation = function () {
    verticalRotationEnabled = false;
  };

  this.enableHorizontalRotation = function () {
    horizontalRotationEnabled = true;
  };

  this.disableHorizontalRotation = function () {
    horizontalRotationEnabled = false;
  };

  this.setMaxVerticalRotationAngle = function (min, max) {
    MAX_ROTATON_ANGLES.x.from = min;
    MAX_ROTATON_ANGLES.x.to = max;
    MAX_ROTATON_ANGLES.x.enabled = true;
  };

  this.setMaxHorizontalRotationAngle = function (min, max) {
    MAX_ROTATON_ANGLES.y.from = min;
    MAX_ROTATON_ANGLES.y.to = max;
    MAX_ROTATON_ANGLES.y.enabled = true;
  };

  this.disableMaxHorizontalAngleRotation = function () {
    MAX_ROTATON_ANGLES.y.enabled = false;
  };

  this.disableMaxVerticalAngleRotation = function () {
    MAX_ROTATON_ANGLES.x.enabled = false;
  };

  this.disableZoom = function () {
    zoomEnabled = false;
  };

  this.enableZoom = function () {
    zoomEnabled = true;
  };

  this.isUserInteractionActive = function(){
    return isDragging;
  }

  domElement = domElement !== undefined ? domElement : document;

  /********************* Private control variables *************************/

  const MAX_ROTATON_ANGLES = {
    x: {
      // Vertical from bottom to top.
      enabled: false,
      from: Math.PI / 8,
      to: Math.PI / 8,
    },
    y: {
      // Horizontal from left to right.
      enabled: false,
      from: Math.PI / 4,
      to: Math.PI / 4,
    },
  };

  let flag,
    mesh = objectToMove,
    maxDistance = 15,
    minDistance = 6,
    zoomSpeed = 0.5,
    rotationSpeed = 0.05,
    rotationSpeedTouchDevices = 0.05,
    isDragging = false,
    verticalRotationEnabled = false,
    horizontalRotationEnabled = true,
    zoomEnabled = true,
    mouseFlags = { MOUSEDOWN: 0, MOUSEMOVE: 1 },
    previousMousePosition = { x: 0, y: 0 },
    prevZoomDiff = { X: null, Y: null },
    /**
     * CurrentTouches
     * length 0 : no zoom
     * length 2 : is zoomming
     */
    currentTouches = [];

  /***************************** Private shared functions **********************/

  function zoomIn() {
    camera.position.z -= zoomSpeed;
  }

  function zoomOut() {
    camera.position.z += zoomSpeed;
  }

  function rotateVertical(deltaMove, mesh) {
    if (mesh.length > 1) {
      for (let i = 0; i < mesh.length; i++) {
        rotateVertical(deltaMove, mesh[i]);
      }
      return;
    }
    mesh.rotation.x += Math.sign(deltaMove.y) * rotationSpeed;
  }

  function rotateVerticalTouch(deltaMove, mesh) {
    if (mesh.length > 1) {
      for (let i = 0; i < mesh.length; i++) {
        rotateVerticalTouch(deltaMove, mesh[i]);
      }
      return;
    }
    mesh.rotation.x += Math.sign(deltaMove.y) * rotationSpeedTouchDevices;
  }

  function rotateHorizontal(deltaMove, mesh) {
    if (mesh.length > 1) {
      for (let i = 0; i < mesh.length; i++) {
        rotateHorizontal(deltaMove, mesh[i]);
      }
      return;
    }
    mesh.rotation.y += Math.sign(deltaMove.x) * rotationSpeed;
  }

  function rotateHorizontalTouch(deltaMove, mesh) {
    if (mesh.length > 1) {
      for (let i = 0; i < mesh.length; i++) {
        rotateHorizontalTouch(deltaMove, mesh[i]);
      }
      return;
    }
    mesh.rotation.y += Math.sign(deltaMove.x) * rotationSpeedTouchDevices;
  }

  /**
   * isWithinMaxAngle
   * @description Checks if the rotation in a specific axe is within the maximum
   * values allowed.
   * @param delta is the difference of the current rotation angle and the
   *     expected rotation angle
   * @param axe is the axe of rotation: x(vertical rotation), y (horizontal
   *     rotation)
   * @return true if the rotation with the new delta is included into the
   *     allowed angle range, false otherwise
   */
  function isWithinMaxAngle(delta, axe) {
    if (MAX_ROTATON_ANGLES[axe].enabled) {
      if (mesh.length > 1) {
        let condition = true;
        for (let i = 0; i < mesh.length; i++) {
          if (!condition) return false;
          if (MAX_ROTATON_ANGLES[axe].enabled) {
            condition = isRotationWithinMaxAngles(mesh[i], delta, axe);
          }
        }
        return condition;
      }
      return isRotationWithinMaxAngles(mesh, delta, axe);
    }
    return true;
  }

  function isRotationWithinMaxAngles(meshToRotate, delta, axe) {
    return MAX_ROTATON_ANGLES[axe].from * -1 <
      meshToRotate.rotation[axe] + delta &&
      meshToRotate.rotation[axe] + delta < MAX_ROTATON_ANGLES[axe].to
      ? true
      : false;
  }

  function resetMousePosition() {
    previousMousePosition = { x: 0, y: 0 };
  }

  /******************  MOUSE interaction functions - desktop  *****/
  function mouseDown(e) {
    isDragging = true;
    flag = mouseFlags.MOUSEDOWN;
  }

  function mouseMove(e) {
    if (isDragging) {
      const deltaMove = {
        x: e.offsetX - previousMousePosition.x,
        y: e.offsetY - previousMousePosition.y,
      };

      previousMousePosition = { x: e.offsetX, y: e.offsetY };

      if (horizontalRotationEnabled && deltaMove.x != 0) {
        // && (Math.abs(deltaMove.x) > Math.abs(deltaMove.y))) {
        // enabling this, the mesh will rotate only in one specific direction
        // for mouse movement
        if (!isWithinMaxAngle(Math.sign(deltaMove.x) * rotationSpeed, "y"))
          return;
        rotateHorizontal(deltaMove, mesh);
        flag = mouseFlags.MOUSEMOVE;
      }

      if (verticalRotationEnabled && deltaMove.y != 0) {
        // &&(Math.abs(deltaMove.y) > Math.abs(deltaMove.x)) //
        // enabling this, the mesh will rotate only in one specific direction for
        // mouse movement
        if (!isWithinMaxAngle(Math.sign(deltaMove.y) * rotationSpeed, "x"))
          return;
        rotateVertical(deltaMove, mesh);
        flag = mouseFlags.MOUSEMOVE;
      }
    }
  }

  function mouseUp() {
    isDragging = false;
    resetMousePosition();
  }

  function wheel(e) {
    if (!zoomEnabled) return;
    const delta = e.wheelDelta ? e.wheelDelta : e.deltaY * -1;
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
      previousMousePosition = { x: e.touches[0].pageX, y: e.touches[0].pageY };
    }
  }

  function onTouchEnd(e) {
    prevZoomDiff.X = null;
    prevZoomDiff.Y = null;

    /* If you were zooming out, currentTouches is updated for each finger you
     * leave up the screen so each time a finger leaves up the screen,
     * currentTouches length is decreased of a unit. When you leave up both 2
     * fingers, currentTouches.length is 0, this means the zoomming phase is
     * ended.
     */
    if (currentTouches.length > 0) {
      currentTouches.pop();
    } else {
      currentTouches = [];
    }
    e.preventDefault();
    if (flag === mouseFlags.MOUSEDOWN) {
      // TouchClick
      // You can invoke more other functions for animations and so on...
    } else if (flag === mouseFlags.MOUSEMOVE) {
      // Touch drag
      // You can invoke more other functions for animations and so on...
    }
    resetMousePosition();
  }

  function onTouchMove(e) {
    e.preventDefault();
    flag = mouseFlags.MOUSEMOVE;
    // Touch zoom.
    // If two pointers are down, check for pinch gestures.
    if (e.touches.length === 2 && zoomEnabled) {
      currentTouches = new Array(2);
      // Calculate the distance between the two pointers.
      const curDiffX = Math.abs(e.touches[0].clientX - e.touches[1].clientX);
      const curDiffY = Math.abs(e.touches[0].clientY - e.touches[1].clientY);

      if (prevZoomDiff && prevZoomDiff.X > 0 && prevZoomDiff.Y > 0) {
        if (
          curDiffX > prevZoomDiff.X &&
          curDiffY > prevZoomDiff.Y &&
          camera.position.z > minDistance
        ) {
          zoomIn();
        } else if (
          curDiffX < prevZoomDiff.X &&
          camera.position.z < maxDistance &&
          curDiffY < prevZoomDiff.Y
        ) {
          zoomOut();
        }
      }
      // Cache the distance for the next move event.
      prevZoomDiff.X = curDiffX;
      prevZoomDiff.Y = curDiffY;

      // Touch Rotate.
    } else if (currentTouches.length === 0) {
      prevZoomDiff.X = null;
      prevZoomDiff.Y = null;
      const deltaMove = {
        x: e.touches[0].pageX - previousMousePosition.x,
        y: e.touches[0].pageY - previousMousePosition.y,
      };
      previousMousePosition = { x: e.touches[0].pageX, y: e.touches[0].pageY };

      if (horizontalRotationEnabled && deltaMove.x != 0) {
        if (
          !isWithinMaxAngle(
            Math.sign(deltaMove.x) * rotationSpeedTouchDevices,
            "y"
          )
        )
          return;
        rotateHorizontalTouch(deltaMove, mesh);
      }

      if (verticalRotationEnabled && deltaMove.y != 0) {
        if (
          !isWithinMaxAngle(
            Math.sign(deltaMove.y) * rotationSpeedTouchDevices,
            "x"
          )
        )
          return;
        rotateVerticalTouch(deltaMove, mesh);
      }
    }
  }

  /********************* Event Listeners *************************/

  /** Mouse Interaction Controls (rotate & zoom, desktop **/
  // Mouse - move
  domElement.addEventListener("mousedown", mouseDown, false);
  domElement.addEventListener("mousemove", mouseMove, false);
  domElement.addEventListener("mouseup", mouseUp, false);
  domElement.addEventListener("mouseout", mouseUp, false);

  // Mouse - zoom
  domElement.addEventListener("wheel", wheel, false);

  /** Touch Interaction Controls (rotate & zoom, mobile) **/
  // Touch - move
  domElement.addEventListener("touchstart", onTouchStart, false);
  domElement.addEventListener("touchmove", onTouchMove, false);
  domElement.addEventListener("touchend", onTouchEnd, false);
}

export { ObjectControls };
