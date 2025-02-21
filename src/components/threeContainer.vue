<template>
  <div ref="threeContainer" class="three-container"></div>
</template>

<script>
import ThreeScene from "../Three/three.js";
// import Createproject from "@/views/Createproject.vue";
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
    this.initScene();
    // this.initializeThreeScene();
  },
  // beforeUnmount() {
  //   if (this.threeScene) {
  //     this.threeScene.dispose();
  //     this.threeScene = null;
  //   }
  // },
  methods: {
    // async initializeThreeScene() {
    //     // Simulating async initialization
    //     this.threeScene = await new Promise((resolve) => {
    //         setTimeout(() => resolve(new ThreeScene()), 1000); // Replace with actual initialization
    //     });
    //     console.log('threeScene initialized:', this.threeScene);
    // },
    create() {
      this.threeScene.createListener();
    },
    initScene() {
      this.threeContainer = this.$refs.threeContainer;
      this.threeScene = new ThreeScene(this.threeContainer);
      this.threeScene.predefined();
      console.log("three", this.threeScene);
    },
    update() {
      this.threeScene.cam = !this.threeScene.cam;

      this.threeScene.updateCamera();
    },
    modelLoad(model) {
      console.log("model", model);
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
    saveFile(projectname, userName) {
      console.log(this.threeScene);

      this.threeScene.saveFile(projectname, userName);
    },
    loadSaved(model) {
      console.log('final', model);

      const array = []
      model.coordinates.forEach((eachCoordinates) => {
        console.log("first", eachCoordinates);
        // eachCoordinates.forEach((each) => {
        //   const obj = {
        //     x: each.x,
        //     y: each.y,
        //     z: each.z,
        //   };
          array.push(eachCoordinates)
          console.log("array", array);

        // });
      });
      this.threeScene.predefined(array);
      console.log("awd",model);
      
      model.gltfObjects
      .forEach((val) => {
        console.log('jsv b',val);
        
        this.threeScene.gltfLoader(val.gltfLink, val.gltfScene)


      })
      // const modelLink = model.gltfObjects[0].gltfLink
      // const modelArea = model.gltfObjects[0].gltfScene
    },
    backHome() {
      // this.$parent.methods.return()
      console.log(this);
      this.$emit("backHome");
    },
  },
};
</script>

<style>
.three-container {
  width: 100%;
  height: 100vh;
}
</style>
