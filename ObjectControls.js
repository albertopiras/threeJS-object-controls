/* --------------------------------------------------------
THREE.ObjectControls
version: 1.0
author: Alberto Piras
email: a.piras@gmail.com
github: https://github.com/Alberto-
license: MIT
----------------------------------------------------------*/


/**
 * THREE.ObjectControls
 * @constructor
 * @param domElement - the renderer's dom element
 * @param camera - The camera.
 * @param objectToMove - the object to control.
 */

THREE.ObjectControls = function (domElement, camera, objectToMove) {

	this.camera = camera;
	this.objectToMove = objectToMove;
	this.domElement = (domElement !== undefined) ? domElement : document;

	this.setDistance = function (min, max) {
		mindistance = min;
		maxDistance = max;
	};

	this.setZoomSpeed = function (speed) {
		zoomSpeed = speed;
	};

	this.setRotationSpeed = function (speed) {
		rotationSpeed = speed;
	};

	var maxDistance = 15,
		minDistance = 6,
		zoomSpeed = 0.5,
		rotationSpeed = 1;

	var mouseFlags = {
		MOUSEDOWN: 0,
		MOUSEMOVE: 1
	};

	var flag;
	var isDragging = false;
	var previousMousePosition = {
		x: 0,
		y: 0
	};

	/**currentTouches
	 * length 0 : no zoom
	 * length 2 : is zoomming
	 */
	var currentTouches = [];

	var prevZoomDiff = {
		X: null,
		Y: null
	};

	/******************* Interaction Controls (rotate & zoom, desktop & mobile) - Start ************/
	// MOUSE - move
	this.domElement.addEventListener('mousedown', function(e) {
		isDragging = true;
		flag = mouseFlags.MOUSEDOWN;
	});

	this.domElement.addEventListener('mousemove', function(e) {
		var deltaMove = {
			x: e.offsetX - previousMousePosition.x,
			y: e.offsetY - previousMousePosition.y
		};

		if (isDragging) {
			if (deltaMove.x != 0) {
				// console.log(deltaMove.x);
				objectToMove.rotation.y += deltaMove.x / 200;
				flag = mouseFlags.MOUSEMOVE;
			}
		}

		previousMousePosition = {
			x: e.offsetX,
			y: e.offsetY
		};
	});

	this.domElement.addEventListener('mouseup', function(e) {
		isDragging = false;
		if (flag === mouseFlags.MOUSEDOWN) {
			closePalette();
		}
		else if (flag === mouseFlags.MOUSEMOVE) {
		}
	});

	// MOUSE - zoom
	this.domElement.addEventListener('wheel', function(e) {
		if (e.wheelDelta > 0 && camera.position.z > minDistance) {
			zoomIn();
		} else if (e.wheelDelta < 0 && camera.position.z < maxDistance) {
			zoomOut();
		}
	}, false);

	function zoomIn() {
		camera.position.z -= zoomSpeed;
	}

	function zoomOut() {
		camera.position.z += zoomSpeed;
	}

	// TOUCH - move
	this.domElement.addEventListener('touchstart', onTouchStart, false);
	this.domElement.addEventListener('touchend', onTouchEnd, false);
	this.domElement.addEventListener('touchmove', onTouchMove, false);

	function onTouchStart(e) {
		e.preventDefault();
		flag = mouseFlags.MOUSEDOWN;
		if (e.touches.length === 2) {
			prevZoomDiff.X = Math.abs(e.touches[0].clientX - e.touches[1].clientX);
			prevZoomDiff.Y = Math.abs(e.touches[0].clientY - e.touches[1].clientY);
			currentTouches = new Array(2);
		} else {
			previousMousePosition = {
				x: e.touches[0].pageX,
				y: e.touches[0].pageY
			};
		}
		// console.log("onTouchStart");
	}


	function onTouchEnd(e) {
		prevZoomDiff.X = null;
		// if you were zooming out, currentTouches is updated for each finger you leave up the screen
		// so each time a finger leaves up the screen, currentTouches length is decreased of a unit.
		// When you leave up both 2 fingers, currentTouches.length is 0, this means the zoomming phase is ended
		if (currentTouches.length > 0) {
			currentTouches.pop();
		} else {
			currentTouches = [];
		}
		e.preventDefault();
		if (flag === mouseFlags.MOUSEDOWN) {
			// console.log("touchClick");
			closePalette();
		}
		else if (flag === mouseFlags.MOUSEMOVE) {
			// console.log("touch drag");
		}
		// console.log("onTouchEnd");

	}

	//TOUCH - Zoom
	function onTouchMove(e) {
		e.preventDefault();
		flag = mouseFlags.MOUSEMOVE;
		// If two pointers are down, check for pinch gestures
		if (e.touches.length === 2) {
			currentTouches = new Array(2);
			console.log("onTouchZoom");
			// Calculate the distance between the two pointers
			var curDiffX = Math.abs(e.touches[0].clientX - e.touches[1].clientX);
			var curDiffY = Math.abs(e.touches[0].clientY - e.touches[1].clientY);

			if (prevZoomDiff && prevZoomDiff.X > 0 && prevZoomDiff.Y > 0) {
				if ((curDiffX > prevZoomDiff.X) &&
					(curDiffY > prevZoomDiff.Y) && (camera.position.z > minDistance)) {
					// The distance between the two pointers has increased
					// console.log("Pinch moving IN -> Zoom in", e);
					zoomIn();
				} else if (curDiffX < prevZoomDiff.X && camera.position.z < maxDistance && curDiffY < prevZoomDiff.Y) {
					// The distance between the two pointers has decreased
					// console.log("Pinch moving OUT -> Zoom out", e);
					zoomOut();
				}
			}
			// Cache the distance for the next move event 
			prevZoomDiff.X = curDiffX;
			prevZoomDiff.Y = curDiffY;

		} else if (currentTouches.length === 0) {
			prevZoomDiff.X = null;
			console.log("onTouchMove");
			var deltaMove = {
				x: e.touches[0].pageX - previousMousePosition.x,
				y: e.touches[0].pageY - previousMousePosition.y
			};

			if (deltaMove.x != 0) {
				// console.log(deltaMove.x);
				objectToMove.rotation.y += deltaMove.x / 150;
			}

			previousMousePosition = {
				x: e.touches[0].pageX,
				y: e.touches[0].pageY
			};
		}
	}
};