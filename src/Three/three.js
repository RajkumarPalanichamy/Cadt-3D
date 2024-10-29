import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { DragControls } from 'three/addons/controls/DragControls.js';

export default class ThreeScene {
    constructor(container) {
        this.container = container;
        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.cube = null; 
        this.cam = true; 
        this.objects = [];
        this.raycaster = new THREE.Raycaster();
        this.mouse = new THREE.Vector2();
        this.intersects = null;
        this.controlPoints = [];  
        this.clickCount = 0;     
        this.plane = null;
        this.controls = null;
        this.wall=null;
        this.cp=null;
        this.cps=[];
        this.walls=[];
        this.cubes=[];
        this.gridSize=100;
        this.init()

    }

    init() {
        if (this.renderer) {
            this.container.removeChild(this.renderer.domElement);
        }

        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color('white');

        this.renderer = new THREE.WebGLRenderer();
        this.renderer.setSize(this.container.clientWidth, this.container.clientHeight);
        this.container.appendChild(this.renderer.domElement);

        this.light = new THREE.AmbientLight(0xffffff);
        this.scene.add(this.light);

        const pointLight = new THREE.PointLight('white', 5, 100);
        pointLight.position.set(0, -2, 0);
        this.scene.add(pointLight);

        document.addEventListener("click", this.onMouseDown.bind(this), false);
        document.addEventListener("dblclick", this.select.bind(this), false);

        this.mesh();
        this.setupLine();
        this.updateCamera();

        window.addEventListener('resize', () => {
            this.camera.aspect = window.innerWidth / window.innerHeight;
            this.camera.updateProjectionMatrix();
            this.renderer.setSize(window.innerWidth, window.innerHeight);
        });

        this.animate();
    }

    updateCamera() {
        this.cam = !this.cam;
        if (this.controls) {
            this.controls.dispose();
        }

        if (this.cam) {
            this.scene.background = new THREE.Color('white');
            this.scene.add(this.plane);
            this.objects.push(this.plane);

            const aspectRatio = window.innerWidth / window.innerHeight;
            const cameraSize = 5;
            this.camera = new THREE.OrthographicCamera(
                -cameraSize * aspectRatio, cameraSize * aspectRatio,
                cameraSize, -cameraSize,
                0.1, 1000
            );

            this.gridSize = 100;
            this.gridHelper = new THREE.GridHelper(this.gridSize, 100);
            this.scene.add(this.gridHelper);
        } else {
            this.scene.remove(this.gridHelper);
            this.scene.remove(this.plane);
            this.objects.pop(this.plane);

            this.gridSize = 1000;
            this.gridHelper = new THREE.GridHelper(this.gridSize, 100);
            this.gridHelper.position.y = -4;
            this.scene.add(this.gridHelper);


            this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        }

        this.controls = new OrbitControls(this.camera, this.renderer.domElement);

        if (this.camera.isPerspectiveCamera) {
            this.controls.minPolarAngle = 0;
            this.controls.maxPolarAngle = Math.PI * 0.5;
            this.camera.position.set(5, 5, 5);
            this.dragControls = new DragControls([...this.objects], this.camera, this.renderer.domElement);

            this.dragControls.addEventListener('dragstart', (event) => {
                this.controls.enabled = false;
            });

            this.dragControls.addEventListener('dragend', (event) => {
                this.controls.enabled = true;
            });
        } else {
            this.controls.enableZoom = true;
            this.controls.enableRotate = false;
            this.controls.enablePan = true;
            this.camera.position.y = 5;
        }

        this.camera.lookAt(0, 0, 0);
    }

    mesh() {
        const planeGeom = new THREE.PlaneGeometry(100, 100);
        planeGeom.rotateX(-Math.PI / 2);
        this.plane = new THREE.Mesh(
            planeGeom,
            new THREE.MeshStandardMaterial({ visible: false, color: 'red' })
        );
    }

    setupLine() {
        this.lineGeometry = new THREE.BufferGeometry();
        this.lineGeometry.setAttribute('position', new THREE.BufferAttribute(new Float32Array(0), 3));
        const material = new THREE.LineBasicMaterial({ color: 'green' });
        this.line = new THREE.Line(this.lineGeometry, material);
        this.scene.add(this.line);
    }

    updateLine() {
        const positions = new Float32Array(this.controlPoints.length * 3);

        for (let i = 0; i < this.controlPoints.length; i++) {
            positions[i * 3] = this.controlPoints[i].x;
            positions[i * 3 + 1] = 0;
            positions[i * 3 + 2] = this.controlPoints[i].z;
        }

        this.lineGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        this.lineGeometry.attributes.position.needsUpdate = true;
        this.lineGeometry.setDrawRange(0, this.controlPoints.length);

        const lengthCP = this.controlPoints.length - 1;
        const posFirstX = Math.floor(positions[0]);
        const ctrlPtFirstX = Math.floor(this.controlPoints[lengthCP].x);
        const posFirstZ = Math.floor(positions[2]);
        const ctrlPtFirstZ = Math.floor(this.controlPoints[lengthCP].z);

        if (posFirstX === ctrlPtFirstX && posFirstZ === ctrlPtFirstZ) {
            this.create();
        }
    }

