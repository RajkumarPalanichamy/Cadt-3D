import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";


export default class gltfThreeScene {

    constructor(container){
        this.container = container;
        this.scene = null;
        this.camera = null;
        this.renderer = null;
    
this.init()
    }
    init(){
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
            0.1,
            1000
          );
          this.controls = new OrbitControls(this.camera, this.renderer.domElement);
          window.addEventListener("resize", () => {
            this.camera.aspect = window.innerWidth / window.innerHeight;
            this.camera.updateProjectionMatrix();
            this.renderer.setSize(window.innerWidth, window.innerHeight);
          });
        this.gltf()
        this.animate();
    }
    gltf(){
        const geometry = new THREE.BoxGeometry( 1, 1, 1 );
const material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
const cube = new THREE.Mesh( geometry, material );
this.scene.add( cube );

this.camera.position.z = 3;
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