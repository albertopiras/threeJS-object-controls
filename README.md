# ThreeJS Object Controls
[![npm version](http://img.shields.io/npm/v/threejs-object-controls.svg?style=flat)](https://npmjs.org/package/threejs-object-controls "View this project on npm")

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
* the mesh(s) to move

```
var controls = new ObjectControls(camera, renderer.domElement, myMesh);
```
or
```
var controls = new ObjectControls(camera, renderer.domElement, [myMesh, myOtherMesh]);
```

(look at the index.html file to see an usage example, or check the [github example repo] to see an npm usage example with Angular)


You can also change the mesh you want rotate! :tada:

[view live example] and click the 'useMesh2' button on the right panel to interact with the second cube.  

### Options

You can set different options like

* rotation speed
* zoom speed
* min-max distance of the camera
* mesh(s) to rotate
* enable disable axis rotations
* set max rotation angle


```
- controls.setDistance(8, 200); // sets the min - max distance able to zoom
- controls.setZoomSpeed(1); // sets the zoom speed ( 0.1 == slow, 1 == fast)
- controls.disableZoom(); // disables zoom
- controls.enableZoom(); // enables zoom
- controls.setObjectToMove(newMesh); // changes the object(s) to interact with
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


## Tips

### TypeScript Gotchas
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
### Working with multiple meshes
If more than one mesh is passed in as the object to move, all objects will stop move as soon as the first hits its rotation limit.


## Version
1.2.6

## License

MIT

[view live example]: <https://albertopiras.github.io/threeJS-object-controls/>

[github example repo]: <https://github.com/albertopiras/object-controls-angular-example>