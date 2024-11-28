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
        <v-icon @click="isSidebarCliked = false" v-tooltip="'leave'"
          >mdi-close</v-icon
        >
      </v-toolbar>
      <!-- EDIT Content -->
      <v-form class="px-2 mt-10" v-if="isEdit">
        <v-number-input
          label="Height"
          v-model="height"
          variant="underlined"
          class="mb-2"
        ></v-number-input>
        <v-number-input
          label="Width"
          v-model="width"
          variant="underlined"
          class="mb-2"
        ></v-number-input>
        <v-number-input
          label="Depth"
          v-model="depth"
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
          @dragstart="
                    onDragStart(
                      model.FurnituresImagesArraywithGltf[0].furnitureGltfLoader
                    )
                  "
          :draggable="isDrag"
          flat
          style="cursor: grab"

        >
          <v-sheet width="100%" height="80%" class="text-center px-0 py-0">
            <v-img
              cover

              :src="model.FurnituresImagesArraywithGltf[0].furnitureImage"
              draggable="true"

              class="hover"
              :src="model.FurnituresImagesArraywithGltf[0].furnitureImage"
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

    <v-container class="px-0 py-0"
     :fluid="true"

      >
      <div
        ref="threeContainer"
        class="three-container"
        style="height: 90vh;cursor: pointer"
        @dragover.prevent="onDragOver"
      @drop="onDrop"

      ></div>

    </v-container>
  </v-container>
</template>
<script>
import axios from "axios";
import studio3dThreeScene from "@/Three/studio3d.js";
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
      height: null,
      width: null,
      depth:null,
      wallValues:null,
      isDrag: true,

    };
  },
  watch:{
    width(newValue){
      this.wallValues = {
        height:this.height,
        width:newValue,
        depth:this.depth

      } 
      this.threeScene.create(this.wallValues)
    },
    height(newValue){
      this.wallValues = {
        height:newValue,
        width:this.width,
        depth:this.depth

      } 
      this.threeScene.create(this.wallValues)

    },
    depth(newValue){
      this.wallValues = {
        height:this.height,
        width:this.width,
        depth:newValue
      } 
      this.threeScene.create(this.wallValues)

    }
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
          `${import.meta.env.VITE_API_LINK}/furniture/getFurnitures`
        );
        if (response.status == "200") {
          this.isModelLoading = false;
          this.modelData = response.data;
        }
      }
    },
    onDragStart(modelLink) {

      console.log('modelLink',modelLink);
      
      const draggedModel = modelLink; // The URL or path to the GLTF model
      event.dataTransfer.setData("text/plain", draggedModel);

      const dragStartEvent = new CustomEvent("model-drag-start", {
        detail: { droppedText: draggedModel, mouse: { x: 0, y: 0 } },
      });
      window.dispatchEvent(dragStartEvent);

    },

    onDragOver(event) {
      event.preventDefault();
      this.isSidebarCliked = false;

      // Calculate mouse position
      const mouse = {
        x: (event.clientX / event.target.clientWidth) * 2 - 1,
        y: -(event.clientY / event.target.clientHeight) * 2 + 1,
      };

      // Dispatch the model-drag-move event to update placeholder position
      const dragMoveEvent = new CustomEvent("model-drag-move", {
        detail: { mouse },
      });
      window.dispatchEvent(dragMoveEvent);
    },

    onDrop(event) {
      const droppedText = event.dataTransfer.getData("text/plain");
      console.log("Dropped Model:", droppedText);

      this.isSidebarCliked = true;

      // Calculate mouse position
      const mouse = {
        x: (event.clientX / event.target.clientWidth) * 2 - 1,
        y: -(event.clientY / event.target.clientHeight) * 2 + 1,
      };

      // Dispatch the model-drop event with model link and position
      const dropEvent = new CustomEvent("model-drop", {
        detail: { droppedText, mouse },
      });
      window.dispatchEvent(dropEvent);
    },
  },
  mounted() {
    this.threeContainer = this.$refs.threeContainer;
    this.threeScene = new studio3dThreeScene(this.threeContainer);
    this.threeScene.create(this.wallValues);
  },
};
</script>
<style scoped>
.grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
}
.hover_icon:hover {
  color: #274e76;
}
</style>
