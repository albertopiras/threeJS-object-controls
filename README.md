# ThreeJS Object Controls

ThreeJS module that allows you to rotate an Object(mesh) independently from the rest of the scene, and to zoom in/out moving the camera.

[view live example]

## Install

```
npm install --save threejs-object-controls
```

## Usage

```
import * as THREE from 'three';
import {ObjectControls} from 'threeJS-object-controls';
```

Create a new instance of Controls, passig 3 arguments:
* camera
* renderer element
* the mesh to move

```
var controls = new ObjectControls(camera, renderer.domElement, myMesh);
```
look at the [github example repo] to see an usage example.

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


## Tips

In case of problems with ts types required by threejs in a typescript project do the following:
1) go to the tsconfig.json file
2) add skipLibCheck: true in "compilerOptions" object.
```
    "compilerOptions": {
        "module": "commonjs",
        "moduleResolution": "node",
        "strict": true,
        "target": "es5",
        "declaration": true,
        "declarationDir": "dist-debug/",
        "skipLibCheck": true, /// Needs to be true to fix wrong alias types being used
        ...
    }
```

## Version
1.2

## License

MIT

[view live example]: <https://albertopiras.github.io/threeJS-object-controls/>

[github example repo]: <https://github.com/albertopiras/object-controls-angular-example>
