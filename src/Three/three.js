import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { DragControls } from "three/addons/controls/DragControls.js";
import { TransformControls } from "three/examples/jsm/controls/TransformControls.js";
import { Line2 } from "three/examples/jsm/lines/Line2.js";
import { LineMaterial } from "three/examples/jsm/lines/LineMaterial.js";
import { LineGeometry } from "three/examples/jsm/lines/LineGeometry.js";
import { FontLoader } from "three/addons/loaders/FontLoader.js";
import { TextGeometry } from "three/addons/geometries/TextGeometry.js";
import { Sky } from "three/addons/objects/Sky.js";
import { MathUtils, Vector3 } from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import {  SUBTRACTION, Brush, Evaluator } from "three-bvh-csg";
import store from "../Store/index.js";

export default class ThreeScene {
  constructor(container) {
    this.container = container;
    this.scene = null;
    this.camera = null;
    this.renderer = null;
    this.cam = true;
    this.objects = [];
    this.raycaster = new THREE.Raycaster();
    this.mouse = new THREE.Vector2();
    this.intersects = null;
    this.controlPoints = [];

    this.vertMarkers = [];

    this.bbBoxes = [];
    this.plane = null;
    this.controls = null;
    this.spheres = [];
    this.walls = [];
    this.hel;
    this.gridSize = 100;
    this.lines = [];
    this.helper;
    this.textMeshes = [];
    this.tempLine = null;
    this.Dragcontrols = null;
    this.isDrawing = false;
    this.gltf = [];
    this.getImageData = false;
    this.transformControls;
    this.dragObjects = [];
    this.mainArray = [];
    this.modelLoad = [];
    this.globalArray = [];
    this.group;

    this.model;
    this.modelBox;
    this.box;
    this.polygons = [];
    this.polygonGroup;
    this.initializeDragControls;
    this.disposeDragControls;


    this.onPointerMove = this.onPointerMove.bind(this);
    this.onMouseDown = this.onMouseDown.bind(this);
    this.mouseover = this.mouseover.bind(this);
    this.isDragging = false;
    this.draggedObject = null;

    this.init();

     this.transformControls = new TransformControls(
       this.camera,
       this.renderer.domElement
     );
     this.transformControls.setMode("translate");
     this.scene.add(this.transformControls);

  }

  init() {
    if (this.renderer) {
      this.container.removeChild(this.renderer.domElement);
    }

    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color("white");

    this.renderer = new THREE.WebGLRenderer({
      antialias: true,
      preserveDrawingBuffer: true,
    });
    this.renderer.physicallyCorrectLights = true;
    this.renderer.setSize(
      this.container.clientWidth,
      this.container.clientHeight
    );
    this.container.appendChild(this.renderer.domElement);

    this.light = new THREE.AmbientLight(0xffffff);
    this.scene.add(this.light);


    let pointLight = new THREE.DirectionalLight("white", 10);
    pointLight.position.set(10, 10, 0);
    this.scene.add(pointLight);


    this.mesh();
    this.updateCamera();
    window.addEventListener("resize", () => {
      this.camera.aspect = window.innerWidth / window.innerHeight;
      this.camera.updateProjectionMatrix();
      this.renderer.setSize(window.innerWidth, window.innerHeight);
    });
    let sky = new Sky();
    sky.scale.setScalar(450000);

    let phi = MathUtils.degToRad(80);
    let theta = MathUtils.degToRad(180);
    let sunPosition = new Vector3().setFromSphericalCoords(1, phi, theta);

    sky.material.uniforms.sunPosition.value = sunPosition;
    sky.material.uniforms.rayleigh.value = 1;
    sky.material.uniforms.turbidity.value = 0;

    this.scene.add(sky);

    this.renderer.domElement.addEventListener(
      "click",
      this.selectingProperty.bind(this)
    );

    window.addEventListener("model-drop", (event) => {
      let { droppedText, mouse } = event.detail;
console.log('droppedText',droppedText);

      //  if (placeholder) {
      //    this.scene.remove(placeholder);
      //    placeholder = null;
      //  }

      let loader = new GLTFLoader();
      loader.load(
        droppedText,
        (gltf) => {
          let box = new THREE.Box3().setFromObject(gltf.scene);
          let size = new THREE.Vector3();
          box.getSize(size);

          let maxSize = Math.max(size.x, size.y, size.z);
          gltf.scene.scale.setScalar(1 / (maxSize / 2));

          let model = gltf.scene;

          let modelBox = new THREE.Box3().setFromObject(model);
          let minY = modelBox.min.y;

          let groundY = 0;

          model.position.y += groundY - minY;

          this.raycaster.setFromCamera(mouse, this.camera);
          let plane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);
          let intersectPoint = new THREE.Vector3();
          if (this.raycaster.ray.intersectPlane(plane, intersectPoint)) {
            model.position.x = intersectPoint.x;
            model.position.z = intersectPoint.z;
          }

          model.userData.name = "model";
          this.gltf.push(model);

          // this.bbBoxes.push(model);
          const saveModel = { gltfLink: droppedText, gltfScene: model.position };
          this.modelLoad.push(saveModel);
          console.log('saveModel',saveModel);

          this.scene.add(model);

        },
        undefined,
        (error) => {
          console.error("Error loading GLTF model:", error);
        }
      );
    });

