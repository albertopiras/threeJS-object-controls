# ThreeJS Object Controls

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
var controls = new THREE.ObjectControls(camera, renderer.domElement, myMesh);
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
controls.setDistance(8, 200); // set min - max distance for zoom

controls.setZoomSpeed(1); // set zoom speed

controls.enableVerticalRotation(); // enables the vertical rotation, see also disableVerticalRotation(), enableHorizontalRotation(), disableHorizontalRotation()

controls.setMaxVerticalRotationAngle(Math.PI / 4, Math.PI / 4); // sets a max angle value for the rotation of the object, see also setMaxHorizontalRotationAngle(R,R)

controls.disableMaxHorizontalAngleRotation()// disables rotation angle limits for horizontal rotation, see also disableMaxVerticalAngleRotation()

controls.setRotationSpeed(0.05); // sets a new rotation speed for desktop, see also setRotationSpeedTouchDevices(value)

Parameters details:

rotationSpeed:
 1 => fast
 0.01 => slow
```

## Version
1.1

## License

MIT

[view live example]: <https://albertopiras.github.io/threeJS-object-controls/>