    create() {
      for (let i = 0; i < this.cps.length; i++) {
        console.log('this.cps',this.cps);
        
        this.scene.remove(this.cps[i]);
    }

    if (this.controlPoints.length < 2) {
        console.error("Need at least two points");
        return;
    }

    let shape = new THREE.Shape();
    shape.moveTo(this.controlPoints[0].x, this.controlPoints[0].z);
    for (let i = 1; i < this.controlPoints.length; i++) {
        shape.lineTo(this.controlPoints[i].x, this.controlPoints[i].z);
    }
    shape.lineTo(this.controlPoints[0].x, this.controlPoints[0].z);
console.log('shape',shape);

    this.extrudeSettings = {
        // bevelSegments: 100,
        depth: 3,
        steps: 1,
    };

    var extrudeGeom = new THREE.ExtrudeGeometry(shape, this.extrudeSettings);
    extrudeGeom.rotateX(Math.PI / 2);

    let loader = new THREE.TextureLoader();
    let texture = loader.load('./images/download.jpg', () => {
        texture.wrapS = THREE.RepeatWrapping;
        texture.wrapT = THREE.RepeatWrapping;
        texture.repeat.set(1);
    });

    const material2 = new THREE.MeshStandardMaterial({transparent:true,opacity:0});
    const material1 = new THREE.MeshStandardMaterial({ map: texture, side: THREE.BackSide });
    const material = [material1, material2];
    this.wall = new THREE.Mesh(extrudeGeom, material);
    this.wall.position.y = 0;

    this.wall.scale.y = 1;
    this.wall.lookAt(0,0,0)
    this.walls.push(this.wall);
    this.scene.add(this.wall);

    const wallPoints = [...this.controlPoints]; 

    this.controlPoints = [];
    this.clickCount = 0;
    // this.updateLine(); 
    
    this.Wallcubes(wallPoints);
    }
    Wallcubes(wallPoints) {
      let point1 = new THREE.Vector3();
      let point2 = new THREE.Vector3();
      let height = this.extrudeSettings.depth//+0.5
      let thickness = 0.2;
      this.group = new THREE.Group();

      for (let i = 0; i < wallPoints.length - 1; i++) { 

          point1.set(wallPoints[i].x, 1, wallPoints[i].z);
          point2.set(wallPoints[i + 1].x, 1, wallPoints[i + 1].z);
  
          const length = point1.distanceTo(point2)//+0.19
          
          const geometry = new THREE.BoxGeometry(length, height, thickness);
          console.log('geometry',geometry);
          
          geometry.clearGroups(); 

          geometry.addGroup(0, 6, 1); //left

          geometry.addGroup(6, 6, 1); //right

          geometry.addGroup(12, 6, 2); //top

          geometry.addGroup(18, 6, 1); //bottom
          geometry.addGroup(24, 6, 1); 

          geometry.addGroup(30, 6, 0); 


console.log('geometry',geometry);
let loader = new THREE.TextureLoader();
let texture = loader.load('./images/images.jpg', () => {
  // texture.wrapS = THREE.RepeatWrapping;
  // texture.wrapT = THREE.RepeatWrapping;
  // texture.repeat.set(1);
});

          const material1 = new THREE.MeshLambertMaterial({ color: "white" });
          const material2 = new THREE.MeshLambertMaterial({ map:texture });
          const material3 = new THREE.MeshLambertMaterial({ color: "#3b3b3b" });

 const material=[material1,material2,material3]
          // geometry.rotateY(Math.PI / 2); 
  
          this.cube = new THREE.Mesh(geometry, material);
          const midpoint = new THREE.Vector3().addVectors(point1, point2).divideScalar(2) ;

          this.cube.position.copy(midpoint)
          console.log('midpoint',midpoint);
          
          this.cube.lookAt(point2);
          this.cube.rotateY(Math.PI/2)
          
          this.group.add( this.cube );
         
          this.cubes.push(this.cube);
      }
      this.group.position.y=-2.5
      // this.group.scale.x=-0.1
      this.group.scale.y=1
      this.group.scale.x=1

      this.scene.add( this.group );
      console.log('group',this.group);
      this.scene.remove(this.line)

  }
  
    onMouseDown(event) {
      const rect = this.renderer.domElement.getBoundingClientRect();
      this.mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      this.mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
              this.raycaster.setFromCamera(this.mouse, this.camera);
      
      this.intersects = this.raycaster.intersectObjects(this.objects);

      if (this.intersects.length > 0) {
          if (this.clickCount <= 100) {

              this.controlPoints[this.clickCount] = this.intersects[0].point.clone();
              this.cp = new THREE.Mesh(
                  new THREE.SphereGeometry(0.1, 8, 6),
                  new THREE.MeshBasicMaterial({ color: "green" })
              );
              this.cp.position.copy(this.intersects[0].point);
              this.updateLine()
              this.cps.push(this.cp)
              this.scene.add(this.cp);
              this.clickCount++;
            }}  }

    select(event) {
        const rect = this.renderer.domElement.getBoundingClientRect();
        this.mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
        this.mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
        this.raycaster.setFromCamera(this.mouse, this.camera);

        const intersectsForDelete = this.raycaster.intersectObjects([...this.cubes, this.wall]);

        if (intersectsForDelete.length > 0) {
            this.scene.remove(intersectsForDelete[0].object);
        }
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