    this.animate();
  }
  createListener() {
    if (!this.listenersActive) {
      this.startDrawing();
      this.listenersActive = true;
    } else {
      this.stopDrawing();
      this.listenersActive = false;
    }
  }

  startDrawing() {
    this.isDrawing = true;
    this.addListeners();
  }

  stopDrawing() {
    this.isDrawing = false;
    this.removeListeners();
  }

  addListeners() {
    if (!this.listenersActive) {
      this.renderer.domElement.addEventListener(
        "mousemove",
        this.onPointerMove
      );
      this.renderer.domElement.addEventListener("mousedown", this.onMouseDown);
      this.listenersActive = true;
    }
  }

  removeListeners() {
    this.renderer.domElement.addEventListener("click", this.mouseover);

    if (this.listenersActive) {
      this.renderer.domElement.removeEventListener(
        "mousemove",
        this.onPointerMove
      );
      this.renderer.domElement.removeEventListener(
        "mousedown",
        this.onMouseDown
      );
      this.listenersActive = false;
    }
  }

  updateCamera() {
    if (this.controls) {
      this.controls.dispose();
    }
    

    if (this.cam) {

      this.polygons.forEach((polygonGroup) => {
        polygonGroup.textMeshes.forEach((textMesh) => {
          this.scene.add(textMesh);
        });
        polygonGroup.spheres.forEach((sphere) => {
          this.scene.add(sphere);
        });
      });


      this.scene.background = new THREE.Color("white");
      this.scene.add(this.plane);
      this.objects.push(this.plane);
      this.scene.remove(this.gridHelper);

      let aspectRatio = window.innerWidth / window.innerHeight;
      let cameraSize = 5;
      this.camera = new THREE.OrthographicCamera(
        -cameraSize * aspectRatio,
        cameraSize * aspectRatio,
        cameraSize,
        -cameraSize,
        0.1,
        1000
      );

      this.gridSize = 100;
      this.gridHelper = new THREE.GridHelper(
        this.gridSize,
        100,
        0xaaaaaa,
        0xdddddd
      );
      this.scene.add(this.gridHelper);
    } else {
      this.RemoveGeometries();


      this.polygons.forEach((polygonGroup) => {
        polygonGroup.textMeshes.forEach((textMesh) => {
          this.scene.remove(textMesh);
          if (textMesh.geometry) textMesh.geometry.dispose();
          if (textMesh.material) textMesh.material.dispose();
        });
        polygonGroup.spheres.forEach((sphere) => {
          this.scene.remove(sphere);
          if (sphere.geometry) sphere.geometry.dispose();
          if (sphere.material) sphere.material.dispose();
        });
      });


      this.scene.remove(this.gridHelper);
      this.scene.remove(this.plane);
      this.objects.pop(this.plane);

      this.gridSize = 1000;
      this.gridHelper = new THREE.GridHelper(
        this.gridSize,
        100,
        0xaaaaaa,
        0xdddddd
      );
      this.scene.add(this.gridHelper);

      this.camera = new THREE.PerspectiveCamera(
        75,
        window.innerWidth / window.innerHeight,
        0.1,
        1000
      );
    }

    this.controls = new OrbitControls(this.camera, this.renderer.domElement);


    if (this.camera instanceof THREE.PerspectiveCamera) {
      this.controls.minDistance = 0.2;
      this.controls.maxDistance = 40;
      this.controls.minPolarAngle = 0;
      this.controls.maxPolarAngle = Math.PI * 0.5;
      this.camera.position.set(5, 5, 5);
      this.camera.updateProjectionMatrix();
    } else if (this.camera instanceof THREE.OrthographicCamera) {

      this.addCollisionDetection();

      this.camera.zoom = 1;
      this.controls.minZoom = 0.2;
      this.controls.maxZoom = 3.0;
      this.controls.enableZoom = true;
      this.controls.enableRotate = false;
      this.controls.enablePan = true;
      this.camera.position.y = 5;
      this.camera.updateProjectionMatrix();
    }

    this.camera.lookAt(0, 0, 0);
  }
  predefined(model) {
    if (model) {
      console.log('threee',model);
      model.forEach((eachModel)=>{
        this.controlPoints = eachModel;
        this.finalizePolygon(this.controlPoints);
      })
     
    } else {
      this.controlPoints = [
        { x: -5, y: 0, z: -3 },
        { x: 5, y: 0, z: -3 },
        { x: 5, y: 9, z: 3 },
        { x: -5, y: 0, z: 3 },
        { x: -5, y: 0, z: -3 },
      ];
      this.finalizePolygon(this.controlPoints);
    }
  }


