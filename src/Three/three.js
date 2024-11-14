import * as THREE from "three";

import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { DragControls } from "three/addons/controls/DragControls.js";
import { Line2 } from "three/examples/jsm/lines/Line2.js";
import { LineMaterial } from "three/examples/jsm/lines/LineMaterial.js";
import { LineGeometry } from "three/examples/jsm/lines/LineGeometry.js";
import { FontLoader } from "three/addons/loaders/FontLoader.js";
import { TextGeometry } from "three/addons/geometries/TextGeometry.js";
import { Sky } from "three/addons/objects/Sky.js";
import { MathUtils, Vector3 } from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
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
    this.plane = null;
    this.controls = null;
    this.spheres = [];
    this.walls = [];
    this.gridSize = 100;
    this.lines = [];
    this.textMeshes = [];
    this.tempLine = null;
    this.Dragcontrols = null;
    this.isDrawing = false;
    this.gltf = [];
    this.mainArray = [];
    this.modelLoad = [];
    this.globalArray = [];
    this.onPointerMove = this.onPointerMove.bind(this);
    this.onMouseDown = this.onMouseDown.bind(this);
    // this.mouseover = this.mouseover.bind(this);

    this.init();
  }

  init() {
    if (this.renderer) {
      this.container.removeChild(this.renderer.domElement);
    }

    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color("white");

    this.renderer = new THREE.WebGLRenderer();
    this.renderer.setSize(
      this.container.clientWidth,
      this.container.clientHeight
    );
    this.container.appendChild(this.renderer.domElement);

    this.light = new THREE.AmbientLight(0xffffff);
    this.scene.add(this.light);

    let pointLight = new THREE.PointLight("white", 5, 100);
    pointLight.position.set(0, -2, 0);
    this.scene.add(pointLight);

    this.mesh();
    this.updateCamera();
    window.addEventListener("resize", () => {
      this.camera.aspect = window.innerWidth / window.innerHeight;
      this.camera.updateProjectionMatrix();
      this.renderer.setSize(window.innerWidth, window.innerHeight);
    });
    const sky = new Sky();
    sky.scale.setScalar(450000);

    const phi = MathUtils.degToRad(80);
    const theta = MathUtils.degToRad(180);
    const sunPosition = new Vector3().setFromSphericalCoords(1, phi, theta);

    sky.material.uniforms.sunPosition.value = sunPosition;
    sky.material.uniforms.rayleigh.value = 1;
    sky.material.uniforms.turbidity.value = 0;

    this.scene.add(sky);
      this.renderer.domElement.addEventListener(
        "dblclick",
        this.meshSelect.bind(this)
      );
  
    this.renderer.domElement.addEventListener(
      "mousemove",
      this.selectingProperty.bind(this)
    );


    this.animate();
  }
 
  updateCamera() {
    if (this.controls) {
      this.controls.dispose();
    }

    if (this.cam) {
      this.spheres.forEach((sphere) => this.scene.add(sphere));
      this.lines.forEach((line) => this.scene.add(line));
      this.scene.background = new THREE.Color("white");
      this.scene.add(this.plane);
      this.objects.push(this.plane);
      this.scene.remove(this.gridHelper);

      const aspectRatio = window.innerWidth / window.innerHeight;
      const cameraSize = 5;
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
      this.spheres.forEach((sphere) => this.scene.remove(sphere));
      this.lines.forEach((line) => this.scene.remove(line));
      this.textMeshes.forEach((textMesh) => this.scene.remove(textMesh));
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

    if (this.camera.isPerspectiveCamera) {
      this.controls.minDistance = 0.2;
      this.controls.maxDistance = 40;

      this.controls.minPolarAngle = 0;
      this.controls.maxPolarAngle = Math.PI * 0.5;
      this.camera.position.set(5, 5, 5);
    } else {
      this.camera.zoom = 1;
      this.controls.minZoom = 0.2;
      this.controls.maxZoom = 3.0;
      this.controls.enableZoom = true;
      this.controls.enableRotate = false;
      this.controls.enablePan = true;
      this.camera.position.y = 5;
    }

    this.camera.lookAt(0, 0, 0);
  }
  predefined(model) {
    if(model){
      this.controlPoints = model;
      this.finalizePolygon(this.controlPoints);
  
    }
    else{
      this.controlPoints = [{x:-5,y:0,z:-3},
        {x:5,y:0,z:-3},
        {x:5,y:9,z:3},
        {x:-5,y:0,z:3},
        {x:-5,y:0,z:-3}
      ];
      this.finalizePolygon(this.controlPoints);
  
    }
  }

  mesh() {
    const vertexShader = `
    varying vec2 vUv;
    void main() {
        vUv = uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
`;
    const fragmentShader = `
    varying vec2 vUv;

    void main() {
        // Parameters for the small grid
        float smallLineThickness = 0.003; // Thickness of small grid lines
        float smallGridFrequency = 300.0; // Frequency of small grid

        // Parameters for the large grid
        float largeLineThickness = 0.005; // Thickness of large grid lines
        float largeGridFrequency = 100.0; // Frequency of large grid

        // Small grid calculations
        float smallGridX = step(smallLineThickness, abs(mod(vUv.x * smallGridFrequency, 1.0) - 0.5));
        float smallGridY = step(smallLineThickness, abs(mod(vUv.y * smallGridFrequency, 1.0) - 0.5));
        float smallGrid = smallGridX * smallGridY;

        // Large grid calculations
        float largeGridX = step(largeLineThickness, abs(mod(vUv.x * largeGridFrequency, 1.0) - 0.5));
        float largeGridY = step(largeLineThickness, abs(mod(vUv.y * largeGridFrequency, 1.0) - 0.5));
        float largeGrid = largeGridX * largeGridY;

        // Combine the grids (small grid overlaid on the large grid)
        float grid = min(smallGrid, largeGrid);

        // Set grid color
vec3 backgroundColor = vec3(1.0);         // Background color (white)
vec3 lineColor = vec3(0.5, 0.5, 0.5);     // Grid line color (light gray)

vec3 gridColor = mix(lineColor, backgroundColor, grid); // Interpolates between background and grid color
gl_FragColor = vec4(gridColor, 1.0);
    }
`;
    const material = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      // transparent: true
    });
    this.gridHeight = 1000;
    this.gridWidth = 1000;
    this.plane = new THREE.Mesh(
      new THREE.PlaneGeometry(this.gridHeight, this.gridWidth),
      material
    );
    this.plane.rotation.x = -Math.PI / 2;
    this.plane.position.y = -0.1;
    this.scene.add(this.plane);
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
  // this.renderer.domElement.removeEventListener("click", this.mouseover);
    
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
  meshSelect(e){
    const rect = this.renderer.domElement.getBoundingClientRect();
    this.mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    this.mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
    this.raycaster.setFromCamera(this.mouse, this.camera);
    this.intersects = this.raycaster.intersectObjects(this.globalArray);

    if (this.intersects.length > 0) {

    }

  }
  selectingProperty(e) {
    if(this.group){
    const rect = this.renderer.domElement.getBoundingClientRect();
    this.mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    this.mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
    this.raycaster.setFromCamera(this.mouse, this.camera);
    this.intersects = this.raycaster.intersectObjects(this.globalArray);

    if (this.intersects.length > 0) {
      
      if (this.INTERSECTED) {
        this.INTERSECTED.material[2] = new THREE.MeshLambertMaterial({
          color: 0x3b3b3b,
        });
      }
      this.INTERSECTED = this.intersects[0].object;
      this.INTERSECTED.material[2] = new THREE.MeshBasicMaterial({
        color: "green",
      });
    } else {
      if (this.INTERSECTED) {
        this.INTERSECTED.material[2] = new THREE.MeshLambertMaterial({
          color: 0x3b3b3b,
        });
      }
    }
          
  }

  }

  raycastDefined(e) {
    const rect = this.renderer.domElement.getBoundingClientRect();
    this.mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    this.mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
    this.raycaster.setFromCamera(this.mouse, this.camera);

    this.intersects = this.raycaster.intersectObjects(this.objects);
  }

  onMouseDown(e) {
    if (!this.isDrawing) return;

    this.raycastDefined(e);

    if (this.intersects.length > 0) {
      let point = this.intersects[0].point.clone();
      this.controlPoints.push(point);

      this.addControlPoint(point);

      if (this.controlPoints.length > 1) {
        this.addLine(this.controlPoints[this.controlPoints.length - 2], point);
      }
    }
  }

  onPointerMove(e) {
    if (!this.isDrawing) return;

    this.raycastDefined(e);

    if (this.intersects.length > 0) {
      let point = this.intersects[0].point.clone();
      this.updateTemporaryLine(point);
      this.updateMeasurementLabels();
    }
  }

  mouseover(e) {
    this.raycastDefined(e);
    if (this.intersects.length > 0) {
      if (!this.Dragcontrols) {
        this.setupDragControls();
      }
    }
  }

  updateshape() {
    if (this.isClosedPolygon()) {
     
      this.finalizePolygon();
       this.stopDrawing();
    }
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

    // let firstSphere = this.spheres.shift();
    // this.scene.remove(firstSphere);
    
      this.spheres.forEach((sphere) => {
        this.group.add(sphere);
        this.scene.remove(sphere);
      });

    let shape = new THREE.Shape();

    for (let i = 0; i < this.controlPoints.length - 1; i++) {
      shape.moveTo(this.controlPoints[i].x, this.controlPoints[i].z);
      shape.lineTo(this.controlPoints[i + 1].x, this.controlPoints[i + 1].z);
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
      map: texture,
      side: THREE.DoubleSide,
    });

    this.polygonMesh = new THREE.Mesh(geometry, material);
    this.polygonMesh.position.y = 0.01;
    this.group.add(this.polygonMesh);
     this.threeDimension();
     this.ceil(geometry);
    
      this.lines.forEach((line) => {
        this.group.add(line);
        this.scene.remove(line);
      });
      this.textMeshes.forEach((textMesh) => {
        this.group.add(textMesh);
        this.scene.remove(textMesh);
      });
  
    this.walls.forEach((wall) => {
      this.group.add(wall);
      this.scene.remove(wall)
    });
     
     
    this.globalArray.push(this.group);
      this.scene.add(this.group);
  
    this.mainArray.push(this.controlPoints);
    this.controlPoints = [];
    this.lines = [];
    this.walls = [];
    this.textMeshes = [];

    this.setupDragControls();
     
  }
  setupDragControls() {
    
    this.Dragcontrols = new DragControls(
      [...this.globalArray],
      this.camera,
      this.renderer.domElement
    );
    this.Dragcontrols.transformGroup =true
    this.Dragcontrols.addEventListener("dragstart", () => {
      this.controls.enabled = false;
    });
    this.Dragcontrols.addEventListener("dragend", () => {
      this.controls.enabled = true;
     
      
    });
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

     this.polygonMesh = new THREE.Mesh(geometry, material);
     this.polygonMesh.position.y =2;
    this.scene.add(this.polygonMesh);
    this.group.add(this.polygonMesh)
  }

  isClosedPolygon() {
    return (
      this.controlPoints.length > 2 &&
      Math.floor(this.controlPoints[0].x) === Math.floor(this.controlPoints[this.controlPoints.length - 1].x) &&
      Math.floor(this.controlPoints[0].y) === Math.floor(this.controlPoints[this.controlPoints.length - 1].y) &&
      Math.floor(this.controlPoints[0].z) === Math.floor(this.controlPoints[this.controlPoints.length - 1].z)
    );
  }

  updateTemporaryLine(newPoint) {    
    if (this.tempLine) {
      this.updateExistingTemporaryLine(newPoint);
    } else {
      this.createNewTemporaryLine(newPoint);
    }
  }

  createNewTemporaryLine(newPoint) {
    let points = [];

    points.push(
      this.controlPoints[this.controlPoints.length - 1].x,
      this.controlPoints[this.controlPoints.length - 1].y,
      this.controlPoints[this.controlPoints.length - 1].z
    );
    points.push(newPoint.x, newPoint.y, newPoint.z);

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
    console.log('line',this.tempLine);
    
    // this.tempLine = line;
    this.addMeasurementLabel(
      this.controlPoints[this.controlPoints.length - 1],
      newPoint
    );
  }

  updateExistingTemporaryLine(newPoint) {
    let points = [
      this.controlPoints[this.controlPoints.length - 1].x,
      this.controlPoints[this.controlPoints.length - 1].y,
      this.controlPoints[this.controlPoints.length - 1].z,
      newPoint.x,
      newPoint.y,
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
    let distance = point1.distanceTo(point2);
    let loader = new FontLoader();

    loader.load(
      "https://threejs.org/examples/fonts/helvetiker_regular.typeface.json",
      (font) => {
        let textGeometry = new TextGeometry(distance.toFixed(2), {
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
    this.updateshape();
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
    let thickness = 0.1;

    for (let i = 0; i < this.controlPoints.length - 1; i++) {
      point1.set(this.controlPoints[i].x, 1, this.controlPoints[i].z);
      point2.set(this.controlPoints[i + 1].x, 1, this.controlPoints[i + 1].z);

      let length = point1.distanceTo(point2);
      let direction = new THREE.Vector3()
        .subVectors(point2, point1)
        .normalize();
      let loader = new THREE.TextureLoader();
      let texture = loader.load("./images/images.jpg", () => {
        texture.wrapS = THREE.RepeatWrapping;
        texture.wrapT = THREE.RepeatWrapping;
        texture.repeat.set(1, 1);
      });
      let geometry = new THREE.BoxGeometry(length + 0.08, height, thickness);
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

      this.walls.push(wall);
          
    }
    // this.tempLine = null;
    this.scene.remove(this.tempLine) 
    this.tempLine=null   

    this.addLight()
  }
  addLight() {
    let box = new THREE.Box3().setFromObject(this.polygonMesh)
    let centre=box.getCenter( new THREE.Vector3())
    let spotlight = new THREE.PointLight(0xffffff,50)
    spotlight.position.copy(centre);
    this.scene.add(spotlight)
    this.group.add(spotlight)
  }
  gltfLoader(modelLink) {
    const loader = new GLTFLoader();
    loader.load(modelLink, (gltf) => {

      this.gltf.push(gltf.scene);
      gltf.scene.position.x = 5;
      const saveModel = { gltfLink: modelLink, gltfScene: gltf.scene.position };
      this.modelLoad.push(saveModel);

      this.scene.add(gltf.scene);
    });
  }
  async saveFile() {
    
    const saveModel = {
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
  }

  render() {
    this.renderer.render(this.scene, this.camera);

  }
}