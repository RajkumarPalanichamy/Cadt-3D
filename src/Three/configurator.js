import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

import TWEEN from 'https://cdn.jsdelivr.net/npm/@tweenjs/tween.js@18.6.4/dist/tween.esm.js'

export default class Configurator {
    constructor(container) {

        this.container = container;
        this.scene = null;
        this.camera = null;
        this.renderer = null;

        this.angle = null;
        this.currentDoor = null; // Track the door in the scene
        this.init();
    }

    init() {
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color("#E5E4E2");

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

        // Lighting
        this.directionalLight = new THREE.DirectionalLight("white", 3);
        this.directionalLight.castShadow = true;
        this.directionalLight.shadow.mapSize.width = 1024;
        this.directionalLight.shadow.mapSize.height = 1024;
        this.scene.add(this.directionalLight);

        this.angle = 0;

        const light = new THREE.AmbientLight("white", 2);
        this.scene.add(light);

        this.controls = new OrbitControls(this.camera, this.renderer.domElement);
        this.camera.position.set(2, 0, 2);

        window.addEventListener("resize", () => this.handleResize());
        
        this.door(); // Load initial door
        this.animate();
    }

    door(color, type) {
        console.log('🚪 Loading new door model...');
    
        // ✅ Ensure previous door is fully removed
        if (this.currentDoor) {
            console.log("🚨 Removing previous door...");
            this.scene.remove(this.currentDoor);
            this.currentDoor.traverse((node) => {
                if (node.isMesh) {
                    node.geometry.dispose();
                    if (node.material.map) node.material.map.dispose();
                    node.material.dispose();
                }
            });
            this.currentDoor = null;
        }
    
        const loader = new GLTFLoader();
        loader.load('./door.glb', (gltf) => {
            console.log("✅ New door model loaded.");
    
            // ✅ Scale model to a consistent size
            const box = new THREE.Box3().setFromObject(gltf.scene);
            const size = new THREE.Vector3();
            box.getSize(size);
    
            const maxSize = Math.max(size.x, size.y, size.z);
            const desiredSize = 3;
            const scaleFactor = desiredSize / maxSize;
    
            gltf.scene.scale.setScalar(scaleFactor);
            gltf.scene.position.set(0, -1.5, 0); // Adjust if needed
    
            this.scene.add(gltf.scene);
            this.currentDoor = gltf.scene; // Store reference to the new door
    
            let hinge = null;
            let doorMesh = null;
            let handle = null;
    
            // ✅ Identify door, hinge, and handle parts
            gltf.scene.traverse((node) => {
                if (node.isMesh) {
                    node.castShadow = true;
                    node.receiveShadow = true;
    
                    if (node.name === 'Cube001_1') {
                        hinge = node; // Store the hinge part
                    }
                    if (node.name === 'Cylinder') {
                        handle = node; // Store the handle part
                    }

                    if (node.name === 'Cube001') {
                        doorMesh = node; // Store the door part
                    }
    
                    // ✅ Apply Color or Texture
                    if (node.name === 'Cube001') {
                        if (type === "color") {
                            node.material.color.set(color ? color : 'red');
                            node.material.roughness = 1;
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
    
            // ✅ Ensure door is not attached to a previous parent
            if (doorMesh && doorMesh.parent) {
                doorMesh.parent.remove(doorMesh);
                doorMesh.updateMatrixWorld(true);
            }
    
            // ✅ Create pivot for swinging animation
            if (hinge  && doorMesh) {
                const pivot = new THREE.Group();
                this.scene.add(pivot);
    
                // Move pivot to hinge position
                hinge.getWorldPosition(pivot.position);
                hinge.getWorldScale(pivot.scale);
                hinge.getWorldQuaternion(pivot.rotation);

                hinge.parent.remove(hinge);
                pivot.add(hinge);
    
                 
                pivot.add(doorMesh);
                doorMesh.getWorldPosition(pivot.position);
                doorMesh.getWorldScale(pivot.scale);

                doorMesh.updateMatrixWorld(true);
                pivot.updateMatrixWorld(true);
    
                console.log("✅ Door, hinge, and handle correctly reparented and positioned!");
    
                // ✅ Swing Animation
                if (type === 'swing') {
                    console.log('color', color);
                    let swingDirection = (color.name === 'Outwards') ? Math.PI / 2 : -Math.PI / 2;
                    
                    new TWEEN.Tween(pivot.rotation)
                        .to({ y: swingDirection }, 1000)  // Rotate 90° outward or inward
                        .easing(TWEEN.Easing.Quadratic.InOut)
                        .start();
                }
    
                this.currentDoor = pivot; // Store the pivot for future removal
            } else {
                console.warn("⚠️ Hinge or doorMesh not found in the GLTF model!");
            }
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
        TWEEN.update();


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

