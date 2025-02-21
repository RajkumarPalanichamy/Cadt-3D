<template>
  <v-container :fluid="true" class="px-0 py-0">
    <v-toolbar class="px-2" color="#274E76" density="compact">
      <v-icon @click="closeIcon">mdi-close</v-icon>
      <v-card-text class="text-subtitle-1 font-weight-bold"
        >STUDIO 3D</v-card-text
      >
    </v-toolbar>
    <!-- sidebar content -->
    <v-card
      style="position: absolute; z-index: 1; right: 100px"
      height="80vh"
      class="mt-10 border"
      v-if="isSidebarCliked"
      width="350px"
    >
      <v-toolbar color="#274E76" class="px-2" density="compact"
        >{{ title }}
        <v-spacer></v-spacer>
        <v-icon @click="isSidebarCliked = false" v-tooltip="'leave'"
          >mdi-close</v-icon
        >
      </v-toolbar>
      <v-icon
        v-if="!categoryCard"
        @click="(categoryCard = true), (modelLoader = false)"
        >mdi-arrow-left</v-icon
      >
      <!-- EDIT Content -->
      <v-form class="px-2 mt-10" v-if="isEdit">
        <v-card-text class="px-1 py-0 mb-1">Height :</v-card-text>
        <v-number-input
          placeholder="Height"
          v-model="height"
          controlVariant="stacked"
          variant="outlined"
          density="compact"
          class="mb-2"
        ></v-number-input>
        <v-card-text class="px-1 py-0 mb-1">Width :</v-card-text>

        <v-number-input
          density="compact"
          placeholder="Width"
          v-model="width"
          controlVariant="stacked"
          variant="outlined"
          class="mb-2"
        ></v-number-input>
        <v-card-text class="px-1 py-0 mb-1">Depth :</v-card-text>

        <v-number-input
          density="compact"
          placeholder="Depth"
          v-model="depth"
          controlVariant="stacked"
          variant="outlined"
          class="mb-2"
        ></v-number-input>
      </v-form>
      <!-- model card -->
      <v-container
        v-if="isModel"
        height="75vh"
        style="overflow-y: scroll"
        :fluid="true"
      >
        <!-- loding -->
        <v-card
          flat
          class="d-flex flex-column align-center justify-center mt-16 pt-16"
          v-if="modelLoader"
        >
          <v-progress-circular color="primary" indeterminate>
          </v-progress-circular>
          <v-card-text class="text-subtitle-2"
            >Please Wait , It Will take some time .. !
          </v-card-text>
        </v-card>

        <v-card class="grid py-4" width="100%" flat>
          <!-- Categories Card -->
          <v-card
            v-if="categoryCard"
            v-for="(model, i) in modelCategories"
            :key="i"
            height="150px"
            class="elevation-3"
            @click="selectedCategoty(model.category)"
          >
            <img cover height="70%" :src="model.image" />
            <v-card-text class="text-center py-0 text-subtitle-2">
              {{ model.category }}</v-card-text
            >
          </v-card>
          <!-- model Card -->
          <v-card
            v-if="!categoryCard"
            v-for="(model, i) in modelData"
            :key="i"
            class="border draggable-card"
            height="120px"
            @dragstart="onDragStart(model)"
            :draggable="isDrag"
            flat
          >
            <v-sheet width="100%" height="80%" class="text-center px-0 py-0">
              <v-img :src="model.modelImg" cover></v-img>
            </v-sheet>
            {{ model.modelType }}
          </v-card>
        </v-card>
      </v-container>
    </v-card>
    <v-btn
      v-if="showModelIcon"
      icon
      v-for="(icon, index) in IconForModel"
      :key="index"
      size="3em"
      :style="getIconStyle(index)"
      v-tooltip="icon.text"
      @click="clickedIcon(icon.text)"
      class="position-absolute btn-hover"
    >
      <v-icon>{{ icon.icon }}</v-icon>
    </v-btn>

    <!-- Sidebar icon -->
    <v-card
      height="100px"
      class="d-flex px-4 py-2 border flex-column position-absolute right-0 mr-2"
      style="
        top: 50%;
        right: 0;
        transform: translateY(-50%);
        width: 60px;
        background-color: #274e76;
        border-radius: 8px;
      "
      flat
      color="#274E76"
    >
      <v-icon
        @click="sidebar(icon.tooltip)"
        class="my-2"
        style="cursor: pointer; font-size: 24px; opacity: 0.9"
        v-tooltip="`${icon.tooltip}`"
        v-for="(icon, i) in sidebarIcons"
        :key="i"
      >
        {{ icon.icon }}</v-icon
      >
    </v-card>
    <!-- Scene Container -->
    <v-container
      @dragover.prevent="onDragOver"
      @drop="onDrop"
      style="cursor: pointer"
      :fluid="true"
      class="px-0 py-0"
    >
      <div
        ref="threeContainer"
        class="three-container"
        style="height: 93vh; cursor: pointer"
      ></div>
    </v-container>
  </v-container>
