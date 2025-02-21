import * as THREE from "three";
import TWEEN from 'https://cdn.jsdelivr.net/npm/@tweenjs/tween.js@18.6.4/dist/tween.esm.js'
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
// import { DragControls } from 'three/addons/controls/DragControls.js';
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { TransformControls } from "three/examples/jsm/controls/TransformControls.js";
import { CSG } from 'three-csg-ts'; 
import { Sky } from "three/addons/objects/Sky.js";
import { MathUtils, Vector3 } from "three";
import store from "../Store/index.js";


import { CSG } from 'three-csg-ts'; 
import { Sky } from "three/addons/objects/Sky.js";
import { MathUtils, Vector3 } from "three";
import store from "../Store/index.js";



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
      this.renderer.shadowMap.enabled = true;
      this.renderer.shadowMap.type = THREE.PCFSoftShadowMap; 

      this.renderer.physicallyCorrectLights = true;
        this.renderer.setSize(
        this.container.clientWidth,
        this.container.clientHeight
      );
      this.container.appendChild(this.renderer.domElement);

      this.camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight,0.1,1000);

      const light = new THREE.AmbientLight("white"); 
      this.scene.add(light);

      const directionalLight = new THREE.DirectionalLight( 'white', 2 );
      directionalLight.castShadow=true
      directionalLight.shadow.mapSize.width = 1024;
      directionalLight.shadow.mapSize.height = 1024;
      
      this.scene.add( directionalLight )

      const pointLight = new THREE.PointLight( 'white', 50, 100 );
      pointLight.position.set( 0, 2, 0 );
      pointLight.castShadow=true
      this.scene.add( pointLight );
      let sky = new Sky();
      sky.scale.setScalar(450000);
  
      let phi = MathUtils.degToRad(80);
      let theta = MathUtils.degToRad(180);
      let sunPosition = new Vector3().setFromSphericalCoords(1, phi, theta);
  
      sky.material.uniforms.sunPosition.value = sunPosition;
      sky.material.uniforms.rayleigh.value = 1;
      sky.material.uniforms.turbidity.value = 0;
  
      this.scene.add(sky);
  
      this.controls = new OrbitControls(this.camera, this.renderer.domElement);
      this.controls.minDistance = 0.2;
      this.controls.maxDistance = 40;
      this.controls.autoRotateSpeed  =0.5
      this.controls.enableDamping=true
      this.camera.position.set(0, 15, 35);

 

// this.dragControls = new DragControls(this.gltfArray, this.camera, this.renderer.domElement);
// this.dragControls.transformGroup = true;

// let boxHelper;

// this.dragControls.addEventListener('dragstart', (event) => {

//     this.controls.enabled = false;
//     console.log('event',event);
    
//     event.object.userData.lastValidPosition = event.object.position.clone();


//     boxHelper = new THREE.BoxHelper(event.object, 0x00ff00); 
//     this.scene.add(boxHelper);

//     this.roomBox = new THREE.Box3().setFromObject(this.group); 
//     this.modelBox = new THREE.Box3().setFromObject(event.object); 
// });

// this.dragControls.addEventListener('drag', (event) => {
//     this.modelBox.setFromObject(event.object);

//     if (!this.roomBox.containsBox(this.modelBox)) {
//         event.object.position.copy(event.object.userData.lastValidPosition);
//         boxHelper.material.color.set(0xff0000); // Red color for intersection
//     } else {
//         event.object.userData.lastValidPosition.copy(event.object.position);
//         boxHelper.material.color.set(0x00ff00); 
//     }

//     // Keep the object on the floor
//     event.object.position.y = 0;

//     // Ensure the helper updates its position
//     boxHelper.update();
// });

// this.dragControls.addEventListener('dragend', (event) => {

//     this.controls.enabled = true;

//     // Final position adjustment
//     event.object.position.y = 0;

