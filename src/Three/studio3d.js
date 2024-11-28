import * as THREE from "three";
import TWEEN from 'https://cdn.jsdelivr.net/npm/@tweenjs/tween.js@18.6.4/dist/tween.esm.js'
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { DragControls } from 'three/addons/controls/DragControls.js';
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
export default class studio3dThreeScene {
    constructor(container) {
      this.container = container;
      this.scene = null;
      this.camera = null;
      this.renderer = null;
  this.cubes=[];
  this.walls=[];
  this.gltfArray=[];
  this.boxes=[];
  this.group = new THREE.Group();
  this.raycaster = new THREE.Raycaster();
  this.mouse = new THREE.Vector2();


      this.init();

    }
    init() {
      this.scene = new THREE.Scene();
      this.scene.background = new THREE.Color("white");
  
      this.renderer = new THREE.WebGLRenderer({
        antialias: true,
        preserveDrawingBuffer: true
      });
      this.renderer.physicallyCorrectLights = true;
        this.renderer.setSize(
        this.container.clientWidth,
        this.container.clientHeight
      );
      this.container.appendChild(this.renderer.domElement);

      this.camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight,0.1,1000);

      const light = new THREE.AmbientLight("white"); 
      this.scene.add(light);

      const directionalLight = new THREE.DirectionalLight( 'white', 1 );
      directionalLight.castShadow=true
      this.scene.add( directionalLight )

      const pointLight = new THREE.PointLight( 'white', 50, 100 );
      pointLight.position.set( 0, 0.5, 0 );
      this.scene.add( pointLight );
    
      this.controls = new OrbitControls(this.camera, this.renderer.domElement);
      this.controls.minDistance = 0.2;
      this.controls.maxDistance = 40;
      this.controls.autoRotateSpeed  =0.5
      this.controls.enableDamping=true
      this.camera.position.set(0, 15, 35);
  
      this.dragControls = new DragControls( this.gltfArray, this.camera, this.renderer.domElement );

      this.dragControls.addEventListener('dragstart', (event) => {
        event.object.material.emissive.set(0xaaaaaa);
        this.controls.enabled = false;
    
        event.object.userData.lastValidPosition = event.object.position.clone();
    
        this.roomBox = new THREE.Box3().setFromObject(this.group); 
        this.modelBox = new THREE.Box3().setFromObject(event.object); 
    });
    
    this.dragControls.addEventListener('drag', (event) => {
        this.modelBox.setFromObject(event.object);
    
        if (!this.roomBox.containsBox(this.modelBox)) {
            event.object.position.copy(event.object.userData.lastValidPosition); 
            event.object.material.emissive.set(0xff0000); 
        } else {
            event.object.userData.lastValidPosition.copy(event.object.position);
            event.object.material.emissive.set(0xaaaaaa); 
        }
    });
    
    this.dragControls.addEventListener('dragend', (event) => {
        event.object.material.emissive.set(0x000000);
        this.controls.enabled = true;
    });
    
      window.addEventListener("resize", () => {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
      });

      //for loading new models in scene

