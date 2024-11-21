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
    this.scene.background = new THREE.Color("#D3D3D3");

    this.renderer = new THREE.WebGLRenderer();
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
    const directionalLight = new THREE.DirectionalLight("white", 0.5);
    this.scene.add(directionalLight);
    const light = new THREE.AmbientLight("white"); // soft white light
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
    const loader = new GLTFLoader();
    loader.load(modelLink, (gltf) => {
      let box = new THREE.Box3().setFromObject(gltf.scene);
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
      gltf.scene.scale.setScalar(1 / (maxSize / 3));
      gltf.scene.position.set(0, 0, 0);
      this.scene.add(gltf.scene);
    });
    this.camera.position.z = 5;
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
