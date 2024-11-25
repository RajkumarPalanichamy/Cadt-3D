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
      <v-toolbar color="#274E76" class="px-2" density="compact"
        >{{ title }}
        <v-spacer></v-spacer>
        <v-icon @click="isSidebarCliked = false" v-tooltip="'leave'">mdi-close</v-icon>
      </v-toolbar>
      <!-- EDIT Content -->
      <v-form class="px-2 mt-10" v-if="isEdit">
        <v-number-input
          label="Height"
          variant="underlined"
          class="mb-2"
        ></v-number-input>
        <v-number-input
          label="width"
          variant="underlined"
          class="mb-2"
        ></v-number-input>
      </v-form>
      <!-- model card -->
      <v-container
        v-if="isModel"
        :loading="isModelLoading"
        :fluid="true"
        class="grid"
        height="75vh"
        width="100%"
        style="overflow-y: scroll"
      >
        <v-card
          v-for="(model, i) in modelData"
          :key="i"
          class="px-2 py-2 border"
          height="130px"
          flat
        >
          <v-sheet width="100%" height="80%" class="text-center px-0 py-0">
            <v-img
              cover
              :src="model.FurnituresImagesArraywithGltf[0].furnitureImage"
              class="hover"
            ></v-img>
          </v-sheet>
          <v-sheet class="text-center"> {{ model.modelType }}</v-sheet>
        </v-card>
      </v-container>
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
        class="my-2 hover_icon"
        style="cursor: pointer"
        v-tooltip="`${icon.tooltip}`"
        v-for="(icon, i) in sidebarIcons"
        :key="i"
      >
        {{ icon.icon }}</v-icon
      >
    </v-card>
    <!-- Scene Container -->
    <v-container class="px-0 py-0">
      <div ref="threeContainer" class="three-container"></div>
    </v-container>
  </v-container>
</template>
<script>
import cadt3dThreeScene from "@/Three/cadt3d";
import axios from "axios";
export default {
  name: "cadt3d-container",
  data() {
    return {
      threeContainer: null,
      threeScene: null,
      modelData: ["", "", ""],
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
      isEdit: false,
      isModel: false,
      isModelLoading: false,
    };
  },
  methods: {
    closeIcon() {
      this.$router.go(-1);
    },
    async sidebar(value) {
      this.isSidebarCliked = true;
      if (value == "Edit") {
        this.title = "EDIT";
        this.isEdit = true;
        this.isModel = false;
      } else {
        this.isEdit = false;
        this.isModel = true;
        this.title = "MODELS";
        this.isModelLoading = true;
        const response = await axios.get(
          `${import.meta.env.VITE_API_LINK}/getFurnitures`
        );
        if (response.status == "200") {
          this.isModelLoading = false;
          this.modelData = response.data;
          console.log("models", this.modelData);
        }
      }
    },
  },
  mounted() {
    this.threeContainer = this.$refs.threeContainer;
    this.threeScene = new cadt3dThreeScene(this.threeContainer);
  },
};
</script>
<style scoped>
.grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
}
.hover_icon:hover{
  color:#274E76 ;
}
</style>