// collisionForModels() {
//   const loader = new THREE.GLTFLoader();

//   loader.load('path_to_model.glb', (gltf) => {
//     const model = gltf.scene;
//     this.scene.add(model);
//     this.gltf.push(model);

//     // Initialize TransformControls
//     this.transformControls = new THREE.TransformControls(this.camera, this.renderer.domElement);
//     this.scene.add(this.transformControls);
//     this.transformControls.attach(model);
//     this.transformControls.enabled = true;

//     // Mouse events
//     this.renderer.domElement.addEventListener('mousemove', this.onMouseMove.bind(this));

//     let lastValidPosition = new THREE.Vector3();

//     // Handle dragging changes
//     this.transformControls.addEventListener('dragging-changed', (event) => {
//       if (event.value) {
//         this.controls.enabled = false; // Disable OrbitControls
//         lastValidPosition.copy(this.transformControls.object.position);
//       } else {
//         this.controls.enabled = true; // Re-enable OrbitControls
//       }
//     });

//     // Handle object changes
//     this.transformControls.addEventListener('objectChange', () => {
//       const draggedObject = this.transformControls.object;

//       // Check for collision with polygonGroup walls
//       const collidedWall = this.checkCollisionWithWalls(draggedObject, this.polygonGroup.walls);

//       if (collidedWall) {
//         console.log('Collision detected with a wall. Performing CSG operation.');

//         // Perform the CSG cut
//         this.performCSGCut(draggedObject, collidedWall);

//         // Update the scene with the new geometry
//         this.transformControls.detach(); // Detach control to avoid issues
//         lastValidPosition.copy(draggedObject.position); // Save valid position
//       } else {
//         lastValidPosition.copy(draggedObject.position); // Update last valid position
//       }
//     });
//   });
// }

// checkCollisionWithWalls(draggedObject, walls) {
//   const draggedBox = new THREE.Box3().setFromObject(draggedObject);

