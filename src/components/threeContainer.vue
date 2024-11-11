<template>
  <div ref="threeContainer" class="three-container"></div>
</template>

<script>
import ThreeScene from "../Three/three.js";

export default {
  name: "ThreeSceneComponent",
  data() {
    return {
      threeContainer: null,
      threeScene: null,
      undoModels: [],
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
      this.threeScene.createListener();
    },
    update(){
      this.threeScene.cam=!this.threeScene.cam

      this.threeScene.updateCamera();

    },
    modelLoad(model){
console.log('model',model);
this.threeScene.predefined(model.cordinates);


    },
    gltfLoader(modelLink) {
      this.threeScene.gltfLoader(modelLink);

    },
    undoEvent() {
      const sceneModels = this.threeScene.scene.children;
      for (let i = 0; i < sceneModels.length; i++) {
        if (sceneModels[i].type == "Group" && i == sceneModels.length - 1) {
          this.undoModels.push(sceneModels[i]);
          this.threeScene.scene.remove(sceneModels[i]);
        }
      }
      
    },
    redoEvent() {
      console.log(this.undoModels);
    },
  },
};
</script>

<style>
.three-container {
  width: 100%;
  height: 95vh;
}
</style>