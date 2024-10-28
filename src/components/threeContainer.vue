<template>
  <div ref="threeContainer" class="three-container"></div>
</template>

<script>
import ThreeScene from '../Three/init.js';

export default {
  name: 'ThreeScene',
  mounted() {
    this.threeScene = new ThreeScene(this.$refs.threeContainer);

    window.addEventListener('resize', this.handleResize);
  },
  beforeUnmount() {
    
    this.threeScene.cleanup();
    window.removeEventListener('resize', this.handleResize);
  },
  methods: {
    handleResize() {
      this.threeScene.resize();
    }
  }
};
</script>

<style >
.three-container {
  width: 100%;
  height: 75vh;
  overflow: hidden;
  
}
</style>
