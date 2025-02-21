import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

export default class Configurator{
    constructor(container){
        this.container = container;
        this.scene = null;
        this.camera = null;
        this.renderer = null;
    this.angle=null;
        this.init();
    
    }
    init(){
        this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color("#D8D8D8");

    this.renderer = new THREE.WebGLRenderer({
      antialias: true,
      preserveDrawingBuffer: true,
    });
    this.renderer.physicallyCorrectLights = true;
    this.renderer.shadowMap.enabled = true;
this.renderer.shadowMap.type = THREE.PCFSoftShadowMap; 
    this.renderer.setSize(
      this.container.clientWidth,
      this.container.clientHeight
    );
    this.container.appendChild(this.renderer.domElement);
    
    this.camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.5,
      1000
    );
    this.directionalLight = new THREE.DirectionalLight("white", 5);

    const targetObject = new THREE.Object3D();
    targetObject.position.set(0, 0, 0);
    this.scene.add(targetObject);

    this.directionalLight.castShadow=true
    this.directionalLight.shadow.mapSize.width = 1024;
this.directionalLight.shadow.mapSize.height = 1024;
    this.scene.add(this.directionalLight);
this.angle = 0;
    const light = new THREE.AmbientLight("white",10); 
    this.scene.add(light);

   
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);

    window.addEventListener("resize", () => {
      this.camera.aspect = window.innerWidth / window.innerHeight;
      this.camera.updateProjectionMatrix();
      this.renderer.setSize(window.innerWidth, window.innerHeight);
    });
   this.door()
    this.animate();
    }
    door(color){
         const loader = new GLTFLoader();
            loader.load('./door (1).glb', (gltf) => {
        
              const box = new THREE.Box3().setFromObject(gltf.scene);
              const size = new THREE.Vector3();
              const center = new THREE.Vector3();
              box.getSize(size);
              box.getCenter(center);
          
              const maxSize = Math.max(size.x, size.y, size.z);
              const desiredSize = 3; 
              const scale = desiredSize / maxSize;
          
              gltf.scene.scale.setScalar(scale);
              this.camera.position.set(2, 0, 2);
              this.scene.add(gltf.scene)

              gltf.scene.traverse((node) => {
                if (node.isMesh) {
                    if (node.material.map) {
                        node.material.map = null;  // Remove texture
                        node.material.needsUpdate = true;  // Update material
                    }
                 
                        console.log("Children of Door:", node.children);
                        node.children.forEach((subPart) => {
                            console.log("Sub-part:", subPart.name);
                        });
                    
                  node.castShadow = true;
                  node.receiveShadow = true;
                // node.material.color='red'
                //  node.material.blendColor='red'

                node.material.color.set(color?color:'red'); // Set color (red)
                node.material.metalness=1

            node.material.needsUpdate = true;
            
                }
            })
            }
        )}
    animate() {
        requestAnimationFrame(() => this.animate());
        this.controls.update();
        this.angle += 0.01; // Speed of rotation
        const radius = 5; // Distance from center
        this.directionalLight.position.x = Math.cos(this.angle) * radius;
        this.directionalLight.position.z = Math.sin(this.angle) * radius;
        this.directionalLight.position.y = 2; // Keep height constant
    
        this.directionalLight.target.updateMatrixWorld(); // Update light direction
    
        this.render();
      }
    
      render() {
        this.renderer.render(this.scene, this.camera);
      }
}