      let placeholder;
      window.addEventListener("model-drag-start", (event) => {
        const { droppedText, mouse } = event.detail;
      
        const loader = new GLTFLoader();
        loader.load(
          droppedText,
          (gltf) => {
            if (placeholder) {
              this.scene.remove(placeholder);
            }
      
            placeholder = gltf.scene;
      
            let box = new THREE.Box3().setFromObject(placeholder);
            let size = new THREE.Vector3();
            box.getSize(size);
      
            let maxSize = Math.max(size.x, size.y, size.z);
            placeholder.scale.setScalar(1 / (maxSize / 4));
      
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

                    // Position the model so its bottom aligns with the plane
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
      
        if (placeholder) {

          this.raycaster.setFromCamera(mouse, this.camera);
          const plane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);
          const intersectPoint = new THREE.Vector3();
          if (this.raycaster.ray.intersectPlane(plane, intersectPoint)) {
            placeholder.position.set(intersectPoint.x,intersectPoint.y-2,intersectPoint.z);
           }
        }
      });
      
      window.addEventListener("model-drop", (event) => {
        const { droppedText, mouse } = event.detail;
      
        if (placeholder) {
          this.scene.remove(placeholder);
          placeholder = null;
        }
      
        const loader = new GLTFLoader();
        loader.load(
          droppedText,
          (gltf) => {
            this.gltfbox = new THREE.Box3().setFromObject(gltf.scene);
            this.size = new THREE.Vector3();
            this.center = new THREE.Vector3();
            this.gltfbox.getSize(this.size);
            this.gltfbox.getCenter(this.center);

            let maxSize = Math.max(this.size.x, this.size.y, this.size.z);
            gltf.scene.scale.setScalar(1 / (maxSize / 4));
      
            const model = gltf.scene;
      
            this.raycaster.setFromCamera(mouse, this.camera);
            const plane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 2);
            const intersectPoint = new THREE.Vector3();
            if (this.raycaster.ray.intersectPlane(plane, intersectPoint)) {
              // model.position.copy(intersectPoint);
              const adjustedBox = new THREE.Box3().setFromObject(model);
              const adjustedSize = new THREE.Vector3();
              const adjustedCenter = new THREE.Vector3();
              adjustedBox.getSize(adjustedSize);
              adjustedBox.getCenter(adjustedCenter);
          
              // Position the model so its bottom aligns with the plane
              const bottomY = adjustedBox.min.y;
              const offsetY = -bottomY;
            //offsetY-(-this.groundValue)-1
            model.position.set(intersectPoint.x, offsetY-3, intersectPoint.z);
           
            }
            
              this.gltfArray.push(model)
            this.scene.add(model);
          },
          undefined,
          (error) => {
            console.error("Error loading GLTF model:", error);
          }
        );
      });

