<template>
  <div ref="threeContainer" class="three-container"></div>
</template>

<script>
import ThreeScene from "../Three/three.js";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

export default {
  name: "ThreeSceneComponent",
  data() {
    return {
      threeContainer: null,
      threeScene: null,
    };
  },
  mounted() {
    this.threeContainer = this.$refs.threeContainer;
    this.threeScene = new ThreeScene(this.threeContainer);
  },
  // beforeUnmount() {
  //   if (this.threeScene) {
  //     this.threeScene.dispose();
  //     this.threeScene = null;
  //   }
  // },
  methods: {
    create() {
      // this.threeScene.cam=!this.threeScene.cam
      this.threeScene.updateCamera();
    },
    gltfLoader(modelLink) {
      const loader = new GLTFLoader();
      loader.load(modelLink, (gltf) => {

        this.threeScene.scene.add(gltf.scene);
      });
    },
    undoEvent() {
      const sceneModels = this.threeScene.scene.children;
      for (let i = 0; i < sceneModels.length; i++) {
        if (sceneModels[i].type == "Group" && i == sceneModels.length - 1) {
          this.threeScene.scene.remove(sceneModels[i]);
        }
      }
    },
    redoEvent(){

    }
  },
};
</script>

<style>
.three-container {
  width: 100%;
  height: 95vh;
}
</style>
