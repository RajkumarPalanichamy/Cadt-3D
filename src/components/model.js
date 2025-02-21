import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

export default class modelScene {
    constructor(container) {
        console.log(container);
        
        this.container = container;
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color("black");
      
        this.renderer = new THREE.WebGLRenderer({ antialias: true });
        this.renderer.shadowMap.enabled = true;
        this.renderer.setSize(this.container.clientWidth, this.container.clientHeight);
        this.container.appendChild(this.renderer.domElement);
      
        this.camera = new THREE.PerspectiveCamera(75, this.container.clientWidth / this.container.clientHeight, 0.5, 1000);
        this.camera.position.set(-3, 2, -1);
      
        this.controls = new OrbitControls(this.camera, this.renderer.domElement);
        this.controls.enableDamping = true;
      
        window.addEventListener("resize", this.onWindowResize.bind(this));
        this.initLights();
        this.animate();
      }
      

  initLights() {
    const directionalLight = new THREE.DirectionalLight("white", 2);
    directionalLight.position.set(5, 5, 5);
    directionalLight.castShadow = true;
    directionalLight.shadow.mapSize.set(1024, 1024);
    this.scene.add(directionalLight);

    const ambientLight = new THREE.AmbientLight("black", 0.8);
    this.scene.add(ambientLight);
  }

  onWindowResize() {
    this.camera.aspect = this.container.clientWidth / this.container.clientHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(this.container.clientWidth, this.container.clientHeight);
  }

  gltf(modelLink) {
    const loader = new GLTFLoader();
    loader.load(modelLink, (gltf) => {
      const model = gltf.scene;
      this.centerAndScaleModel(model);
      this.scene.add(model);
      console.log("vbn");
      
    });
    this.addGroundPlane();
  }

  centerAndScaleModel(model) {
    const box = new THREE.Box3().setFromObject(model);
    const size = new THREE.Vector3();
    const center = new THREE.Vector3();
    box.getSize(size);
    box.getCenter(center);
    
    const maxSize = Math.max(size.x, size.y, size.z);
    const desiredSize = 3;
    const scale = desiredSize / maxSize;
    model.scale.setScalar(scale);
    
    model.position.set(-center.x, -box.min.y, -center.z);
    model.traverse((node) => {
      if (node.isMesh) {
        node.castShadow = true;
        node.receiveShadow = true;
      }
    });
  }

  addGroundPlane() {
    const geometry = new THREE.PlaneGeometry(100, 100);
    const material = new THREE.MeshStandardMaterial({ color: "white", roughness: 0 });
    const plane = new THREE.Mesh(geometry, material);
    plane.receiveShadow = true;
    plane.rotation.x = -Math.PI / 2;
    this.scene.add(plane);
  }

  texture(textureLink) {
    const loader = new THREE.TextureLoader();
    const texture = loader.load(textureLink);
    const material = new THREE.MeshBasicMaterial({ map: texture });
    const cube = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), material);
    this.scene.add(cube);
  }

  animate() {
    requestAnimationFrame(() => this.animate());
    this.controls.update();
    this.renderer.render(this.scene, this.camera);
  }
}
