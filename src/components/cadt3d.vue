<template>
    <div ref="threeContainer" class="three-container"></div>
</template>
<script>
import cadt3dThreeScene from '@/Three/cadt3d';
  export default {
    name: "cadt3d-container",
    data() {
      return {
        threeContainer: null,
        threeScene: null,
      };
    },
    mounted() {
      this.threeContainer = this.$refs.threeContainer;
      this.threeScene = new cadt3dThreeScene(this.threeContainer);
  
    },
  

  }
</script>
<style>
.three-container {
  width: 100%;
  height: 100vh;
}
</style>