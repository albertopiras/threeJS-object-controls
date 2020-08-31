# ThreeJS Object Controls
[![npm version](http://img.shields.io/npm/v/threejs-object-controls.svg?style=flat)](https://npmjs.org/package/threejs-object-controls "View this project on npm")

ThreeJS module that allows you to rotate an Object(mesh) independently from the rest of the scene, and to zoom in/out moving the camera.

[view live example]

## Usage

Include threeJS and ObjectControls.js into your page

```
<script src="three.min.js"></script>
<script src="ObjectControls.js"></script>
```

Create a new instance of Controls, passig 3 arguments:
* camera
* renderer element
* the mesh to move

```
var controls = new ObjectControls(camera, renderer.domElement, myMesh);
```

look at `index.html` to see an usage example.

You can also change the mesh you want rotate! :tada:

[view live example] and click the 'useMesh2' button on the right panel to interact with the second cube.  

### Options

You can set different options like

* rotation speed
* zoom speed
* min-max distance of the camera
* mesh to rotate
* enable disable axis rotations
* set max rotation angle


```
- controls.setDistance(8, 200); // sets the min - max distance able to zoom
- controls.setZoomSpeed(1); // sets the zoom speed ( 0.1 == slow, 1 == fast)
- controls.setObjectToMove(newMesh); // changes the object to interact with
- controls.setRotationSpeed(0.05); // sets a new rotation speed for desktop ( 0.1 == slow, 1 == fast)
- controls.setRotationSpeedTouchDevices(value); // sets a new rotation speed for mobile
- controls.enableVerticalRotation(); // enables the vertical rotation
- constrols.disableVerticalRotation();  // disables the vertical rotation
- controls.enableHorizontalRotation(); // enables the horizontal rotation
- controls.disableHorizontalRotation();// disables the horizontal rotation
- controls.setMaxVerticalRotationAngle(Math.PI / 4, Math.PI / 4); // sets a max angle value for the vertical rotation of the object
- controls.setMaxHorizontalRotationAngle(R,R); // sets a max angle value for the horizontal rotation of the object
- controls.disableMaxHorizontalAngleRotation(); // disables angle limits for horizontal rotation
- controls.disableMaxVerticalAngleRotation(); // disables angle limits for vertical rotation
```

## Version
1.2.4

## License

MIT

[view live example]: <https://albertopiras.github.io/threeJS-object-controls/>
