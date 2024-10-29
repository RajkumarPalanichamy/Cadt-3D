<template>
  <div id="mainView">
    <h1>HomeView component</h1>
    <div class="scene">
    <ThreeSceneComponent />
     </div>
  </div>
</template>

<script>
import ThreeSceneComponent from '../components/threeContainer.vue';

export default {
  name: 'App',
  components: {
    ThreeSceneComponent,
  },
};
</script>

<style>
#mainView {
  color: 'white';
  background-color: rgb(60, 0, 255);
  width:90%;
  margin: 0 auto;
}
.scene{
  width:100%;
  /* overflow: scroll; */
}
</style>
