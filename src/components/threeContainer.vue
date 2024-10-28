<template>
  <div ref="threeContainer" class="three-container"></div>
  <button @click="threeDim">3d</button>
</template>

<script setup>
import { onMounted, onBeforeUnmount, ref } from 'vue';
import ThreeScene from '../Three/init.js';

const threeContainer = ref(null);
let threeScene = null;

const threeDim = () =>{
  threeScene = new ThreeScene(threeContainer.value); 
  handleResize(); 
  window.addEventListener('resize', handleResize);

}
const handleResize = () => {
  if (threeScene) {
    threeScene.resize();
  }
};

onMounted(() => {
  threeDim()
});

onBeforeUnmount(() => {
  if (threeScene) {
    threeScene.cleanup();
  }
  window.removeEventListener('resize', handleResize);
});
</script>

<style scoped>
.three-container {
  width: 500%;
  height: 75vh;
  overflow: hidden;
}
</style>
