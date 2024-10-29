<template>
    <v-app>
        <RouterView />
    </v-app>
  <!-- <div id="app">
    <Home />
     <Createproject />
  </div> -->
</template>

<script>
// import Home from './views/HomeView.vue';
// import Createproject from './views/Createproject.vue';
export default {
  name: 'App',
  // components: {
  //   Home,
  //   Createproject
  // },
};
</script>

<style>
#app {
  width:100%;
  height:100vh;
}
</style>
