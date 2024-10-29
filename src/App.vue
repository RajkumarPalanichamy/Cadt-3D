<template>
  <div id="app">
    <Home />
  </div>
</template>

<script>
import Home from './views/HomeView.vue';

export default {
  name: 'App',
  components: {
    Home,
  },
};
</script>

<style>
#app {
  width:100%;
  height:100vh;
}
</style>