//     // Remove the BoxHelper from the scene
//     if (boxHelper) {
//         this.scene.remove(boxHelper);
//         boxHelper.geometry.dispose(); // Clean up geometry
//         boxHelper.material.dispose(); // Clean up material
//         boxHelper = null;
//     }
// });


    
      window.addEventListener("resize", () => {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
      });



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
    
                this.cubes.forEach((wall) => {
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
    let ceiling=null
      const loader = new GLTFLoader();
      loader.load(
        droppedText.filePath,
        (gltf) => {
            
            if(droppedText.variant == "Top"){
              ceiling = +3
            }
            else{
              ceiling = -3
            }
              this.gltfbox = new THREE.Box3().setFromObject(gltf.scene);
              this.size = new THREE.Vector3();
              this.center = new THREE.Vector3();
              this.gltfbox.getSize(this.size);
              this.gltfbox.getCenter(this.center);
  
              let maxSize = Math.max(this.size.x, this.size.y, this.size.z);
              gltf.scene.scale.setScalar(1 / (maxSize / 4));

              gltf.scene.traverse((node) => {
                if (node.isMesh) {
                  node.castShadow = true;
                  node.receiveShadow = true;
                }
              });   

              const model = gltf.scene;
              model.rotation.set(0, angleX, 0); 

              this.raycaster.setFromCamera(mouse, this.camera);
              const plane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);
              const intersectPoint = new THREE.Vector3();
              if (this.raycaster.ray.intersectPlane(plane, intersectPoint)) {
                const adjustedBox = new THREE.Box3().setFromObject(model);
                const bottomY = adjustedBox.min.y;
                const offsetY = -bottomY

              if (finalPosition) {
                  model.position.set(finalPosition.x,offsetY+ceiling,finalPosition.z); 
                  this.roomBox.clampPoint(model.position, model.position);
              } else {
                  model.position.set(intersectPoint.x, offsetY+ceiling, intersectPoint.z);
                  this.roomBox.clampPoint(model.position, model.position);
                  }
              }
              this.group3=new THREE.Group()
              this.group3.add(model)
              this.gltfArray.push(this.group3);

              this.scene.add(this.group3);
              
              // new TWEEN.Tween(this.camera.position)
              //     .to({ x: -8, y: 5, z: 10 }, 3000)
              //     .easing(TWEEN.Easing.Quadratic.InOut)
              //     .start();
          },
          undefined,
          (error) => {
              console.error("Error loading GLTF model:", error);
          }
      );
  });
  
  this.transformControls = new TransformControls(this.camera, this.renderer.domElement);
  this.transformControls.showY = false
  this.scene.add(this.transformControls);


 this.renderer.domElement.addEventListener('click',(event)=>{
  const rect = this.renderer.domElement.getBoundingClientRect();
  this.mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
  this.mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

  this.raycaster.setFromCamera(this.mouse, this.camera);

  const intersects = this.raycaster.intersectObjects(this.gltfArray, true);

  if (intersects.length > 0) {
        let intersectedObject = intersects[0].object

        while (
          intersectedObject.parent &&
          !this.gltfArray.includes(intersectedObject)
        ) {
          intersectedObject = intersectedObject.parent;
        }
        
        this.gizmo = this.transformControls.getHelper();
        this.gizmo.position.copy(intersectedObject.children[0].position)
        this.scene.add(this.gizmo);

        this.transformControls.attach(intersectedObject)
        this.transformModel()
        store.commit('studioFunctionality',{value:true,position:event,gltf:intersectedObject})

  }
  else{
    this.scene.remove(this.gizmo);
    store.commit('studioFunctionality',{value:false,position:event})

  }
})

  window.addEventListener('keydown',  (event) =>{
      switch (event.key) {
          case 't':
              this.transformControls.setMode('translate');
              break;
          case 'r':
              this.transformControls.setMode('rotate');
              break;
          case 's':
              this.transformControls.setMode('scale');
              break;
      }
  });
    
      this.animate();
      this.create();
      this.gltfLoading()

      this.windowPD()
    // this.cube();
    }
    transformModel() {
      let boxHelper;
      this.transformControls.addEventListener('dragging-changed', (event) => {
          this.controls.enabled = !event.value;
  // console.log('event',event);
  
          if (event.value === true) {
              // console.log('event', intersectedObject);
  
              event.target.object.userData.lastValidPosition = event.target.object.position.clone();
  
              boxHelper = new THREE.BoxHelper(event.target.object, 0x00ff00);
              this.scene.add(boxHelper);
  
              this.roomBox = new THREE.Box3().setFromObject(this.group);
              this.modelBox = new THREE.Box3().setFromObject(event.target.object);
  
              this.transformControls.addEventListener('objectChange', (event) => {
                  if (event.target && event.target.object) {
                      this.modelBox.setFromObject(event.target.object);
  
                      if (!this.roomBox.containsBox(this.modelBox) || !this.roomBox.intersectsBox(this.wardrobeBox)) {
                        
                          event.target.object.position.copy(event.target.object.userData.lastValidPosition);
                          boxHelper.material.color.set(0xff0000); // Red color for intersection
                      } else {
                        
                          event.target.object.userData.lastValidPosition.copy(event.target.object.position);
                          boxHelper.material.color.set(0x00ff00); // Green color for valid position
                      }
  
                      event.target.object.position.y = 0;
  
                      boxHelper.update();
                  }
              });
          } else {
              // Remove the BoxHelper from the scene
              if (boxHelper) {
                  this.scene.remove(boxHelper);
                  boxHelper.geometry.dispose(); // Clean up geometry
                  boxHelper.material.dispose(); // Clean up material
                  boxHelper = null;
              }
          }
      });
  
  
    }
    cube() {
    
      const box = new THREE.Mesh(
        new THREE.BoxGeometry(2, 1, 2),
        new THREE.MeshNormalMaterial()
      );
      const sphere = new THREE.Mesh(new THREE.SphereGeometry(1.2, 8, 8),new THREE.MeshNormalMaterial());
      
      // Make sure the .matrix of each mesh is current
      box.updateMatrix();
      sphere.updateMatrix();
      
      // Perform CSG operations
      // The result is a THREE.Mesh that you can add to your scene...
      const subRes = CSG.subtract(box,sphere);
      const uniRes = CSG.union(box, sphere);
      const intRes = CSG.intersect(box, sphere);
      this.scene.add(intRes)
      this.camera.position.z = 5;
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
    this.ceil(extrudeGeom)
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

            const material1 = new THREE.MeshStandardMaterial({ color:'#f2f2f4',side: THREE.FrontSide});
            const material2 = new THREE.MeshStandardMaterial({ color:'#f2f2f4', side: THREE.BackSide});
            const material3 = new THREE.MeshStandardMaterial({ transparent:true,opacity:0});

            this.material=[material1,material2,material3]
    
            this.room = new THREE.Mesh(geometry, this.material);
            const midpoint = new THREE.Vector3().addVectors(point1, point2).divideScalar(2) ;
            this.room.position.copy(midpoint)
            this.room.receiveShadow=true
            this.room.castShadow=true
            this.room.lookAt(point2);
            this.room.rotateY(Math.PI/2)
            this.group.add( this.room );
    
            this.box1 = new THREE.Box3().setFromObject(this.group);

            this.boxes.push(this.box1)
            this.cubes.push(this.room);
        }
        this.group.position.y=0

        this.group.scale.y=this.yAxis
        this.group.scale.x=1
        this.scene.add( this.group );


    }
    ceil(geometry) {
      let loader = new THREE.TextureLoader();
      let texture = loader.load("./images/ceil.jpeg", () => {
        texture.wrapS = THREE.RepeatWrapping;
        texture.wrapT = THREE.RepeatWrapping;
        texture.repeat.set(1, 1);
      });
      let material = new THREE.MeshStandardMaterial({
        color:'#f2f2f4',
        side: THREE.FrontSide,
        roughness:0.5
      });
  
      let ceil = new THREE.Mesh(geometry, material);
      ceil.rotateX(Math.PI / 2);
         ceil.castShadow=true
         ceil.receiveShadow=true
      ceil.position.y = 4;
      // this.scene.add(ceil);
      this.group.add(ceil);
    }
    gltfLoading() {
      if(this.model){
        this.scene.remove(this.group2); 
        this.group2.clear(); // Remove all children from the group
  
      }
      const loader = new GLTFLoader();
    
      loader.load(
        './wardrobe.glb',
        (gltf) => {
          if (!gltf.scene) {
            console.error("Loaded GLTF does not contain a scene.");
            return;
          }
    
          // Calculate bounding box and scale
          this.wardrobeBox = new THREE.Box3().setFromObject(gltf.scene);
          const size = new THREE.Vector3();
          this.wardrobeBox.getSize(size);

          const maxSize = Math.max(size.x, size.y, size.z);
          const desiredSize = 5;
          gltf.scene.scale.setScalar(desiredSize / maxSize);
          gltf.scene.traverse((node) => {
            if (node.isMesh) {
              node.castShadow = true;
              node.receiveShadow = true;
            }
          });   

                         this.model = gltf.scene;
      
         this.model.position.set(-3,-3,-4)
          this.group2 = new THREE.Group();
          this.group2.add(this.model)
          this.gltfArray.push(this.group2)
          this.scene.add( this.group2);

        },
        undefined,
        (error) => {
          console.error("Failed to load model:", error);
        }
      );
    }
    windowPD() {
      const loader = new GLTFLoader();
      loader.load(
        './window.glb',
        (gltf) => {
          if (!gltf.scene) {
            console.error("Loaded GLTF does not contain a scene.");
            return;
          }
    
          gltf.scene.traverse((node) => {
            if (node.isMesh) {
              node.castShadow = true;
              node.receiveShadow = true;
            }
          });
    
          const box = new THREE.Box3().setFromObject(gltf.scene); 
          const size = new THREE.Vector3();
          box.getSize(size);
    
          const maxSize = Math.max(size.x, size.y, size.z);
          const desiredSize = 4;
          gltf.scene.scale.setScalar(desiredSize / maxSize);
    
          gltf.scene.position.x = -6.2;
          this.transformedBox = new THREE.Box3().setFromObject(gltf.scene);
    
          const updateCSG = () => {
            this.transformedBox.setFromObject(gltf.scene);
    
            if (this.box1.intersectsBox(this.transformedBox)) {
              console.log('Boxes intersected!', this.transformedBox);
    
              const sizeTransform = new THREE.Vector3();
              this.transformedBox.getSize(sizeTransform);
              const centerTransform = new THREE.Vector3();
              this.transformedBox.getCenter(centerTransform);
    
              const updatedWall = new THREE.Mesh(
                new THREE.BoxGeometry(sizeTransform.x, sizeTransform.y - 1.5, sizeTransform.z - 0.5),
                new THREE.MeshStandardMaterial({ color: 'red' })
              );
              updatedWall.position.set(centerTransform.x - 0.1, centerTransform.y - 1, centerTransform.z);
              updatedWall.updateWorldMatrix();
    
              const newCSGResult = CSG.subtract(this.room, updatedWall);
    
              newCSGResult.scale.set(1, 1.5, 1);
              newCSGResult.position.y = +1.5;
              newCSGResult.material = this.material;
              newCSGResult.updateMatrix();
    
              if (this.currentCSG) {
                this.scene.remove(this.currentCSG); 
              }
    
              this.scene.add(newCSGResult);
              this.group.remove(this.room);
              this.scene.remove(this.room);
    
              this.currentCSG = newCSGResult; 
            }
          };
    
          updateCSG();
    
          this.transformControls.addEventListener('change', updateCSG);
    
          this.gltfArray.push(gltf.scene);
          this.scene.add(gltf.scene);
        }
      );
    }

    deleteGltf(gltfObj){
      console.log('gltfObj',gltfObj);
      this.scene.remove(gltfObj)
      this.transformControls.detach(gltfObj)

    }
    rotateGltf(gltfObj){
      gltfObj.rotateY(Math.PI/2)
      this.transformControls.detach(gltfObj)

    }

    
    
    animate() {
        requestAnimationFrame(() => this.animate());
        this.controls.update();
        // this.transformControls.update();
        TWEEN.update()
        this.render();
      }
    
      render() {
        this.renderer.render(this.scene, this.camera);
      }
    }