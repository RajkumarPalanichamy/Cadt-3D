<template>
  <div ref="threeContainer" class="three-container"></div>
</template>

<script>
import gltfThreeScene from "../Three/gltfThree.js";
// import Createproject from "@/views/Createproject.vue";
export default {
  name: "gltfThreeSceneComponent",
  data() {
    return {
      threeContainer: null,
      threeScene: null,
    };
  },
  mounted() {
    this.threeContainer = this.$refs.threeContainer;
    this.threeScene = new gltfThreeScene(this.threeContainer);
    
  },

  methods: {
    gltf(modelLink) {
      this.threeScene.gltf(modelLink);
    },
    Texture(textureLink) {
      this.threeScene.texture(textureLink);
    },

  },
};
</script>

<style>
.three-container {
  width: 100%;
  height: 50vh;
}
</style>