# ThreeJS Object Controls

ThreeJS module that allows you to rotate an Object(mesh) independently from the rest of the scene, and to zoom in/out moving the camera.

[view live example]

## Usage

Include threeJS and ObjectControls.js
```   
<script src="three.min.js"></script>
<script src="ObjectControls.js"></script>
```

Create a new instance of Controls, passig 3 arguments:
* camera
* renderer element
* the mesh to move

```
var controls = new THREE.ObjectControls(camera, renderer.domElement, mshBox);
```

### Options

You can set different options like 

* rotation speed
* zoom speed
* min-max distance of the camera

```
controls.setDistance(8, 200); // set min - max distance for zoom
controls.setZoomSpeed(1); // set zoom speed
controls.setRotationSpeed(1);
```

### Version
1.0 

## License

MIT 

[view live example]: <https://github.com/Alberto-/threeJS-object-controls>