      this.animate();
      this.create();
      // this.gltfLoading()
    }
    cube(){
        const geometry = new THREE.BoxGeometry(1, 1, 1);
        const material = new THREE.MeshBasicMaterial({ color:'red', side: THREE.FrontSide });
        const cube = new THREE.Mesh(geometry, material);
        this.scene.add(cube);
        this.camera.position.z = 1.5;
    
    }
    create(wallValues) {
      
      this.scene.remove(this.group); 
      this.group.clear(); // Remove all children from the group
  
      // Clear all references to old walls, boxes, and cubes
      this.walls = [];
      this.cubes = [];
      this.boxes = [];

      setTimeout(()=>{
        new TWEEN.Tween(this.camera.position)
        .to({ x: 5, y: 5, z: 10 }, 3000)
        .easing(TWEEN.Easing.Quadratic.InOut)
        .start();
  
      },500)
      
      // this.xAxis = wallValues?.width ?? 5; 
      // this.zAxis = wallValues?.height ?? 5; 
      this.xAxis = wallValues?.width == null ? 5 : wallValues.width;
      this.zAxis = wallValues?.height == null ? 5 : wallValues.height;
              // this.zAxis=5
                 
        this.controlPoints = [  {x : -this.xAxis,  y : 0, z : -this.zAxis},
                                {x :  this.xAxis,  y : 0, z : -this.zAxis},
                                {x :  this.xAxis,  y : 9, z :  this.zAxis},
                                {x : -this.xAxis,  y : 0, z :  this.zAxis},
                                {x : -this.xAxis,  y : 0, z : -this.zAxis}
                             ];
    // this.yAxis=1.5
    this.yAxis = wallValues?.depth == null ? 1.5 : wallValues.depth;

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


    var extrudeGeom = new THREE.ShapeGeometry(shape);
    let loader = new THREE.TextureLoader();
    let texture = loader.load("./images/wood.jpg", () => {
      texture.wrapS = THREE.RepeatWrapping;
      texture.wrapT = THREE.RepeatWrapping;
      texture.repeat.set(1, 1);
    });

    let material = new THREE.MeshStandardMaterial({
      map: texture,
      side: THREE.FrontSide,
      roughness:0.4
    });
    this.wall = new THREE.Mesh(extrudeGeom, material);
    this.wall.scale.y = 1;
    this.wall.receiveShadow=true
    this.wall.castShadow=true
    this.wall.position.y=-2
    this.wall.lookAt(0,0,0)

    this.walls.push(this.wall);
        this.group.add(this.wall);

    const wallPoints = [...this.controlPoints]; 

    this.controlPoints = [];
    this.clickCount = 0;
    
    this.Wallcubes(wallPoints);
}
    Wallcubes(wallPoints) {
        let point1 = new THREE.Vector3();
        let point2 = new THREE.Vector3();
        // let height = this.extrudeSettings.depth+5.5+this.yAxis
        let thickness = 0.01;

        for (let i = 0; i < wallPoints.length - 1; i++) { 
            point1.set(wallPoints[i].x, 1, wallPoints[i].z);
            point2.set(wallPoints[i + 1].x, 1, wallPoints[i + 1].z);
    
            const length = point1.distanceTo(point2)+0.08
            const geometry = new THREE.BoxGeometry(length,6, thickness);
            
            geometry.clearGroups(); 

            geometry.addGroup(0, 6, 1); //left

            geometry.addGroup(6, 6, 1); //right

            geometry.addGroup(12, 6, 2); //top

            geometry.addGroup(18, 6, 1); //bottom
            geometry.addGroup(24, 6, 1); 

            geometry.addGroup(30, 6, 0); 


            this.localPlane = new THREE.Plane(new THREE.Vector3);

            const material1 = new THREE.MeshStandardMaterial({ color:'#f2f2f4',side: THREE.FrontSide,roughness:0.7});
            const material2 = new THREE.MeshStandardMaterial({ color:'#f2f2f4', side: THREE.BackSide,roughness:0.7});
            const material3 = new THREE.MeshStandardMaterial({ transparent:true,opacity:0});

            this.material=[material1,material2,material3]
    
            this.room = new THREE.Mesh(geometry, this.material);
            const midpoint = new THREE.Vector3().addVectors(point1, point2).divideScalar(2) ;
            this.room.position.copy(midpoint)
            // this.room.receiveShadow=true
            // this.room.castShadow=true
            this.room.lookAt(point2);
            this.room.rotateY(Math.PI/2)
            this.group.add( this.room );
    
            this.box1 = new THREE.Box3().setFromObject(this.room);
            this.boxes.push(this.box1)
            this.cubes.push(this.room);
        }
        this.group.position.y=0

        this.group.scale.y=this.yAxis
        this.group.scale.x=1
        this.scene.add( this.group );
        

    }
    gltfLoading() {
      const loader = new GLTFLoader();
    
      loader.load(
        './wardrobe.glb',
        (gltf) => {
          if (!gltf.scene) {
            console.error("Loaded GLTF does not contain a scene.");
            return;
          }
    
          // Calculate bounding box and scale
          const box = new THREE.Box3().setFromObject(gltf.scene);
          const size = new THREE.Vector3();
          box.getSize(size);
          const maxSize = Math.max(size.x, size.y, size.z);
          const desiredSize = 5;
          gltf.scene.scale.setScalar(desiredSize / maxSize);

          this.group2 = new THREE.Group();
          this.gltfObj = gltf.scene;
    
          this.group2.add(this.gltfObj)
          this.gltfArray.push(this.group2)
          this.scene.add( this.group2);
    
          this.box2 = new THREE.Box3().setFromObject(this.group2);
        },
        undefined,
        (error) => {
          console.error("Failed to load model:", error);
        }
      );
    }
    
    
    animate() {
        requestAnimationFrame(() => this.animate());
        this.controls.update();
        TWEEN.update()
        this.render();
      }
    
      render() {
        this.renderer.render(this.scene, this.camera);
      }
    }