//   for (const wall of walls) {
//     const wallBox = new THREE.Box3().setFromObject(wall);
//     this.performCSGCut(draggedObject, wall);
//     if (draggedBox.intersectsBox(wallBox)) {
//       return wall; // Return the first collided wall
//     }
//   }
//   return null;
// }



 performCSGCut(draggedObject, wall) {
    
    const brush1 = new Brush(draggedObject.geometry);
    const brush2 = new Brush(wall.geometry);

    const evaluator = new Evaluator();
    const result = evaluator.evaluate(brush1, brush2, SUBTRACTION);

 
    const resultMesh = new THREE.Mesh(result.geometry); 
    
    this.scene.add(resultMesh);

    this.transformControls.attach(resultMesh);


    // this.scene.remove(wall);
}


  addTransformControlToGlobalArray(event) {
    const rect = this.renderer.domElement.getBoundingClientRect();

    this.mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    this.mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

    this.raycaster.setFromCamera(this.mouse, this.camera);

    const raycastTargets = [...this.globalArray, ...this.gltf];

    const intersects = this.raycaster.intersectObjects(raycastTargets, true);

    if (intersects.length > 0) {
      let intersectedObject = intersects[0].object;

      while (
        intersectedObject.parent &&
        !raycastTargets.includes(intersectedObject)
      ) {
        intersectedObject = intersectedObject.parent;
      }

      let box = new THREE.Box3().setFromObject(intersectedObject);
      let center = new THREE.Vector3();
      box.getCenter(center);

      this.transformControls.detach();
      this.transformControls.attach(intersectedObject);

      let gizmo = this.transformControls.getHelper();
      if (gizmo) {
        gizmo.position.copy(center);
        this.scene.add(gizmo);
      }
    } else {
      this.transformControls.detach();
    }
  }
  addCollisionDetection() {
    let lastValidPosition = new THREE.Vector3();
    this.renderer.domElement.addEventListener("click", (event) => {
      this.addTransformControlToGlobalArray(event);
    });
    if (!this.transformControls) return;


    this.transformControls.addEventListener("dragging-changed", (event) => {
      if (event.value) {
        this.controls.enabled = false;
        lastValidPosition.copy(this.transformControls.object.position);
      } else {
        this.controls.enabled = true;
      }
    });

    this.transformControls.addEventListener("objectChange", () => {
      const draggedObject = this.transformControls.object;

      const allObjects = [...this.globalArray, ...this.gltf];
      let collisionWithObjects;
      let collisionWithWalls;

      if ((draggedObject.userData.name = "model")) {
        collisionWithWalls = this.checkCollisionWithWalls(
          draggedObject,
          this.bbBoxes
        );
      } else {
        collisionWithObjects = this.checkCollisionWithObjects(
          draggedObject,
          allObjects
        );
      }

      if (collisionWithWalls || collisionWithObjects) {
       

        draggedObject.position.copy(lastValidPosition);
      } else {
        lastValidPosition.copy(draggedObject.position);
      }
    });
  }


  onMouseMove(event, lastValidPosition) {
    console.log(event);
    const rect = this.renderer.domElement.getBoundingClientRect();
    this.mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    this.mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

    this.raycaster.setFromCamera(this.mouse, this.camera);

    const intersects = this.raycaster.intersectObjects(this.scene.children, true);

    if (intersects.length > 0) {
      const intersectedObject = intersects[0].object;
      console.log(intersectedObject);
      
  

      if (this.transformControls.object !== intersectedObject) {
          	this.transformControls.attach(intersectedObject);
            const gizmo = this.transformControls.getHelper();
            this.scene.add(gizmo);
      }
    } else {
      this.transformControls.detach();
    }
  }

  updateBoundingBoxes(globalArray, boundingBoxArray) {
    globalArray.forEach((group, index) => {
      const box = new THREE.Box3().setFromObject(group);
      boundingBoxArray[index] = box;
    });
  }

  checkGroupCollisionWithWalls(draggedGroup, boundingWalls) {
    const draggedBox = new THREE.Box3().setFromObject(draggedGroup);

    let boundingWallsBox = new THREE.Box3();
    boundingWalls.forEach((wall) => {
      const wallBox = new THREE.Box3().setFromObject(wall);
      boundingWallsBox.union(wallBox);
    });

    return !boundingWallsBox.containsBox(draggedBox);
  }

  checkGroupCollisionWithGlobalObjects(
    draggedGroup,
    globalArray,
    boundingBoxArray
  ) {
    const draggedBox = new THREE.Box3().setFromObject(draggedGroup);

    for (let i = 0; i < globalArray.length; i++) {
      const otherGroup = globalArray[i];
      if (otherGroup === draggedGroup) continue;

      const otherBox = boundingBoxArray[i];

      const expandedBox = otherBox.clone().expandByScalar(0.001);

      if (draggedBox.intersectsBox(expandedBox)) {
        return true;
      }
    }

    return false;
  }

  mesh() {
    this.gridHeight = 1000;
    this.gridWidth = 1000;
    this.plane = new THREE.Mesh(
      new THREE.PlaneGeometry(this.gridHeight, this.gridWidth)
    );
    this.plane.rotation.x = -Math.PI / 2;
    this.plane.position.y = -0.1;
    this.plane.receiveShadow = true;
    this.scene.add(this.plane);
  }

  selectingProperty(e) {
    const rect = this.renderer.domElement.getBoundingClientRect();
    this.mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    this.mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
    this.raycaster.setFromCamera(this.mouse, this.camera);
    this.intersectObject=[]
    
    
    this.polygons.forEach((polygonGroup) => {
      polygonGroup.walls.forEach((wall) => {
          this.intersectObject.push(wall);
      })
    });
    console.log(this.intersectObject);
    
      this.intersects = this.raycaster.intersectObjects(this.intersectObject);
      if (this.intersects.length > 0) {
        this.INTERSECTED = this.intersects[0].object;
        if (this.INTERSECTED) {
          store.commit("wall", e);

          this.INTERSECTED.material[2] = new THREE.MeshBasicMaterial({
            color: "green",
          });
        } else {
          this.INTERSECTED.material[2] = new THREE.MeshLambertMaterial({
            color: 0x3b3b3b,
          });
        }
      }
   
  }
  AddTexture(texture) {
    let textures = new THREE.TextureLoader().load(texture);
    if (this.intersects.length > 0) {
      console.log(texture);
      
      this.INTERSECTED = this.intersects[0].object;
  
      this.INTERSECTED.material[4] = new THREE.MeshLambertMaterial({
        map: textures,
      });
          console.log(this.INTERSECTED.material);
      
    }
  }
  AddVertices() {
    if (this.intersects.length > 0) {
   
      this.INTERSECTED = this.intersects[0].object;
      let point=this.intersects[0].point.clone();
       let cp = new THREE.Mesh(
         new THREE.SphereGeometry(0.2, 20, 20),
         new THREE.MeshBasicMaterial({
           color: "blue",
           transparent: true,
           opacity: 0.3,
         })
       );
       cp.position.copy(point);
      this.scene.add(cp);
       this.polygons.forEach((polygonGroup) => {
         polygonGroup.spheres.push(cp);
       });
    }
  }
  removeTheWall() {
    if (this.intersects.length > 0) {
      this.INTERSECTED = this.intersects[0].object;
      this.group.remove(this.INTERSECTED)
      
    }
  }
  AddTextureToOutdoor(texture) {
    let textures = new THREE.TextureLoader().load(texture);
    if (this.intersects.length > 0) {
      this.INTERSECTED = this.intersects[0].object;
      this.INTERSECTED.material[4] = new THREE.MeshLambertMaterial({
        map: textures,
      });
    }
  }

  meshSelect(e) {
    const rect = this.renderer.domElement.getBoundingClientRect();
    this.mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    this.mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
    this.raycaster.setFromCamera(this.mouse, this.camera);
    this.intersects = this.raycaster.intersectObjects(this.globalArray);

    if (this.intersects.length > 0) {
    }
  }

  raycastDefined(e) {
    const rect = this.renderer.domElement.getBoundingClientRect();
    this.mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    this.mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
    this.raycaster.setFromCamera(this.mouse, this.camera);

    this.intersects = this.raycaster.intersectObjects(this.objects);
  }
  onPointerMove(e) {
    if (!this.isDrawing) return;

    this.raycastDefined(e);

    if (this.intersects.length > 0) {
      let point = this.intersects[0].point.clone();

      let snapThreshold = 1;
      let snappedPoint = this.findNearestPoint(point, snapThreshold);

      if (snappedPoint) {
        this.updateTemporaryLine(snappedPoint);
      } else {
        this.updateTemporaryLine(point);
      }
      this.updateMeasurementLabels();
    }
  }

  onMouseDown(e) {
    if (!this.isDrawing) return;

    this.raycastDefined(e);

    if (this.intersects.length > 0) {
      let point = this.intersects[0].point.clone();
      if (
        this.controlPoints.length > 0 &&
        point.distanceTo(this.controlPoints[0]) < 1
      ) {
        point.copy(this.controlPoints[0]);
        this.controlPoints.push(point);
        this.addControlPoint(point);
        this.addLine(this.controlPoints[this.controlPoints.length - 2], point);
        this.finalizePolygon();
        this.stopDrawing();
        this.getImageData = true;
      } else {
        this.controlPoints.push(point);
        this.addControlPoint(point);
        if (this.controlPoints.length > 1) {
          this.addLine(
            this.controlPoints[this.controlPoints.length - 2],
            point
          );
        }
      }
    }
  }

  findNearestPoint(currentPoint, threshold) {
    for (let i = 0; i < this.controlPoints.length; i++) {
      if (currentPoint.distanceTo(this.controlPoints[i]) < threshold) {
        return this.controlPoints[i];
      }
    }
    return null;
  }
  mouseover(e) {
    this.raycastDefined(e);

    this.disableDragControls();
    // this.disposeDragControls();


    if (this.intersects.length > 0) {
      if (!this.dragcontrols) {
        this.setupDragControls();
      }
    }
  }


  disableDragControls() {
    if (this.dragControls) {
      this.dragControls.enabled = false;
    }
  }


  setupDragControls() {
    this.dragControls = new DragControls(
      // ...this.polygonGroup.walls,
      [...this.polygonGroup.spheres],
      this.camera,
      this.renderer.domElement
    );

    this.dragControls.addEventListener("dragstart", (event) => {
      this.controls.enabled = false;
    });

    this.dragControls.addEventListener("drag", (event) => {
      let draggedObject = event.object;

      // if (this.polygons.some((group) => group.walls.includes(draggedObject))) {
      //   // this.onWallDrag(draggedObject);;
      // } else {
      this.onControlPointDrag(draggedObject);
      // }
    });

    this.dragControls.addEventListener("dragend", (event) => {
      this.controls.enabled = true;
    });
  }

  onControlPointDrag(sphere) {
    const index = sphere.userData.index;

    const polygonGroup = this.polygons.find((group) =>
      group.spheres.includes(sphere)
    );

    if (polygonGroup) {
      polygonGroup.controlPoints[index].copy(sphere.position);

      if (index === 0 || index === polygonGroup.controlPoints.length - 1) {
        const firstPoint = polygonGroup.controlPoints[0];
        const lastPoint =
          polygonGroup.controlPoints[polygonGroup.controlPoints.length - 1];

        if (index === 0) {
          lastPoint.copy(firstPoint);
          polygonGroup.spheres[polygonGroup.spheres.length - 1].position.copy(
            firstPoint
          );
        } else if (index === polygonGroup.controlPoints.length - 1) {
          firstPoint.copy(lastPoint);
          polygonGroup.spheres[0].position.copy(lastPoint);
        }
      }

      this.updatePolygonMesh(polygonGroup);
      this.updateLinesInGroup(polygonGroup);
      this.updateWallsInGroup(polygonGroup);
      this.updateTextMeshesInGroup(polygonGroup);
    }
  }

  updatePolygonMesh(polygonGroup) {
    if (!polygonGroup.polygonMesh) {
      return;
    }

    const controlPoints = polygonGroup.controlPoints;

    const shape = new THREE.Shape();
    shape.moveTo(controlPoints[0].x, controlPoints[0].z);
    for (let i = 1; i < controlPoints.length; i++) {
      shape.lineTo(controlPoints[i].x, controlPoints[i].z);
    }

    const geometry = new THREE.ShapeGeometry(shape);
    geometry.rotateX(Math.PI / 2);

    polygonGroup.polygonMesh.geometry.dispose();
    polygonGroup.polygonMesh.geometry = geometry;

    geometry.computeVertexNormals();
    geometry.computeBoundingBox();
    geometry.computeBoundingSphere();
  }
  updateLinesInGroup(polygonGroup) {
    polygonGroup.controlPoints.forEach((point1, i) => {
      let point2 =
        i < polygonGroup.controlPoints.length - 1
          ? polygonGroup.controlPoints[i + 1]
          : polygonGroup.controlPoints[0];

      let line = polygonGroup.lines[i];

      if (!line) {
        let geometry = new THREE.BufferGeometry().setFromPoints([
          point1,
          point2,
        ]);
        let material = new THREE.LineBasicMaterial({ color: 0x0000ff });
        line = new THREE.Line(geometry, material);
        polygonGroup.lines[i] = line;
        this.scene.add(line);
      } else {
        line.geometry.setFromPoints([point1, point2]);
        line.geometry.attributes.position.needsUpdate = true;
      }
    });
  }

  updateWallsInGroup(polygonGroup) {
    let height = 2;
    let thickness = 0.1;

    polygonGroup.controlPoints.forEach((point1, i) => {
      let point2 =
        i < polygonGroup.controlPoints.length - 1
          ? polygonGroup.controlPoints[i + 1]
          : polygonGroup.controlPoints[0];

      let wall = polygonGroup.walls[i];

      if (!wall) {
        let length = point1.distanceTo(point2);
        let geometry = new THREE.BoxGeometry(length + 0.08, height, thickness);
        let material = [
          new THREE.MeshLambertMaterial({ color: 0x3b3b3b }),
          new THREE.MeshLambertMaterial({ color: 0x3b3b3b }),
          new THREE.MeshLambertMaterial({ color: 0x3b3b3b }),
          new THREE.MeshLambertMaterial({ color: 0x3b3b3b }),
          new THREE.MeshLambertMaterial({ color: 0xaaaaaa }),
          new THREE.MeshLambertMaterial({ color: "white" }),
        ];
        wall = new THREE.Mesh(geometry, material);
        polygonGroup.walls[i] = wall;
        this.scene.add(wall);
      }

      let length = point1.distanceTo(point2);
      let midpoint = new THREE.Vector3()
        .addVectors(point1, point2)
        .divideScalar(2);

      wall.position.copy(midpoint);

      wall.lookAt(point2);
      wall.position.y = 1;

      wall.geometry.dispose();
      wall.geometry = new THREE.BoxGeometry(length + 0.08, height, thickness);
      wall.geometry.rotateY(Math.PI / 2);
    });
  }
  updateTextMeshesInGroup(polygonGroup) {
    this.textMeshes.forEach((textMesh) => {
      this.scene.remove(textMesh);
      if (textMesh.geometry) textMesh.geometry.dispose();
      if (textMesh.material) textMesh.material.dispose();
    });


    polygonGroup.textMeshes.forEach((textMesh) => {
      this.scene.remove(textMesh);
      if (textMesh.geometry) textMesh.geometry.dispose();
      if (textMesh.material) textMesh.material.dispose();
    });

    this.textMeshes = [];

    for (let i = 0; i < polygonGroup.controlPoints.length; i++) {
      let point1 = polygonGroup.controlPoints[i];
      let point2 =
        i < polygonGroup.controlPoints.length - 1
          ? polygonGroup.controlPoints[i + 1]
          : polygonGroup.controlPoints[0];

      this.addMeasurementLabel(point1, point2);
    }
  }

  AddGeometries() {
    this.spheres.forEach((sphere) => {
      this.scene.add(sphere);
    });

    this.lines.forEach((line) => {
      this.scene.add(line);
    });
    this.textMeshes.forEach((textMesh) => {
      this.scene.add(textMesh);
    });
  }
  RemoveGeometries() {
    this.spheres.forEach((sphere) => {
      this.scene.remove(sphere);
    });

    this.lines.forEach((line) => {
      this.scene.remove(line);
    });
    this.textMeshes.forEach((textMesh) => {
      this.scene.remove(textMesh);
    });
  }

  addControlPoint(point) {
    let cp = new THREE.Mesh(
      new THREE.SphereGeometry(0.2, 20, 20),
      new THREE.MeshBasicMaterial({
        color: "blue",
        transparent: true,
        opacity: 0.3,
      })
    );
    cp.position.copy(point);
    this.scene.add(cp);
    this.spheres.push(cp);
    cp.userData.index = this.controlPoints.length - 1;
  }

  finalizePolygon() {
    if (this.controlPoints.length < 3) return;

    this.group = new THREE.Group();

    let shape = new THREE.Shape();
    shape.moveTo(this.controlPoints[0].x, this.controlPoints[0].z);
    for (let i = 1; i < this.controlPoints.length; i++) {
      shape.lineTo(this.controlPoints[i].x, this.controlPoints[i].z);
    }


    let loader = new THREE.TextureLoader();
    let texture = loader.load("./images/download.jpg", () => {
      texture.wrapS = THREE.RepeatWrapping;
      texture.wrapT = THREE.RepeatWrapping; 
      texture.repeat.set(1, 1);
    });

    let geometry = new THREE.ShapeGeometry(shape);
    geometry.rotateX(Math.PI / 2);
    let material = new THREE.MeshBasicMaterial({

      // color: texture,
      color: "lightblue",

      side: THREE.DoubleSide,
    });

    this.polygonMesh = new THREE.Mesh(geometry, material);
    this.polygonMesh.position.y = 0.01;
    this.polygonMesh.receiveShadow = true;
    this.group.add(this.polygonMesh);

    this.polygonGroup = {
      spheres: [...this.spheres],
      lines: [...this.lines],
      walls: [...this.walls],
      textMeshes: [...this.textMeshes],
      controlPoints: [...this.controlPoints],
      polygonMesh: this.polygonMesh,
    };

    this.polygons.push(this.polygonGroup);
    this.threeDimension();
    // this.ceil(geometry);
    this.walls.forEach((wall) => {
      this.group.add(wall);
      this.scene.remove(wall);
    });

    this.globalArray.push(this.group);
    this.scene.add(this.group);

    this.mainArray.push(this.controlPoints);
    this.spheres = [];
    this.lines = [];
    this.walls = [];
    this.textMeshes = [];
    this.controlPoints = [];
  }

  blob() {
    let data = this.dataURL;

    var link = document.createElement("a");
    link.download = "demo.png";
    link.href = data;
    link.target = "_blank";
  }

  ceil(geometry) {
    let loader = new THREE.TextureLoader();
    let texture = loader.load("./images/ceil.jpeg", () => {
      texture.wrapS = THREE.RepeatWrapping;
      texture.wrapT = THREE.RepeatWrapping;
      texture.repeat.set(1, 1);
    });
    let material = new THREE.MeshBasicMaterial({
      map: texture,
      side: THREE.FrontSide,
    });

    let ceil = new THREE.Mesh(geometry, material);
    ceil.position.y = 2;
    this.scene.add(ceil);
    this.group.add(ceil);
  }

  updateTemporaryLine(newPoint) {
    if (this.tempLine) {
      this.updateExistingTemporaryLine(newPoint);
    } else {
      this.createNewTemporaryLine(newPoint);
    }
  }

  createNewTemporaryLine(newPoint) {
    let points = [
      this.controlPoints[this.controlPoints.length - 1].x,
      this.controlPoints[this.controlPoints.length - 1].y + 0.5,
      this.controlPoints[this.controlPoints.length - 1].z,
      newPoint.x,
      newPoint.y + 0.5,
      newPoint.z,
    ];

    let geometry = new LineGeometry();
    geometry.setPositions(points);

    let material = new LineMaterial({
      color: "blue",
      transparent: true,
      opacity: 0.5,
      linewidth: 10,
      resolution: new THREE.Vector2(this.width, this.height),
    });

    this.tempLine = new Line2(geometry, material);
    this.tempLine.computeLineDistances();
    this.scene.add(this.tempLine);

    this.addMeasurementLabel(
      this.controlPoints[this.controlPoints.length - 1],
      newPoint
    );
  }

  updateExistingTemporaryLine(newPoint) {
    let points = [
      this.controlPoints[this.controlPoints.length - 1].x,
      this.controlPoints[this.controlPoints.length - 1].y + 0.5,
      this.controlPoints[this.controlPoints.length - 1].z,
      newPoint.x,
      newPoint.y + 0.5,
      newPoint.z,
    ];

    this.tempLine.geometry.setPositions(points);

    this.tempLine.geometry.attributes.position.needsUpdate = true;

    this.addMeasurementLabel(
      this.controlPoints[this.controlPoints.length - 1],
      newPoint
    );
  }
  addMeasurementLabel(point1, point2) {
    let distance = point1.distanceTo(point2).toFixed(2);
    let loader = new FontLoader();

    loader.load(
      "https://threejs.org/examples/fonts/helvetiker_regular.typeface.json",
      (font) => {
        let textGeometry = new TextGeometry(distance, {
          font: font,
          size: 0.2,
          depth: 0.01,
        });
        textGeometry.rotateX(-Math.PI / 2);
        let textMaterial = new THREE.MeshBasicMaterial({ color: "black" });
        let textMesh = new THREE.Mesh(textGeometry, textMaterial);

        let midpoint = new THREE.Vector3()
          .addVectors(point1, point2)
          .divideScalar(2);
        textMesh.position.set(midpoint.x, 0.3, midpoint.z);
        textMesh.userData.length = distance;
        this.scene.add(textMesh);

        this.textMeshes.push(textMesh);
      }
    );
  }

  addLine(point1, point2) {
    let positions = [];
    positions.push(point1.x, point1.y, point1.z);
    positions.push(point2.x, point2.y, point2.z);

    let geometry = new LineGeometry();
    geometry.setPositions(positions);
    let goodMaterial = new LineMaterial({
      color: "grey",
      linewidth: 10,
      resolution: new THREE.Vector2(this.width, this.height),
    });

    let line = new Line2(geometry, goodMaterial);
    line.computeLineDistances();
    this.scene.add(line);
    this.lines.push(line);

    this.addMeasurementLabel(point1, point2);
  }
  updateMeasurementLabels() {
    this.textMeshes.forEach((textMesh) => this.scene.remove(textMesh));
    this.textMeshes = [];

    for (let i = 0; i < this.controlPoints.length - 1; i++) {
      this.addMeasurementLabel(
        this.controlPoints[i],
        this.controlPoints[i + 1]
      );
    }
  }

  threeDimension() {
    let point1 = new THREE.Vector3();
    let point2 = new THREE.Vector3();
    let height = 2;
    let thickness = 0.15;

    for (let i = 0; i < this.controlPoints.length - 1; i++) {
      point1.set(this.controlPoints[i].x, 1, this.controlPoints[i].z);
      point2.set(this.controlPoints[i + 1].x, 1, this.controlPoints[i + 1].z);

      let length = point1.distanceTo(point2);
      let direction = new THREE.Vector3()
        .subVectors(point2, point1)
        .normalize();
      let loader = new THREE.TextureLoader();
      let texture = loader.load("./images/bric.jpg", () => {
        texture.wrapS = THREE.RepeatWrapping;
        texture.wrapT = THREE.RepeatWrapping;
        texture.repeat.set(1, 1);
      });
      let geometry = new THREE.BoxGeometry(length + 0.13, height, thickness);
      let material = [
        new THREE.MeshLambertMaterial({ color: 0x3b3b3b }),
        new THREE.MeshLambertMaterial({ color: 0x3b3b3b }),
        new THREE.MeshLambertMaterial({ color: 0x3b3b3b }),
        new THREE.MeshLambertMaterial({ color: 0x3b3b3b }),
        new THREE.MeshLambertMaterial({
          map: texture,
        }),
        new THREE.MeshLambertMaterial({ color: "white" }),
      ];
      geometry.rotateY(Math.PI / 2);

      let wall = new THREE.Mesh(geometry, material);

      let midpoint = new THREE.Vector3()
        .addVectors(point1, point2)
        .divideScalar(2);

      wall.position.copy(midpoint);

      wall.lookAt(point2);
      this.scene.add(wall);
      this.bbBoxes.push(wall);
      this.walls.push(wall);

      this.polygonGroup.walls.push(wall);
    }

    this.scene.remove(this.tempLine);
    this.tempLine = null;

    this.addLight();
  }

  addLight() {
    let box = new THREE.Box3().setFromObject(this.polygonMesh);
    let size = new THREE.Vector3();
    box.getSize(size);

    let centre = box.getCenter(new THREE.Vector3());
    let spotlight = new THREE.PointLight("white", size.x + size.y + size.z, 4);
    spotlight.position.set(centre.x, centre.y + 1, centre.z);
    let helper = new THREE.PointLightHelper(spotlight);
    // this.scene.add(helper);
    this.scene.add(spotlight);
    this.group.add(spotlight);
  }

  gltfLoader(modelLink,modelArea) {
    console.log('modelArea',modelArea);
    console.log('modelLink',modelLink);


    const loader = new GLTFLoader();
    loader.load(modelLink, (gltf) => {
      this.box = new THREE.Box3().setFromObject(gltf.scene);
      let size = new THREE.Vector3();
      this.box.getSize(size);
      let maxSize = 0;
      if (size.x >= size.z && size.x >= size.y) {
        maxSize = size.x;
      } else if (size.y >= size.x && size.y >= size.z) {
        maxSize = size.y;
      } else if (size.z >= size.x && size.z >= size.y) {
        maxSize = size.z;
      }
      gltf.scene.scale.setScalar(1 / (maxSize / 2));

      this.gltf.push(gltf.scene);
      gltf.scene.position.set(modelArea.x,modelArea.y,modelArea.z);


      this.scene.add(gltf.scene);
    });
  }
  // async saveFile(projectname) {
  //   const saveModel = {
  //     projectname: projectname,
  //     coordinates: this.mainArray,
  //     gltfObjects: this.modelLoad,
  //   };
  //   store.commit("setTriggerMethod", saveModel);
  // }

  async saveFile(projectname, userName) {
    const saveModel = {
      username: userName,
      projectName: projectname,
      coordinates: this.mainArray,
      gltfObjects: this.modelLoad,
    };
    store.commit("setTriggerMethod", saveModel);

    this.mainArray = [];
    this.modelLoad = [];
  }

  animate() {
    requestAnimationFrame(() => this.animate());
    // this.controls.update();
    // this.transformControls.update();
    this.render();
    if (this.getImageData == true) {
      
      this.dataURL = this.renderer.domElement.toDataURL();

      this.blob();
      this.getImageData = false;
    }
  }

  render() {
    this.renderer.render(this.scene, this.camera);
  }
}
