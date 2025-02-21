import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

export default class Configurator{
    constructor(container){
        this.container = container;
        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.angle = null;
        this.init();
        this.position;
        this.rotation;
        this.model;
    }
    init(){
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color("lightblue");

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
        this.directionalLight = new THREE.DirectionalLight("white",0.1);

        const targetObject = new THREE.Object3D();
        targetObject.position.set(0, 0, 0);
        this.scene.add(targetObject);

        this.directionalLight.castShadow = true;
        this.directionalLight.shadow.mapSize.width = 1024;
        this.directionalLight.shadow.mapSize.height = 1024;
        this.scene.add(this.directionalLight);
        this.angle = 0;
        const light = new THREE.AmbientLight("white"); 
        this.scene.add(light);

        this.controls = new OrbitControls(this.camera, this.renderer.domElement);

        window.addEventListener("resize", () => this.handleResize());
        this.door();
        this.animate();
    }
    loadModel(path) {
        this.model.traverse((node) => {
            if (node.isMesh ) {
                if(node.name === "Handle_Bar"){
                
                    if (node.material.map) {
                        node.material.map = null; 
                        node.material.needsUpdate = true; 
                    }
                    node.visible = false; 

                    this.position = new THREE.Vector3();
                    node.getWorldPosition(this.position);

                    this.rotation = new THREE.Euler();
                    this.rotation.copy(node.getWorldQuaternion(new THREE.Quaternion()).normalize());
                
                    const loader = new GLTFLoader();
                    loader.load(path, (gltf) => {
                        const model = gltf.scene;
                        const box = new THREE.Box3().setFromObject(gltf.scene);
                        const size = new THREE.Vector3();
                        const center = new THREE.Vector3();
                        box.getSize(size);
                        box.getCenter(center);
    
                        const maxSize = Math.max(size.x, size.y, size.z);
                        const desiredSize = 0.8; 
                        const scale = desiredSize / maxSize;
    
                        gltf.scene.scale.setScalar(scale);
                        model.position.set(this.position.x, this.position.y, this.position.z);
    
                        if (this.currentModel) {
                            this.scene.remove(this.currentModel);
                        }
                        
                        this.scene.add(model);
                        this.currentModel = model;
                        console.log(this.scene);
                    });
                }
            }
        });
    }
    glass(path){
        this.model.traverse((node) => {
            if (node.isMesh ) {
                if(node.name == "Glass"){
                    if (node.material.map) {
                        node.material.map = null; 
                        node.material.needsUpdate = true; 
                    }
                    node.material = new THREE.MeshPhysicalMaterial({
                        color: new THREE.Color("white"),
                        metalness: 0,
                        roughness: 0,
                        transmission: 0.9,
                        ior: 1.5,
                        thickness: 0.2,
                    });

                    const textureLoader = new THREE.TextureLoader();
                    textureLoader.load(path, (texture) => {
                        texture.wrapS = THREE.RepeatWrapping; 
                        texture.wrapT = THREE.RepeatWrapping;
                        texture.anisotropy = 16; 
                        
                        node.material.map = texture;
                        node.material.needsUpdate = true;
                    });
                }
            }
        });
    }
    material(color, type){
        this.model.traverse((node) => {
            if (node.isMesh ) {
                if (node.material.map) {
                    node.material.map = null; 
                    node.material.needsUpdate = true; 
                }
                if(node.name != "Glass"){
                    node.material = new THREE.MeshPhysicalMaterial({
                        color: new THREE.Color("white"),
                        metalness: 0,
                        roughness: 0,
                        transmission: 0.9,
                        ior: 1.5,
                        thickness: 0.2,
                    });
                    
                    if (type === "color") {
                        node.material.color.set(color || 'red'); 
                        node.material.metalness = 1;
                        node.material.needsUpdate = true;
                    } else {
                        const textureLoader = new THREE.TextureLoader();
                        textureLoader.load(color, (texture) => {
                            texture.wrapS = THREE.RepeatWrapping; 
                            texture.wrapT = THREE.RepeatWrapping;
                            texture.anisotropy = 16;
                            
                            node.material.map = texture;
                            node.material.needsUpdate = true;
                        });
                    }
                }
            }
        });
    }
    door() {
        const loader = new GLTFLoader();
        loader.load('./door1.glb', (gltf) => {
            const box = new THREE.Box3().setFromObject(gltf.scene);
            const size = new THREE.Vector3();
            const center = new THREE.Vector3();
            box.getSize(size);
            box.getCenter(center);

            const maxSize = Math.max(size.x, size.y, size.z);
            const desiredSize = 3; 
            const scale = desiredSize / maxSize;

            gltf.scene.scale.setScalar(scale);
            this.camera.position.set(-2, 0, 2);
            this.scene.add(gltf.scene);
            this.model = gltf.scene;
        });
    }
    handleResize() {
        this.camera.aspect = this.container.clientWidth / this.container.clientHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(this.container.clientWidth, this.container.clientHeight);
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
