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
import { CSG } from "three-csg-ts";
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
    this.bbBoxes = [];
    this.plane = null;
    this.controls = null;
    this.material
    this.gltfbox;
    this.spheres = [];
    this.walls = [];
    this.gridSize = 100;
    this.lines = [];
    this.helper;
    this.textMeshes = [];
    this.tempLine = null;
    this.Dragcontrols = null;
    this.isDrawing = false;
    this.gltf = [];
    this.getImageData = false;
    this.wallGeo;
    this.draggedobjects;
    this.dragObjects = [];
    this.mainArray = [];
    this.modelLoad = [];
    this.globalArray = [];
    this.group;
    this.polygons = [];
    this.polygonGroup;
    this.height = 4;
    this.thickness = 0.2;
    this.angle
    this.originalWallGeometries
    this.originalWallGeometries = {
      horizontal: null,
      vertical: null,
    };
  
this.originalWalls = new Map(); // Track the original wall objects
this.activeWall = null; 


    

    this.onPointerMove = this.onPointerMove.bind(this);
    this.onMouseDown = this.onMouseDown.bind(this);
    this.mouseover = this.mouseover.bind(this);
    this.onPointerDown = this.onPointerDown.bind(this);
    this.onPointerUp = this.onPointerUp.bind(this);
    this.isDragging = false;
    this.draggedObject = null;

    this.init();
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
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.renderer.physicallyCorrectLights = true;
    this.renderer.setSize(
      this.container.clientWidth,
      this.container.clientHeight
    );
    this.container.appendChild(this.renderer.domElement);
    

    this.light = new THREE.AmbientLight(0xffffff);
    this.scene.add(this.light);
    let dir = new THREE.DirectionalLight("white",2);
    // let dirhel = new THREE.DirectionalLightHelper(dir,1,"red");
    dir.position.set(-7,5,0)
    dir.castShadow=true
    // this.scene.add(dirhel);
    this.scene.add(dir);


    
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

   let placeholder;
      let angleX;
      window.addEventListener("model-drag-start", (event) => {
        this.camera.position.set(0,10,0)
        const { droppedText, mouse } = event.detail;

          const filePath = droppedText.match(/"filePath":"(.*?)"/)?.[1];
                    
        const loader = new GLTFLoader();
        loader.load(
          filePath,
          (gltf) => {
            if (placeholder) {
              this.scene.remove(placeholder);
            }
      
            placeholder = gltf.scene;
                 this.gltfbox = new THREE.Box3().setFromObject(gltf.scene);
              this.size = new THREE.Vector3();
              this.center = new THREE.Vector3();
              this.gltfbox.getSize(this.size);
              this.gltfbox.getCenter(this.center);
  
              let maxSize = Math.max(this.size.x, this.size.y, this.size.z);
              gltf.scene.scale.setScalar(1 / (maxSize / 2));
              gltf.scene.traverse((node) => {
                if (node.isMesh) {
                  node.castShadow = true;
                  node.receiveShadow = true;
                }
              });  
      
            let box = new THREE.Box3().setFromObject(placeholder);
            let size = new THREE.Vector3();
            box.getSize(size);
      
            // let maxSize = Math.max(size.x, size.y, size.z);
            // placeholder.scale.setScalar(1 / (maxSize / 4));
      
            this.raycaster.setFromCamera(mouse, this.camera);
            const plane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);
            const intersectPoint = new THREE.Vector3();
            if (this.raycaster.ray.intersectPlane(plane, intersectPoint)) {
              // placeholder.position.copy(intersectPoint);
                    const adjustedBox = new THREE.Box3().setFromObject(placeholder);
                    const adjustedSize = new THREE.Vector3();
                    const adjustedCenter = new THREE.Vector3();
                    adjustedBox.getSize(adjustedSize);
                    adjustedBox.getCenter(adjustedCenter);

                    const bottomY = adjustedBox.min.y;
                    const offsetY = -bottomY;
                    //offsetY-(-this.groundValue)-1
                    placeholder.position.set(intersectPoint.x, offsetY-3, intersectPoint.z);
          
            }
            this.scene.add(placeholder);
          },
          undefined,
          (error) => {
            console.error("Error loading GLTF model:", error);
          }
        );
      });
      
      window.addEventListener("model-drag-move", (event) => {
        const { mouse } = event.detail;
        const dampingFactor = 1.2;
        if (placeholder) {
            if (!placeholder.userData.lastValidPosition) {
                if (!this.roomBox || this.group.needsUpdate) {
                    this.roomBox = new THREE.Box3().setFromObject(this.group);
                }
                this.roomBox.clampPoint(placeholder.position, placeholder.position);
                placeholder.userData.lastValidPosition = placeholder.position.clone();
            }
    
            this.raycaster.setFromCamera(mouse, this.camera);
            const plane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);
            const intersectPoint = new THREE.Vector3();
    
            if (this.raycaster.ray.intersectPlane(plane, intersectPoint)) {
                placeholder.position.set(intersectPoint.x, intersectPoint.y - 2.5, intersectPoint.z);
                this.roomBox.clampPoint(placeholder.position, placeholder.position); 
                const placeholderBox = new THREE.Box3().setFromObject(placeholder);
                let isIntersectingWall = false;
    
                this.bbBoxes.forEach((wall) => {
                    if (wall && wall.geometry) {
                        const wallBox = new THREE.Box3().setFromObject(wall);
                        if (wallBox.intersectsBox(placeholderBox)) {
                            isIntersectingWall = true;
                        }
                    }
                });
                if (isIntersectingWall) {

                  if(placeholder.position.z > placeholder.position.x){
                    angleX = Math.abs(placeholder.position.z) > Math.abs(placeholder.position.x) ? -Math.PI / 2 : -Math.PI;
                    placeholder.rotation.set(0, angleX, 0);
                   
                  }
                  else{
                    angleX = Math.abs(placeholder.position.z) > Math.abs(placeholder.position.x) ? Math.PI / 2 : 0;
                    placeholder.rotation.set(0, angleX, 0); 
                         
                  }
                    placeholder.position.lerp(placeholder.userData.lastValidPosition, dampingFactor);
                    if (this.placeholderBoxHelper) {
                        this.placeholderBoxHelper.material.color.set(0xff0000); 
                    }
                } else {
                    placeholder.userData.lastValidPosition.copy(placeholder.position);
                    this.roomBox.clampPoint(placeholder.position, placeholder.position); 
    
                    if (this.placeholderBoxHelper) {
                        this.scene.remove(this.placeholderBoxHelper);
                    }
                    this.placeholderBoxHelper = new THREE.Box3Helper(placeholderBox, 0x00ff00);
                    this.scene.add(this.placeholderBoxHelper);
                }
            }
        }
    });
    
    
    window.addEventListener("model-drop", (event) => {
      this.scene.remove(this.placeholderBoxHelper); 
      const { droppedText, mouse } = event.detail;
    
      let finalPosition = null;
      if (placeholder) {
        finalPosition = placeholder.position.clone();
        this.scene.remove(placeholder);
        placeholder = null;
      }
    
      let ceiling = null;
      const loader = new GLTFLoader();
      loader.load(
        droppedText.filePath,
        (gltf) => {
          gltf.scene.userData.name = droppedText.variant;
          if (droppedText.variant === "Top") {
            ceiling = +3;
          } else {
            ceiling = -3;
          }
    
          this.gltfbox = new THREE.Box3().setFromObject(gltf.scene);
          this.size = new THREE.Vector3();
          this.center = new THREE.Vector3();
          this.gltfbox.getSize(this.size);
          this.gltfbox.getCenter(this.center);
    
          let maxSize = Math.max(this.size.x, this.size.y, this.size.z);
          gltf.scene.scale.setScalar(1 / (maxSize / 2));
          gltf.scene.traverse((node) => {
            if (node.isMesh) {
              node.castShadow = true;
              node.receiveShadow = true;
            }
          });
    
          const model = gltf.scene;
          model.rotation.set(0, angleX, 0);
          this.angle = model.rotation;
    
          const floorBox = new THREE.Box3().setFromObject(this.polygonMesh);
          const floorHeight = floorBox.max.y;
    
          this.raycaster.setFromCamera(mouse, this.camera);
          const plane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);
          const intersectPoint = new THREE.Vector3();
    
          if (this.raycaster.ray.intersectPlane(plane, intersectPoint)) {
            const adjustedBox = new THREE.Box3().setFromObject(model);
            const bottomY = adjustedBox.min.y; 
            const offsetY = floorHeight - bottomY + ceiling;
    
            if (finalPosition) {
              model.position.set(finalPosition.x, offsetY, finalPosition.z);
              this.roomBox.clampPoint(model.position, model.position);
            } else {
              model.position.set(intersectPoint.x, offsetY, intersectPoint.z);
              this.roomBox.clampPoint(model.position, model.position);
            }
          }
          model.receiveShadow=true
          model.castShadow=true
    
          this.gltf.push(model);
          this.scene.add(model);
        },
        undefined,
        (error) => {
          console.error("Error loading GLTF model:", error);
        }
      );
    });




      const loader = new GLTFLoader();
      loader.load(
        "./door.glb",
        (gltf) => {
            this.gltfbox = new THREE.Box3().setFromObject(gltf.scene);
              this.size = new THREE.Vector3();
              this.center = new THREE.Vector3();
              this.gltfbox.getSize(this.size);
              this.gltfbox.getCenter(this.center);
              gltf.scene.userData.name="Middle"
  
              let maxSize = Math.max(this.size.x, this.size.y, this.size.z);
          gltf.scene.scale.setScalar(1 / (maxSize / 3));
          gltf.scene.receiveShadow=true
          gltf.scene.castShadow=true
          this.gltf.push(gltf.scene);
          console.log(gltf.scene.children[0].children[0].children[0].children);
          gltf.scene.children[0].children[0].children[0].children[0].children[0].material.color.set("blue")
          
          this.scene.add(gltf.scene);
        })
    this.addCollisionDetection();
    this.animate();
  }
  MouseOverForBox(event) {
        const rect = this.renderer.domElement.getBoundingClientRect();

    this.mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    this.mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

    this.raycaster.setFromCamera(this.mouse, this.camera);
     const raycastTargets = [...this.globalArray, ...this.gltf];

    const intersects = this.raycaster.intersectObjects(this.gltf, true);

    if (intersects.length > 0) {
      let intersectedObject = intersects[0].object;
      const objectBox = new THREE.Box3().setFromObject(intersectedObject);
      helper = new THREE.Box3Helper(objectBox);
      this.scene.add(this.helper);
    }
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
      // this.renderer.domElement.addEventListener(
      //   "mousemove",
      //   this.onPointerMove
      // );
      // this.renderer.domElement.addEventListener("mousedown", this.onMouseDown);
       this.renderer.domElement.addEventListener('mousedown',this.onPointerDown);
    this.renderer.domElement.addEventListener('mouseup',  this.onPointerUp);
      this.listenersActive = true;
    }
  }

  removeListeners() {
       this.renderer.domElement.addEventListener("click", (event) => {
        this.MouseOverForBox(event);
    });
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
    this.controls.autoRotateSpeed  =0.5
    this.controls.enableDamping=true

    if (this.camera instanceof THREE.PerspectiveCamera) {
      this.controls.minDistance = 0.2;
      this.controls.maxDistance = 40;
      this.controls.minPolarAngle = 0;
      this.controls.maxPolarAngle = Math.PI * 0.5;
      this.camera.position.set(5, 5, 5);
      this.camera.updateProjectionMatrix();
    } else if (this.camera instanceof THREE.OrthographicCamera) {
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
      this.controlPoints = model;
      this.finalizePolygon(this.controlPoints);
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

  onPointerDown(e) {
  // console.log("fg");
  
  // if (!this.isDrawing) return;

  this.raycastDefined(e);
  

  if (this.intersects.length > 0) {
    let point = this.intersects[0].point.clone();
    this.startPoint = point; // Store the starting point
    this.isCreatingRectangle = true;
  }
}

onPointerUp(e) {
  // if ( !this.isCreatingRectangle) return;

  this.raycastDefined(e);

  if (this.intersects.length > 0) {
    let point = this.intersects[0].point.clone();
    this.endPoint = point; // Store the ending point
    this.createRectangleWall(this.startPoint, this.endPoint);
    this.isCreatingRectangle = false;
  }
}

createRectangleWall(startPoint, endPoint) {
  let width = Math.abs(endPoint.x - startPoint.x);
  let height = Math.abs(endPoint.y - startPoint.y);
  let depth = Math.abs(endPoint.z - startPoint.z);

  // Create geometry
  let geometry = new THREE.BoxGeometry(width, this.height, depth);
  let loader = new THREE.TextureLoader();
  let texture = loader.load("./images/images.jpg", () => {
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(1, 1);
  });
  // let material = new THREE.MeshBasicMaterial({ map: texture });
   let material = [
        new THREE.MeshMatcapMaterial({transparent: true,opacity: 0.5}),
        new THREE.MeshMatcapMaterial({ transparent: true,opacity: 0.5,}),
        new THREE.MeshMatcapMaterial({  }),
        new THREE.MeshMatcapMaterial({ }),
         new THREE.MeshMatcapMaterial({transparent: true,opacity: 0.5,}),
          new THREE.MeshMatcapMaterial({transparent: true,opacity: 0.5,}),
      ];

  let wall = new THREE.Mesh(geometry, material);

  let center = new THREE.Vector3().addVectors(startPoint, endPoint).divideScalar(2);
  wall.position.copy(center);

  // wall.lookAt(endPoint);

  wall.castShadow = true;
  wall.receiveShadow = true;

  this.scene.add(wall);
  this.walls.push(wall);
      this.polygonGroup.walls.push(wall);
 
}

restoreWallGeometry(wall) {
  if (!wall) return;

  const originalGeometry = this.originalWallGeometries.get(wall.uuid);
  if (originalGeometry) {
    wall.geometry.dispose();
    wall.geometry = originalGeometry.clone();

    wall.geometry.attributes.position.needsUpdate = true;
    wall.geometry.computeBoundingBox();
    wall.geometry.computeBoundingSphere();

    this.renderer.render(this.scene, this.camera);

    console.log("Wall geometry restored successfully.");
  } else {
    console.warn("Original geometry not found for wall:", wall.uuid);
  }
}


getSnappedPositionToWall(object, wall) {
  const wallBox = new THREE.Box3().setFromObject(wall);
  const objectBox = new THREE.Box3().setFromObject(object);
  const snappedPosition = new THREE.Vector3();

  const wallOrientation = this.getWallOrientation(wall);

  if (wallOrientation === "horizontal") {
    snappedPosition.set(
      THREE.MathUtils.clamp(objectBox.min.x, wallBox.min.x, wallBox.max.x),
      object.position.y,
      wall.position.z
    );
  } else if (wallOrientation === "vertical") {
    snappedPosition.set(
      wall.position.x,
      object.position.y,
      THREE.MathUtils.clamp(objectBox.min.z, wallBox.min.z, wallBox.max.z)
    );
  } else {
    snappedPosition.set(
      THREE.MathUtils.clamp(objectBox.min.x, wallBox.min.x, wallBox.max.x),
      object.position.y,
      THREE.MathUtils.clamp(objectBox.min.z, wallBox.min.z, wallBox.max.z)
    );
  }

  return snappedPosition;
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
    while (intersectedObject.parent && !raycastTargets.includes(intersectedObject)) {
      intersectedObject = intersectedObject.parent;
    }

    this.draggedobjects = intersectedObject;

    this.transformControls.detach();
    this.transformControls.attach(intersectedObject);
    let giz=this.transformControls.getHelper()
    this.scene.add(giz)

  } else {
    this.transformControls.detach();
  }
}

performCSGCut(draggedObject, wall) {
  if (this.activeWall && this.activeWall.uuid !== wall.uuid) {
    this.restoreWallGeometry(this.activeWall);
  }

  this.activeWall = wall;

  // Restore or save the original wall geometry
  if (this.originalWallGeometries.has(wall.uuid)) {
    wall.geometry.dispose();
    wall.geometry = this.originalWallGeometries.get(wall.uuid).clone();
  } else {
    this.originalWallGeometries.set(wall.uuid, wall.geometry.clone());
  }

  // Determine wall orientation (horizontal or vertical)
  const wallOrientation = this.getWallOrientation(wall);
  const wallRotationY = wall.rotation.y;

  if (wallOrientation === "vertical") {
    draggedObject.rotation.y = Math.PI / 2; 
    draggedObject.updateMatrixWorld(true);
  } else if (wallOrientation === "horizontal") {
    draggedObject.rotation.y = 0; 
    draggedObject.updateMatrixWorld(true);
  }

  const draggedBox = new THREE.Box3().setFromObject(draggedObject);
  const size = new THREE.Vector3();
  const center = new THREE.Vector3();
  draggedBox.getSize(size);
  draggedBox.getCenter(center);

  const cuttingMesh = new THREE.Mesh(
    new THREE.BoxGeometry(size.x + 1, size.y, size.z), 
    new THREE.MeshStandardMaterial({ color: 0xff0000, visible: false })
  );

  cuttingMesh.position.copy(center);
  cuttingMesh.rotation.copy(wall.rotation); 
  cuttingMesh.updateMatrixWorld(true);
  

  try {
    const result = CSG.subtract(wall, cuttingMesh);

    if (result) {
      wall.geometry.dispose();
      wall.geometry = result.geometry.clone();
      wall.geometry.computeBoundingBox();
    } else {
      console.error("CSG operation failed: No result returned.");
    }
  } catch (error) {
    console.error("CSG operation error:", error);
  }
}



addCollisionDetection() {
  this.transformControls = new TransformControls(this.camera, this.renderer.domElement);
  this.scene.add(this.transformControls);

  this.renderer.domElement.addEventListener("click", (event) => {
    this.addTransformControlToGlobalArray(event);
  });

  this.transformControls.addEventListener("objectChange", () => {
    const draggedObject = this.transformControls.object;
  
    if (draggedObject.userData.name === "Middle" || draggedObject.userData.name === "intermid") {
      let isIntersecting = false;
  
      for (const wall of this.bbBoxes) {
        const wallBox = new THREE.Box3().setFromObject(wall);
        const draggedBox = new THREE.Box3().setFromObject(draggedObject);
  
        if (wallBox.intersectsBox(draggedBox)) {
          isIntersecting = true;
  
          if (draggedObject.userData.name === "Middle") {
            this.performCSGCut(draggedObject, wall);
          } else if (draggedObject.userData.name === "intermid") {
            const snappedPosition = this.getSnappedPositionToWall(draggedObject, wall);
            draggedObject.position.copy(snappedPosition);
          }
        }
      }
  
      if (!isIntersecting) {
        console.log("No intersection detected. Restoring original geometry...");
  
        if (this.activeWall) {
          // Restore original geometry and update the scene
          this.restoreWallGeometry(this.activeWall);
  
          // Clear the active wall reference
          this.activeWall = null;
        }
      }
    }
  });
  
}

getWallOrientation(wall) {
  const rotationY = wall.rotation.y;
  const threshold = 0.1;

  if (Math.abs(rotationY % Math.PI) < threshold || Math.abs(rotationY % Math.PI - Math.PI) < threshold) {
    return "horizontal";
  }
  if (Math.abs(rotationY % Math.PI - Math.PI / 2) < threshold || Math.abs(rotationY % Math.PI + Math.PI / 2) < threshold) {
    return "vertical";
  }
  return "unknown";
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
    this.intersectObject = [];

    this.polygons.forEach((polygonGroup) => {
      polygonGroup.walls.forEach((wall) => {
        this.intersectObject.push(wall);
      });
    });

    this.intersects = this.raycaster.intersectObjects(this.intersectObject);
    if (this.intersects.length > 0) {
      this.INTERSECTED = this.intersects[0].object;
      if (this.INTERSECTED) {
        console.log( this.intersects[0].object);
        let wall= this.intersects[0].object
        store.commit("wall", [e,wall.userData.units[0],wall.userData.units[1],wall.userData.units[2]]);
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
  AddTextureForOudoor(texture) {
    let textures = new THREE.TextureLoader().load(texture);
    if (this.intersects.length > 0) {
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
      let point = this.intersects[0].point.clone();
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
      this.group.remove(this.INTERSECTED);
    }
  }

  AddTextureForIndoor(texture) {
    let textures = new THREE.TextureLoader().load(texture);
    if (this.intersects.length > 0) {
      this.INTERSECTED = this.intersects[0].object;
      this.INTERSECTED.material[5] = new THREE.MeshLambertMaterial({
        map: textures,
      });
    }
  }
  ApplyFeatures(dimension) {
    const newGeometry = new THREE.BoxGeometry(
      dimension.width,
      dimension.height,
      dimension.thickness
    );
    
    newGeometry.rotateY(Math.PI / 2);
 
    const floorBox = new THREE.Box3().setFromObject(this.polygonMesh);
    const floorTopY = floorBox.max.y; 
  
    
    newGeometry.computeBoundingBox(); 
    const geometryBox = newGeometry.boundingBox;
    const geometryBottomY = geometryBox.min.y;
    const offsetY = floorTopY - geometryBottomY;
    this.INTERSECTED.position.y = offsetY; 
    this.INTERSECTED.geometry = newGeometry;
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
          this.addLine(this.controlPoints[this.controlPoints.length - 2], point);
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

    if (this.intersects.length > 0) {
      if (!this.dragcontrols) {
        this.setupDragControls();
      }
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
    polygonGroup.ceil.geometry.dispose();
    polygonGroup.ceil.geometry = geometry;

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

    polygonGroup.controlPoints.forEach((point1, i) => {
      let point2 =
        i < polygonGroup.controlPoints.length - 1
          ? polygonGroup.controlPoints[i + 1]
          : polygonGroup.controlPoints[0];

      let wall = polygonGroup.walls[i];

      if (!wall) {
        this.length = point1.distanceTo(point2);
        let geometry = new THREE.BoxGeometry(this.length , this.height, this.thickness).translate(0,0, -this.thickness/2)
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
      wall.geometry = new THREE.BoxGeometry(this.length , this.height, this.thickness).translate(0,0, -this.thickness/2)
      wall.geometry.rotateY(Math.PI / 2);
      wall.position.y=2
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
    let texture = loader.load("./images/floor3.jpeg", () => {
      texture.wrapS = THREE.RepeatWrapping;
      texture.wrapT = THREE.RepeatWrapping;
      texture.repeat.set(1, 1);
    });
    let geometry = new THREE.ShapeGeometry(shape);
    geometry.rotateX(Math.PI / 2);
    let material = new THREE.MeshBasicMaterial({
      map: texture,
      side: THREE.DoubleSide,
    });

    this.polygonMesh = new THREE.Mesh(geometry, material);
    this.polygonMesh.position.y = 0.01;
    this.polygonMesh.receiveShadow=true
    this.group.add(this.polygonMesh);
 
    
   

    this.polygonGroup = {
      spheres: [...this.spheres],
      lines: [...this.lines],
      walls: [...this.walls],
      textMeshes: [...this.textMeshes],
      controlPoints: [...this.controlPoints],
      polygonMesh: this.polygonMesh,
      ceil: null
    };

    this.polygons.push(this.polygonGroup);
    this.threeDimension();
    this.ceil(geometry);
    
    this.walls.forEach((wall) => {
      this.polygonGroup.walls.push(wall);
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

    // link.click();
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
    ceil.position.y = 4;
    this.polygonGroup.ceil=ceil
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

    // this.tempLine = line;
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
  threeDimension() {
    let point1 = new THREE.Vector3();
    let point2 = new THREE.Vector3();
    
   
    for (let i = 0; i < this.controlPoints.length - 1; i++) {
      point1.set(this.controlPoints[i].x, 2, this.controlPoints[i].z);
      point2.set(this.controlPoints[i + 1].x, 2, this.controlPoints[i + 1].z);

      this.length = point1.distanceTo(point2);
      let direction = new THREE.Vector3()
        .subVectors(point2, point1)
        .normalize();
      let loader = new THREE.TextureLoader();
      let texture = loader.load("./images/images.jpg", () => {
        texture.wrapS = THREE.RepeatWrapping;
        texture.wrapT = THREE.RepeatWrapping;
        texture.repeat.set(1, 1);
      });
      let geometry = new THREE.BoxGeometry(this.length , this.height, this.thickness).translate(0,0, -this.thickness/2)
     
      this.material = [
        new THREE.MeshMatcapMaterial({ transparent: true,
              opacity: 0.8,}),
        new THREE.MeshMatcapMaterial({transparent: true,
          opacity: 0.8,}),
        new THREE.MeshMatcapMaterial({transparent: true,
          opacity: 0.8,  }),
        new THREE.MeshMatcapMaterial({ transparent: true,
          opacity: 0.8,}),
         new THREE.MeshMatcapMaterial({ transparent: true,
          opacity: 0.8,}),
          new THREE.MeshMatcapMaterial({color:0xebf590,}),
      ];
    //  this.material = new THREE.MeshMatcapMaterial({
    //     color: "white",
    //     transparent: true,
    //     opacity: 0.8,
    //   });
      geometry.rotateY(Math.PI / 2);

      let wall = new THREE.Mesh(geometry, this.material);

      let midpoint = new THREE.Vector3()
        .addVectors(point1, point2)
        .divideScalar(2);

      wall.position.copy(midpoint);

      wall.lookAt(point2);
      wall.castShadow = true;
      wall.receiveShadow = true;
      let box = new THREE.Box3().setFromObject(wall);
      this.bbBoxes.push(wall);
      this.scene.add(wall);
      wall.userData.units=[this.length,this.height,this.thickness]

      this.walls.push(wall);
    }
    this.scene.remove(this.tempLine);

    this.tempLine = null;
  }
  addLight() {
    let box = new THREE.Box3().setFromObject(this.polygonMesh);
    let size = new THREE.Vector3();
    box.getSize(size);

    let centre = box.getCenter(new THREE.Vector3());
    let spotlight = new THREE.PointLight("black");
    spotlight.position.set(centre.x, centre.y + 1, centre.z);
    let helper = new THREE.PointLightHelper(spotlight);
    this.scene.add(helper);
    this.scene.add(spotlight);
    this.group.add(spotlight);
  }
  gltfLoader(modelLink) {
    const loader = new GLTFLoader();
    loader.load(modelLink, (gltf) => {
      this.box = new THREE.Box3().setFromObject(gltf.scene);
      let size = new THREE.Vector3();
      box.getSize(size);
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
      gltf.scene.position.set(Math.random() * 10, 0, Math.random() * 10);

      const saveModel = { gltfLink: modelLink, gltfScene: gltf.scene.position };
      this.modelLoad.push(saveModel);

      this.scene.add(gltf.scene);
    });
  }
  async saveFile(projectname) {
    const saveModel = {
      projectname: projectname,
      coordinates: this.mainArray,
      gltfObjects: this.modelLoad,
    };
    store.commit("setTriggerMethod", saveModel);
  }

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
    this.controls.update();
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
