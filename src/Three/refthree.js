import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { DragControls } from "three/addons/controls/DragControls.js";
import { Line2 } from "three/examples/jsm/lines/Line2.js";
import { LineMaterial } from "three/examples/jsm/lines/LineMaterial.js";
import { LineGeometry } from "three/examples/jsm/lines/LineGeometry.js";
import { FontLoader } from "three/addons/loaders/FontLoader.js";
import { TextGeometry } from "three/addons/geometries/TextGeometry.js";

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
    this.smallArray = [];
    this.bigArray = [];
    this.plane = null;
    this.controls = null;
    this.spheres = [];
    this.walls = [];
    this.gridSize = 100;
    this.lines = [];
    this.textMeshes = [];
    this.tempLines = [];
    this.tempLine = null;
    this.Dragcontrols = null;
    this.isDrawing = false;
    this.clickIndex = 0;

    this.onPointerMove = this.onPointerMove.bind(this);
    this.onMouseDown = this.onMouseDown.bind(this);
    this.mouseover = this.mouseover.bind(this);
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
    this.predefined();
    window.addEventListener("resize", () => {
      this.camera.aspect = window.innerWidth / window.innerHeight;
      this.camera.updateProjectionMatrix();
      this.renderer.setSize(window.innerWidth, window.innerHeight);
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
      this.controls.enableZoom = true;
      this.controls.minZoom = 0.2;
      this.controls.maxZoom = 3.0;
      this.controls.enableZoom = true;
      this.controls.enableRotate = false;
      this.controls.enablePan = true;
      this.camera.position.y = 5;
    }

    this.camera.lookAt(0, 0, 0);
  }
  predefined() {
    this.smallArray = [
      { x: -5, y: 0, z: -3 },
      { x: 5, y: 0, z: -3 },
      { x: 5, y: 9, z: 3 },
      { x: -5, y: 0, z: 3 },
      { x: -5, y: 0, z: -3 },
    ];
    this.finalizePolygon(this.smallArray);
  }

  mesh() {
    let planeGeom = new THREE.PlaneGeometry(100, 100);
    planeGeom.rotateX(-Math.PI / 2);
    this.plane = new THREE.Mesh(
      planeGeom,
      new THREE.MeshStandardMaterial({ visible: false, color: "red" })
    );
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
      this.smallArray.push(point);
      this.bigArray[this.clickIndex] = this.smallArray;
      console.log(this.bigArray);

      this.addControlPoint(point);

      if (this.smallArray.length > 1) {
        this.addLine(this.smallArray[this.smallArray.length - 2], point);
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
      this.stopDrawing();
      this.finalizePolygon();
      this.clickIndex += 1;
    }
  }

  addControlPoint(point) {
    let cp = new THREE.Mesh(
      new THREE.SphereGeometry(0.2, 20, 20),
      new THREE.MeshBasicMaterial({
        color: "yellow",
        transparent: true,
        opacity: 0.3,
      })
    );
    cp.position.copy(point);
    this.scene.add(cp);
    this.spheres.push(cp);
    cp.userData.index = this.smallArray.length - 1;
  }

  finalizePolygon() {
    if (this.smallArray.length < 3) return;

    let firstSphere = this.spheres.shift();
    this.scene.remove(firstSphere);

    let shape = new THREE.Shape();

    for (let i = 0; i < this.smallArray.length - 1; i++) {
      shape.moveTo(this.smallArray[i].x, this.smallArray[i].z);
      shape.lineTo(this.smallArray[i + 1].x, this.smallArray[i + 1].z);
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
    this.scene.add(this.polygonMesh);
    this.threeDimension();
    this.smallArray = [];
  }

  isClosedPolygon() {
    return (
      this.smallArray.length > 2 &&
      Math.floor(this.smallArray[0].x) ===
        Math.floor(this.smallArray[this.smallArray.length - 1].x) &&
      Math.floor(this.smallArray[0].y) ===
        Math.floor(this.smallArray[this.smallArray.length - 1].y) &&
      Math.floor(this.smallArray[0].z) ===
        Math.floor(this.smallArray[this.smallArray.length - 1].z)
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
      this.smallArray[this.smallArray.length - 1].x,
      this.smallArray[this.smallArray.length - 1].y,
      this.smallArray[this.smallArray.length - 1].z
    );
    points.push(newPoint.x, newPoint.y, newPoint.z);

    let geometry = new LineGeometry();
    geometry.setPositions(points);

    let material = new LineMaterial({
      color: "green",
      linewidth: 10,
      resolution: new THREE.Vector2(this.width, this.height),
    });

    let line = new Line2(geometry, material);
    line.computeLineDistances();
    this.scene.add(line);
    this.tempLine = line;
    // this.addMeasurementLabel(
    //   this.smallArray[this.smallArray.length - 1],
    //   newPoint
    // );
  }

  updateExistingTemporaryLine(newPoint) {
    let points = [
      this.smallArray[this.smallArray.length - 1].x,
      this.smallArray[this.smallArray.length - 1].y,
      this.smallArray[this.smallArray.length - 1].z,
      newPoint.x,
      newPoint.y,
      newPoint.z,
    ];

    this.tempLine.geometry.setPositions(points);

    this.tempLine.geometry.attributes.position.needsUpdate = true;

    // this.addMeasurementLabel(
    //   this.smallArray[this.smallArray.length - 1],
    //   newPoint
    // );
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
  setupDragControls() {
    this.Dragcontrols = new DragControls(
      this.spheres,
      this.camera,
      this.renderer.domElement
    );
    this.Dragcontrols.addEventListener("dragstart", () => {
      this.controls.enabled = false;
    });
    this.Dragcontrols.addEventListener("dragend", (event) => {
      this.controls.enabled = true;
      this.onControlPointDrag(event.object);
    });
  }
  onControlPointDrag(sphere) {
      let index = sphere.userData.index;
      for (let i = 0; i < this.bigArray.length; i++) {
          if (index == i) {
               this.bigArray[i][index].copy(sphere.position);
          }
          
      }
    

    if (this.polygonMesh) {
      let vertices = this.polygonMesh.geometry.attributes.position.array;
        for (let i = 0; i < this.bigArray.length; i++) {
            for (let j = 0; j < this.bigArray[i].length - 1; j++) {
                vertices[i * 3] = this.bigArray[i][j].x;
                vertices[i * 3 + 1] = 0;
                vertices[i * 3 + 2] = this.bigArray[i][j].z;
            }
        }

      this.polygonMesh.geometry.attributes.position.needsUpdate = true;
    }

    this.updateLines();
    this.updateShapeGeometry();
    this.updateWalls();
    // this.updateMeasurementLabels();
  }
  updateWalls() {
    this.walls.forEach((wall) => this.scene.remove(wall));
    this.walls = [];
      let point1
      let  point2 
    let height = 2;
    let thickness = 0.1;
      for (let i = 0; i < this.bigArray.length - 1; i++) {
          for (let j = 0; j < this.bigArray[i].length - 1; j++) {
              point1 = new THREE.Vector3(this.bigArray[i][j].x, 1, this.bigArray[i][j].z)
              point2 = new THREE.Vector3(this.bigArray[i][j + 1].x, 1, this.bigArray[i][j + 1].z)
              console.log(point1);
              console.log(point2);
          }
      

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
              new THREE.MeshLambertMaterial({ map: texture }),
              new THREE.MeshLambertMaterial({ color: "white" }),
          ];
          geometry.rotateY(Math.PI / 2);

          let wall = new THREE.Mesh(geometry, material);
          wall.position.copy(
              new THREE.Vector3().addVectors(point1, point2).divideScalar(2)
          );
          wall.lookAt(point2);

          this.scene.add(wall);
          this.walls.push(wall);
      }
  }
  updateShapeGeometry() {
    if (this.polygonMesh) {
      this.scene.remove(this.polygonMesh);
    }

    if (this.bigArray.length < 3) return;

    let shape = new THREE.Shape();
    for (let i = 0; i < this.bigArray.length; i++) {
      const point = this.bigArray[i];
      if (i === 0) {
        shape.moveTo(point.x, point.z);
      } else {
        shape.lineTo(point.x, point.z);
      }
    }

    let geometry = new THREE.ShapeGeometry(shape);
    geometry.rotateX(Math.PI / 2);
    let texture = new THREE.TextureLoader().load("./images/download.jpg");
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;

    let material = new THREE.MeshBasicMaterial({
      map: texture,
      side: THREE.DoubleSide,
    });

    this.polygonMesh = new THREE.Mesh(geometry, material);
    this.polygonMesh.position.y = 0.01;
    this.scene.add(this.polygonMesh);
  }

  updateLines() {
    this.lines.forEach((line, i) => {
      let point1, point2;

    
        for (let i = 0; i < this.bigArray.length; i++) {
          for (let j = 0; j < this.bigArray[i].length - 1; j++) {
            if (i < this.bigArray.length - 1) {
              point1 = this.bigArray[i][j];
              point2 = this.bigArray[i][j + 1];
            } else {
                console.log(this.bigArray[i][0]);
                
              point1 = this.bigArray[i][j];
              point2 = this.bigArray[i][0];
            }

            console.log(point1);
            console.log(point2);

            let positions = [];
            positions.push(point1.x, point1.y, point1.z);
            positions.push(point2.x, point2.y, point2.z);

            line.geometry.dispose();
            line.geometry = new LineGeometry();
            line.geometry.setPositions(positions);
          }
        }
    });
  }

  updateArcs() {
    this.tempLines.forEach((arc) => this.scene.remove(arc));
    this.tempLines = [];

    if (this.smallArray.length > 2) {
      for (let i = 0; i < this.smallArray.length - 2; i++) {
        let P1 = this.smallArray[i];
        let P2 = this.smallArray[i + 1];
        let P3 = this.smallArray[i + 2];
        this.createArcBetweenLines(P1, P2, P3);
      }
    }
  }

  addLine(point1, point2) {
    let positions = [];
    positions.push(point1.x, point1.y, point1.z);
    positions.push(point2.x, point2.y, point2.z);

    let geometry = new LineGeometry();
    geometry.setPositions(positions);
    let goodMaterial = new LineMaterial({
      color: "green",
      linewidth: 10,
      resolution: new THREE.Vector2(this.width, this.height),
    });

    let line = new Line2(geometry, goodMaterial);
    line.computeLineDistances();
    this.scene.add(line);
    this.lines.push(line);

    // this.addMeasurementLabel(point1, point2);
    this.updateshape();

    // if (this.smallArray.length > 2) {
    //   let P1 = this.smallArray[this.smallArray.length - 3];
    //   let P2 = this.smallArray[this.smallArray.length - 2];
    //   let P3 = this.smallArray[this.smallArray.length - 1];
    //   this.createArcBetweenLines(P1, P2, P3);
    // }
  }

  createArcBetweenLines(P1, P2, P3) {
    let N = 50;
    let arcPoints = [];

    let radius = Math.min(P1.distanceTo(P2), P3.distanceTo(P2)) / 2;

    let direction1 = new THREE.Vector3().subVectors(P1, P2).setLength(radius);
    let direction2 = new THREE.Vector3().subVectors(P3, P2).setLength(radius);

    let arcStart = new THREE.Vector3().addVectors(P2, direction1);
    let arcEnd = new THREE.Vector3().addVectors(P2, direction2);

    for (let i = 0; i <= N; i++) {
      let t = i / N;
      let point = new THREE.Vector3()
        .lerpVectors(arcStart, arcEnd, t)
        .sub(P2)
        .setLength(radius)
        .add(P2);
      arcPoints.push(point);
    }

    let arc = new THREE.Line(
      new THREE.BufferGeometry().setFromPoints(arcPoints),
      new THREE.LineBasicMaterial({ color: "royalblue" })
    );
    arc.position.y = 0.1;
    this.scene.add(arc);
    this.tempLines.push(arc);
  }

  updateMeasurementLabels() {
    this.textMeshes.forEach((textMesh) => this.scene.remove(textMesh));
    this.textMeshes = [];

    // for (let i = 0; i < this.bigArray.length - 1; i++) {
    //   this.addMeasurementLabel(this.bigArray[i], this.bigArray[i + 1]);
    // }
  }

    threeDimension() {
        console.log(this.bigArray.length);
        
        let point1 = new THREE.Vector3();
        let point2 = new THREE.Vector3();
        let height = 2;
        let thickness = 0.1;

        for (let i = 0; i < this.bigArray.length ; i++) {
            for (let j = 0; j < this.bigArray[i].length-1; j++) {
              point1.set(this.bigArray[i][j].x, 1, this.bigArray[i][j].z);
              point2.set(this.bigArray[i][j + 1].x,1,this.bigArray[i][j + 1].z );

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
              let geometry = new THREE.BoxGeometry(
                length + 0.08,
                height,
                thickness
              );
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
        }
    }

  animate() {
    requestAnimationFrame(() => this.animate());
    this.controls.update();
    this.render();
  }

  render() {
    this.renderer.render(this.scene, this.camera);

    //   console.log(this.scene);
  }
}




/*
  setupDragControls() {
    // this.AddGeometries();

    this.Dragcontrols = new DragControls(
      this.vertMarkers,
      this.camera,
      this.renderer.domElement
    );
    this.Dragcontrols.addEventListener("dragstart", (event) => {
      this.controls.enabled = false;
    });
    this.Dragcontrols.addEventListener("dragend", (event) => {
      this.controls.enabled = true;
      console.log(event.object);
      
      // this.onControlPointDrag(event.object);
      // this.RemoveGeometries()
    });
  }
  onControlPointDrag(sphere) {
    let index = sphere.userData.index;
    for (let i = 0; i < this.mainArray.length; i++) {
      if (index == i) {
        this.mainArray[i][index].copy(sphere.position);
      }
    }

    if (this.polygonMesh) {
      let vertices = this.polygonMesh.geometry.attributes.position.array;
      for (let i = 0; i < this.mainArray.length; i++) {
        for (let j = 0; j < this.mainArray[i].length - 1; j++) {
          vertices[i * 3] = this.mainArray[i][j].x;
          vertices[i * 3 + 1] = 0;
          vertices[i * 3 + 2] = this.mainArray[i][j].z;
        }
      }

      this.polygonMesh.geometry.attributes.position.needsUpdate = true;
    }
    this.updateWalls();
    this.updateShapeGeometry()
    this.updateLines();
  }

  updateWalls() {
    // this.walls.forEach((wall) => this.scene.remove(wall));
    // this.walls = [];
    let point1;
    let point2;
    let height = 2;
    let thickness = 0.1;
    for (let i = 0; i < this.mainArray.length - 1; i++) {
      for (let j = 0; j < this.mainArray[i].length - 1; j++) {
        point1 = new THREE.Vector3(
          this.mainArray[i][j].x,
          1,
          this.mainArray[i][j].z
        );
        point2 = new THREE.Vector3(
          this.mainArray[i][j + 1].x,
          1,
          this.mainArray[i][j + 1].z
        );
        console.log(point1);
        console.log(point2);
      }

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
        new THREE.MeshLambertMaterial({ map: texture }),
        new THREE.MeshLambertMaterial({ color: "white" }),
      ];
      geometry.rotateY(Math.PI / 2);

      let wall = new THREE.Mesh(geometry, material);
      wall.position.copy(
        new THREE.Vector3().addVectors(point1, point2).divideScalar(2)
      );
      wall.lookAt(point2);

      this.scene.add(wall);
      this.walls.push(wall);
    }
  }
  updateShapeGeometry() {
    // if (this.polygonMesh) {
    //   this.scene.remove(this.polygonMesh);
    // }

    if (this.mainArray.length < 3) return;

    let shape = new THREE.Shape();
    for (let i = 0; i < this.mainArray.length; i++) {
      const point = this.mainArray[i];
      if (i === 0) {
        shape.moveTo(point.x, point.z);
      } else {
        shape.lineTo(point.x, point.z);
      }
    }

    let geometry = new THREE.ShapeGeometry(shape);
    geometry.rotateX(Math.PI / 2);
    let texture = new THREE.TextureLoader().load("./images/download.jpg");
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;

    let material = new THREE.MeshBasicMaterial({
      map: texture,
      side: THREE.DoubleSide,
    });

    this.polygonMesh = new THREE.Mesh(geometry, material);
    this.polygonMesh.position.y = 0.01;
    this.scene.add(this.polygonMesh);
  }

  updateLines() {
    // this.lines.forEach((line) => this.scene.remove(line));
    // this.lines = [];
    let point1;
    let point2;
    let height = 2;
    let thickness = 0.1;
    for (let i = 0; i < this.mainArray.length - 1; i++) {
      for (let j = 0; j < this.mainArray[i].length - 1; j++) {
        point1 = new THREE.Vector3(this.mainArray[i][j].x,1,this.mainArray[i][j].z);
        point2 = new THREE.Vector3(this.mainArray[i][j + 1].x,1, this.mainArray[i][j + 1].z);
        this.addLine(point1,point2)
      }
    }
  }
 
 
  var size = 0.2;
    var vertGeometry = new THREE.BoxGeometry(size, size, size);
    var vertMaterial = new THREE.MeshBasicMaterial({
      color: 0x0000ff,
      transparent: false,
    });

    var verts = this.polygonMesh.geometry.attributes.position.array;
    for (let k = 0; k < verts.length; k += 3) {
      var vertMarker = new THREE.Mesh(vertGeometry, vertMaterial);

      let tooltipText = `idx: ${k}, pos: [${verts[k].toFixed(3)},${verts[
        k + 1
      ].toFixed(3)},${verts[k + 2].toFixed(3)}]`;
      vertMarker.userData.tooltipText = tooltipText;

      vertMarker.applyMatrix4(
        new THREE.Matrix4().makeTranslation(
          verts[k],
          verts[k + 1],
          verts[k + 2]
        )
      );
      this.scene.add(vertMarker);
      this.vertMarkers.push(vertMarker)
    }
*/