</template>
<script>
import studio3dThreeScene from "@/Three/studio3d.js";
import axios from "axios";
import { mapState } from "vuex";
export default {
  name: "cadt3d-container",
  data() {
    return {
      threeContainer: null,
      threeScene: null,
      categoryCard: true,
      showModelIcon: false,
      modelData: [],
      modelLoader: false,
      modelCategories: [
        { category: "Living Room", image: "/images/Livingroom.jpg" },
        { category: "Bed Room", image: "/images/bedroom.jpg" },
        { category: "Kitchen Room", image: "/images/kitchen.jpeg" },
      ],
      title: "",
      // modelClicked: null,
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
      height: null,
      width: null,
      depth: null,
      wallValues: null,
      isDrag: true,

      IconForModel: [
        { icon: "mdi-delete", text: "Delete" },
        { icon: "mdi-rotate-right-variant", text: "Rotate" },
      ],
      iconPosition: [],
    };
  },
  watch: {
    width(newValue) {
      this.wallValues = {
        height: this.height,
        width: newValue,
        depth: this.depth,
      };
      this.threeScene.create(this.wallValues);
    },
    height(newValue) {
      this.wallValues = {
        height: newValue,
        width: this.width,
        depth: this.depth,
      };
      this.threeScene.create(this.wallValues);
    },
    depth(newValue) {
      this.wallValues = {
        height: this.height,
        width: this.width,
        depth: newValue,
      };
      this.threeScene.create(this.wallValues);
    },
    studioButton(newValue) {
      console.log("newValue.position", newValue.position);

      if (newValue.value == true) {
        this.showModelIcon = true;

        this.addingIcons(newValue.position);
      } else {
        this.showModelIcon = false;
      }
    },
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
      }
    },
    addingIcons(event) {
      const rect = event.target.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      this.iconPosition = [
        { x: x - 70, y: y - 50 },
        { x: x + 70, y: y - 50 },
        { x: x, y: y - 100 },
        { x: x, y: y + 50 },
      ];
      this.showModelIcon = true;
    },
    getIconStyle(index) {
      const position = this.iconPosition[index];
      if (position) {
        return {
          left: `${position.x}px`,
          top: `${position.y}px`,
        };
      }
      return {};
    },
    selectedCategoty(category) {
      const selectedCategory = category.split(" ").join("").toLowerCase();
      this.categoryCard = false;
      this.modelLoader = true;
      this.loadModels(selectedCategory);
    },
    onDragStart(modelLink) {
      const draggedModel = JSON.stringify(modelLink);
      event.dataTransfer.setData("modelData", draggedModel);

      const dragStartEvent = new CustomEvent("model-drag-start", {
        detail: { droppedText: draggedModel, mouse: { x: 0, y: 0 } },
      });

      window.dispatchEvent(dragStartEvent);
    },

    onDragOver(event) {
      event.preventDefault();
      this.isSidebarCliked = false;

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
      const droppedText = JSON.parse(event.dataTransfer.getData("modelData"));
      console.log("droppedText", droppedText);

      event.target.classList.remove("hide-drag-image");
      this.isSidebarCliked = true;

      // Calculate mouse position
      const mouse = {
        x: (event.clientX / event.target.clientWidth) * 2 - 1,
        y: -(event.clientY / event.target.clientHeight) * 2 + 1,
      };

      // Dispatciruch the model-drop event with model link and position
      const dropEvent = new CustomEvent("model-drop", {
        detail: { droppedText, mouse },
      });
      window.dispatchEvent(dropEvent);
    },
    async loadModels(selectedCategory) {
      this.modelData = [];
      const response = await axios.get(
        `${import.meta.env.VITE_API_LINK}/glb/getglbloaders`
      );

      if (response.status == "200") {
        response.data.forEach((model) => {
          if (
            model.category.split(" ").join("").toLowerCase() ==
            selectedCategory.toLowerCase()
          ) {
            this.modelData.push(model);
          }
        });
      }
      this.modelLoader = false;
    },
  },
  computed: {
    ...mapState(["studioButton"]),
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
.draggable-card:hover {
  transition: 0.2s;
  opacity: 0;
}
</style>
