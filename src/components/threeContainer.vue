<!-- Changes in Style -->
<template>
  <div ref="threeContainer" class="three-container">
    <!-- <button @click="create()">3D</button> -->
  </div>
</template>

<script>
// import { ref, onBeforeUnmount } from 'vue';
import ThreeScene from '../Three/three.js';

export default {
  name: 'ThreeSceneComponent',
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
  beforeUnmount() {
    if (this.threeScene) {
      this.threeScene.dispose();
      this.threeScene = null;
    }
  },
  methods:{
    create(){
      this.threeScene.updateCamera()
    }
  }
};
</script>

<style>
.three-container {
  width: 100%;
  height: 100vh;
}
</style>
