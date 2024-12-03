import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

export default class gltfThreeScene {
  constructor(container) {
    this.container = container;
    this.scene = null;
    this.camera = null;
    this.renderer = null;

    this.init();
  }
  init() {
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color("#D8D8D8");

    this.renderer = new THREE.WebGLRenderer();
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
    const directionalLight = new THREE.DirectionalLight("white", 2);
    directionalLight.position.set(5,5,5); 

    directionalLight.castShadow=true
    directionalLight.shadow.mapSize.width = 1024;
directionalLight.shadow.mapSize.height = 1024;
    this.scene.add(directionalLight);

    const light = new THREE.AmbientLight("white"); 
    this.scene.add(light);

   
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    window.addEventListener("resize", () => {
      this.camera.aspect = window.innerWidth / window.innerHeight;
      this.camera.updateProjectionMatrix();
      this.renderer.setSize(window.innerWidth, window.innerHeight);
    });
   
    this.animate();
  }
  gltf(modelLink) {
    console.log('modelLink',modelLink);
    
    this.group = new THREE.Group();
    const loader = new GLTFLoader();
    loader.load(modelLink, (gltf) => {

      const box = new THREE.Box3().setFromObject(gltf.scene);
      const size = new THREE.Vector3();
      const center = new THREE.Vector3();
      box.getSize(size);
      box.getCenter(center);
  
      const maxSize = Math.max(size.x, size.y, size.z);
      const desiredSize = 3; 
      const scale = desiredSize / maxSize;
  
      gltf.scene.scale.setScalar(scale);
  
      const adjustedBox = new THREE.Box3().setFromObject(gltf.scene);
      const adjustedSize = new THREE.Vector3();
      const adjustedCenter = new THREE.Vector3();
      adjustedBox.getSize(adjustedSize);
      adjustedBox.getCenter(adjustedCenter);
  
      const bottomY = adjustedBox.min.y;
      const offsetY = -bottomY;
      gltf.scene.position.set(-adjustedCenter.x, offsetY, -adjustedCenter.z);
  
      gltf.scene.traverse((node) => {
        if (node.isMesh) {
          node.castShadow = true;
          node.receiveShadow = true;
        }
      });
  
      this.group.add(gltf.scene);
    });
  
    const geometry = new THREE.PlaneGeometry(100, 100);
    const material = new THREE.MeshStandardMaterial({
      color: "white",
      side: THREE.FrontSide,
      roughness: 0,
    });
    const plane = new THREE.Mesh(geometry, material);
    plane.receiveShadow = true;
    plane.rotateX(-Math.PI / 2);
    this.group.add(plane);
  
    this.scene.add(this.group);
  
    this.camera.position.set(-3, 2, -1);
    // this.camera.position.z = 1.5;

  }
  
  texture(textureLink) {
    const geometry = new THREE.BoxGeometry(1, 1, 1);
    let loader = new THREE.TextureLoader();
    let texture = loader.load(textureLink, () => {});
    const material = new THREE.MeshBasicMaterial({ map: texture });
    const cube = new THREE.Mesh(geometry, material);
    this.scene.add(cube);
    this.camera.position.z = 1.5;
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
