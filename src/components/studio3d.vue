<template>
  <v-container :fluid="true" class="px-0 py-0">
    <v-toolbar class="px-2" color="#274E76" density="compact">
      <v-icon @click="closeIcon">mdi-close</v-icon>
    </v-toolbar>
    <!-- sidebar content -->
    <v-card
      style="position: absolute; right: 100px"
      height="80vh"
      class="mt-10 border"
      v-if="isSidebarCliked"
      width="300px"
    >
      <v-toolbar class="px-2" density="compact"
        >{{ title }}
        <v-spacer></v-spacer>
        <v-icon @click="isSidebarCliked = false">mdi-close</v-icon>
      </v-toolbar>
      <v-card class="grid" height="75vh" style="overflow-y: scroll;">
        <v-sheet 
        height="30px"
        v-for="(item, i) in displayData" :key="i"> </v-sheet>
      </v-card>
    </v-card>
    <!-- Sidebar icon -->
    <v-card
      class="d-flex px-4 py-2 border flex-column position-absolute right-0 mr-2"
      style="top: 300px"
      flat
      color="#F6F6F6"
    >
      <v-icon
        @click="sidebar(icon.tooltip)"
        class="my-2"
        style="cursor: pointer"
        v-tooltip="`${icon.tooltip}`"
        v-for="(icon, i) in sidebarIcons"
        :key="i"
      >
        {{ icon.icon }}</v-icon
      >
    </v-card>
    <!-- Scene Container -->
    <v-container class="px-0 py-0" :fluid="true">
      <div ref="threeContainer" class="three-container" style="height:90vh"></div>
    </v-container>
  </v-container>
</template>
<script>
import studio3dThreeScene from "@/Three/studio3d.js";
export default {
  name: "cadt3d-container",
  data() {
    return {
      threeContainer: null,
      threeScene: null,
      editData: [],
      modelData: ["", "", ""],
      displayData: [],
      title: "",
      sidebarIcons: [
        {
          icon: "mdi-square-edit-outline",
          tooltip: "Edit",
        },
        {
          icon: "mdi-view-day",
          tooltip: "Models",
        },
      ],
      isSidebarCliked: false,
    };
  },
  methods: {
    closeIcon() {
      this.$router.go(-1);
    },
    sidebar(value) {
      this.isSidebarCliked = true;
      if (value == "Edit") {
        this.title = "EDIT";
      } else {
        this.title = "MODELS";
        this.displayData = this.modelData;
      }
    },
  },
  mounted() {
    this.threeContainer = this.$refs.threeContainer;
    this.threeScene = new studio3dThreeScene(this.threeContainer);
  },
};
</script>
<style>
.grid{
  display: grid;

}
</style>
